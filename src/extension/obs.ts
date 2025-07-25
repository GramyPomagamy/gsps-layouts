/* eslint-disable @typescript-eslint/ban-ts-comment */
import OBSWebSocket from 'obs-websocket-js';
import FoobarControl from './foobar';
import request from 'request';
import { Commentators, Hosterka, ObsData, WindowInfo } from '../types/generated';
import { Cropper, Asset, TransformProperties } from '../types/custom';
import { get } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';
import { RunDataActiveRun } from 'speedcontrol/src/types';

type VideoTypes = 'charity' | 'sponsors';
const nodecg = get();

const obsDataReplicant = nodecg.Replicant<ObsData>('obsData', { persistent: false });
const commentatorsReplicant = nodecg.Replicant<Commentators>('commentators');
const activeRunReplicant = nodecg.Replicant<RunDataActiveRun>(
  'runDataActiveRun',
  'nodecg-speedcontrol'
);
const playLongVideoReplicant = nodecg.Replicant<boolean>('playLongVideo');
const videosCharity = nodecg.Replicant<Asset[]>('assets:videos-charity');
const videosSponsors = nodecg.Replicant<Asset[]>('assets:videos-sponsors');
const videosLong = nodecg.Replicant<Asset[]>('assets:videos-long');
const hosterkaReplicant = nodecg.Replicant<Hosterka>('hosterka');
const hostMuteStatusReplicant = nodecg.Replicant<boolean>('hostMuteStatus');
const showBidsPanel = nodecg.Replicant<boolean>('showBidsPanel');
const showPrizePanel = nodecg.Replicant<boolean>('showPrizePanel');

const obs = new OBSWebSocket();
const config = nodecg.bundleConfig.obs;
const foobarConfig = nodecg.bundleConfig.foobar;
let foobar: FoobarControl;
if (foobarConfig.enabled) {
  foobar = new FoobarControl(foobarConfig.address!);
}
const log = new TaggedLogger('OBS');
let reconnectTimeout: NodeJS.Timeout;
let loggedTimestampForCurrentGame = false;
let videoToPlay: Asset | undefined;
let videoType: VideoTypes = 'sponsors';
let videosPlayed = 0;
let previousSponsorVideoIndex : number | undefined = undefined;
let previousCharityVideoIndex : number | undefined = undefined;
let previousLongVideoIndex : number | undefined = undefined;

// Connect to OBS
if (config.enabled) {
  obsDataReplicant.value!.croppers = [];
  for (const cropper of config.croppers!) {
    obsDataReplicant.value!.croppers.push(cropper);
  }

  log.info('Próbuję się połączyć z OBSem...');
  obs
    .connect(config.address, config.password)
    .then(() => {
      if (config.sources && config.sources.intermissionVideo) {
        obs
          .call('SetInputSettings', {
            inputName: config.sources.intermissionVideo,
            inputSettings: {
              input: '',
            },
          })
          .catch((err) => {
            log.error('Nie udało się wyzerować filmu na przerwie: ', err);
          });
      }
      initializeHostMute();
    })
    .catch((err) => {
      log.error(`Nie udało się połączyć z OBSem! Powód: ${err}`);
      reconnectTimeout = setTimeout(reconnectToOBS, 5000);
    });
}

function initializeHostMute() {
  let channel = config.sources!.hostAudio;

  obs.
  call("GetInputMute", {inputName: channel})
  .then((data) => {
    hostMuteStatusReplicant.value = data.inputMuted;
  })
  .catch((err) => {
    log.error(`Nie udało się pobrać wartości mute dla: ${channel}! Powód: ${err}`);
  });

}

function toggleHostMute() {
  const channel = config.sources!.hostAudio;
  obs
  .call("SetInputMute", {inputName: channel, inputMuted: !hostMuteStatusReplicant.value})
  .catch((err) => {
    log.error(`Nie udało się zmienić wartości mute dla: ${channel}! Powód: ${err}`);
  });
  // we don't have to update the replicant here, because we listen to obs events anyway
}

function reconnectToOBS() {
  clearTimeout(reconnectTimeout);
  if (!obsDataReplicant.value!.connected && config.enabled) {
    log.info('Próbuję się połączyć z OBSem...');
    obs.connect(config.address, config.password).catch((err) => {
      log.error(`Nie udało się połączyć z OBSem! Powód: ${err}`);
      reconnectTimeout = setTimeout(reconnectToOBS, 5000);
    });
  }
}

function switchToIntermission() {
  if (obsDataReplicant.value?.scene === config.scenes!.intermission) return; // if we're already on intermission, don't do anything


  nodecg.sendMessageToBundle('changeToNextRun', 'nodecg-speedcontrol');
  if (!obsDataReplicant.value!.studioMode) {
    obs.call('SetStudioModeEnabled', { studioModeEnabled: true }).catch((err) => {
      log.error(`Wystąpił błąd przy włączaniu Studio Mode: ${err};
        }`);
    });
  }
  try {
    if (obsDataReplicant.value?.studioMode) {
      obs.call('SetCurrentPreviewScene', {
        sceneName: config.scenes!.intermission,
      });
    }

    obs.call('SetCurrentProgramScene', {
      sceneName: config.scenes!.intermission,
    });
  } catch (error) {
    log.error('Nie udało się zmienić sceny na przerwę: ', error);
  }

  obsDataReplicant.value!.scene = config.scenes!.intermission; // sometimes this isn't set automatically, setting it here just in case
  setTimeout(() => {
    nodecg.sendMessage('hideNames');
    hosterkaReplicant.value = {
      hostL: { name: '', pronouns: '' },
      hostR: { name: '', pronouns: '' },
    };
    showBidsPanel.value = false;
    showPrizePanel.value = false;
    resetAllCrops();
    commentatorsReplicant.value = [];
    nodecg.sendMessage('intermissionStarted');
  }, config.stingerActionDelay);
}

function switchFromHostScreen() {
  obs.call('SetCurrentPreviewScene', {
    sceneName: config.scenes!.intermission,
  });
  obs.call('SetCurrentProgramScene', {
    sceneName: config.scenes!.intermission,
  });
  obsDataReplicant.value!.scene = config.scenes!.intermission; // sometimes this isn't set automatically, setting it here just in case
  hosterkaReplicant.value = {
    hostL: { name: '', pronouns: '' },
    hostR: { name: '', pronouns: '' },
  };
  showBidsPanel.value = false;
  showPrizePanel.value = false;

  // clear intermission video source
  if (config.sources && config.sources.intermissionVideo) {
    obs
      .call('SetInputSettings', {
        inputName: config.sources.intermissionVideo,
        inputSettings: {
          input: '',
        },
      })
      .catch((err) => {
        log.error('Nie udało się wyzerować filmu na przerwie: ', err);
      });
  }

  videosPlayed = 0;
}

function playLongVideo() {
  log.debug('Puszczam długi film');
  let videoIndex;
  do {
    videoIndex = Math.floor(Math.random() * videosLong.value!.length);
    videoToPlay = videosLong.value![videoIndex];
  }
  while (videosLong.value!.length > 1 && videoIndex == previousLongVideoIndex)
  previousLongVideoIndex = videoIndex;

  if (videoToPlay) {
    setTimeout(() => {
      obs.call('SetInputSettings', {
        inputName: config.sources!.intermissionVideo,
        inputSettings: {
          input: `http://localhost:${nodecg.config.port}${videoToPlay!.url}`,
        },
      });
    }, config.stingerActionDelay);
  } else {
    log.error('Nie udało puścić się długiego filmu');
  }
}

function playShortVideo(type: VideoTypes) {
  log.debug('Puszczam krótki film');
  let videoIndex;

  if (type == 'charity') {
    do {
      videoIndex = Math.floor(Math.random() * videosCharity.value!.length)
      videoToPlay = videosCharity.value![videoIndex];
    }
    while (videosCharity.value!.length > 1 && videoIndex == previousCharityVideoIndex)
    previousCharityVideoIndex = videoIndex;
  } else {
    do {
      videoIndex = Math.floor(Math.random() * videosSponsors.value!.length)
      videoToPlay = videosSponsors.value![videoIndex];
    }
    while (videosSponsors.value!.length > 1 && videoIndex == previousSponsorVideoIndex)
    previousSponsorVideoIndex = videoIndex;
  }

  if (videoToPlay) {
    videosPlayed++;
    setTimeout(() => {
      obs.call('SetInputSettings', {
        inputName: config.sources!.intermissionVideo,
        inputSettings: {
          input: `http://localhost:${nodecg.config.port}${videoToPlay!.url}`,
        },
      });
    }, config.stingerActionDelay);
  } else {
    log.error('Nie udało puścić się krótkiego filmu');
  }
}

async function playIntermissionVideo(longVideo: boolean) {
  videosPlayed = 0;
  playLongVideoReplicant.value = longVideo;
  obs.call('SetCurrentProgramScene', { sceneName: config.scenes!.video });
  if (longVideo) {
    playLongVideo();
  } else {
    videoType = 'sponsors';
    playShortVideo(videoType);
  }
}

function crop(cropInfo: { cropperIndex: number; windowInfo: WindowInfo }) {
  const cropperIndex = cropInfo.cropperIndex;
  const windowInfo = cropInfo.windowInfo;
  const cropperConfig = obsDataReplicant.value!.croppers[cropperIndex];

  obs
    .call('GetSceneItemId', {
      sceneName: cropperConfig!.sceneName,
      sourceName: cropperConfig!.sourceName,
    })
    .then((data) => {
      const itemId = data.sceneItemId;
      obs
        .call('GetSceneItemTransform', {
          sceneName: cropperConfig!.sceneName,
          sceneItemId: itemId,
        })
        .then((data) => {
          const transformData = data.sceneItemTransform as unknown as TransformProperties;
          const width = transformData.width;
          const height = transformData.height;

          const top = windowInfo.y;
          const bottom = height - windowInfo.y - windowInfo.h;
          const left = windowInfo.x;
          const right = width - windowInfo.x - windowInfo.w;

          obs
            .call('SetSceneItemTransform', {
              sceneName: cropperConfig!.sceneName,
              sceneItemId: itemId,
              sceneItemTransform: {
                cropTop: top,
                cropBottom: bottom,
                cropLeft: left,
                cropRight: right,
              },
            })
            .catch((error) => {
              log.error(`Failed to crop ${cropperConfig!.sourceName}. Error: ${error}`);
            });
        })
        .catch((error) => {
          log.error(
            `Failed to fetch source ${cropperConfig!.sourceName} properties. Error: ${error}`
          );
        });
    })
    .catch((error) => {
      log.error(`Failed to fetch source ${cropperConfig!.sourceName} id. Error: ${error}`);
    });
}

function crop4By3(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value!.croppers[cropperIndex];
  obs
    .call('GetSceneItemId', {
      sceneName: cropperConfig!.sceneName,
      sourceName: cropperConfig!.sourceName,
    })
    .then((data) => {
      const itemId = data.sceneItemId;
      obs
        .call('GetSceneItemTransform', {
          sceneName: cropperConfig!.sceneName,
          sceneItemId: itemId,
        })
        .then((data) => {
          const transformData = data.sceneItemTransform as unknown as TransformProperties;
          const width = transformData.width;

          const top = 0;
          const bottom = 0;
          const margin = width / 8;
          const left = margin;
          const right = margin;

          obs
            .call('SetSceneItemTransform', {
              sceneName: cropperConfig!.sceneName,
              sceneItemId: itemId,
              sceneItemTransform: {
                cropTop: top,
                cropBottom: bottom,
                cropLeft: left,
                cropRight: right,
              },
            })
            .catch((error) => {
              log.error(`Failed to crop ${cropperConfig!.sourceName}. Error: ${error}`);
            });
        })
        .catch((error) => {
          log.error(
            `Failed to fetch source ${cropperConfig!.sourceName} properties. Error: ${error}`
          );
        });
    })
    .catch((error) => {
      log.error(`Failed to fetch source ${cropperConfig!.sourceName} id. Error: ${error}`);
    });
}

function resetCrop(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value!.croppers[cropperIndex];

  obs
    .call('GetSceneItemId', {
      sceneName: cropperConfig!.sceneName,
      sourceName: cropperConfig!.sourceName,
    })
    .then((data) => {
      const itemId = data.sceneItemId;
      obs
        .call('SetSceneItemTransform', {
          sceneName: cropperConfig!.sceneName,
          sceneItemId: itemId,
          sceneItemTransform: {
            cropTop: 0,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
          },
        })
        .catch((error) => {
          log.error(`Failed to crop ${cropperConfig!.sourceName}. Error: ${error}`);
        });
    })
    .catch((error) => {
      log.error(`Failed to fetch source ${cropperConfig!.sourceName} id. Error: ${error}`);
    });
}

function resetAllCrops() {
  for (let i = 0; i < obsDataReplicant.value!.croppers.length; i++) {
    resetCrop(i);
  }
}

function refreshWindows(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value!.croppers[cropperIndex];

  request(cropperConfig!.url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let windows;
      try {
        windows = JSON.parse(body) as WindowInfo[];
      } catch (e) {
        log.error(
          `Could not parse windows for ${cropperConfig!.name}, response not a valid JSON:\n\t`,
          body
        );
        return;
      }
      const windowsInfo = {
        cropperIndex,
        windows,
      };
      nodecg.sendMessage('windowsRefreshed', windowsInfo);
    } else {
      let msg = `Could not get windows for ${cropperConfig!.name}`;
      if (error) {
        msg = `${msg}:\n${error.message}`;
      } else if (response) {
        msg = `${msg}, response code ${response.statusCode}`;
      }
      log.error(msg);
    }
  });
}

function addCropper() {
  obsDataReplicant.value!.croppers.push({
    name: 'new cropper',
    sceneName: '',
    sourceName: '',
    url: '',
  });
}

function removeCropper(cropperIndex: number) {
  obsDataReplicant.value!.croppers.splice(cropperIndex, 1);
}

function modifyCropper(cropperIndex: number, newCropper: Cropper) {
  obsDataReplicant.value!.croppers[cropperIndex] = newCropper;
}

async function getRecordingPath(): Promise<string> {
  let outputPath = '';

  // need to supress errors here since obs-websocket-js doesn't have any of this in their types
  // @ts-ignore
  const { outputs } = await obs.call('GetOutputList');

  for (let i = 0; i < outputs.length; i++) {
    // @ts-ignore
    const settings = await obs.call('GetOutputSettings', {
      outputName: outputs[i]!['outputName'] as string,
    });

    // @ts-ignore
    if (settings.outputSettings && settings.outputSettings.path) {
      // @ts-ignore
      outputPath = settings.outputSettings.path;
    }
  }

  return outputPath;
}

obs.on('CurrentProgramSceneChanged', (data) => {
  if (obsDataReplicant.value) {
    if (obsDataReplicant.value!.scene != data.sceneName) {
      // host names showing
      if (data.sceneName === config.scenes!.hosterka) {
        nodecg.sendMessage('showNames');
        setTimeout(() => {
          nodecg.sendMessage('hideNames');
        }, 10 * 1000);
      }

      if (config.scenes) {
        // timestamp when switching from intermission or countdown to game/hosterka
        if (
          (obsDataReplicant.value!.scene === config.scenes!.intermission ||
            obsDataReplicant.value!.scene === config.scenes!.countdown) &&
          data.sceneName != config.scenes!.intermission &&
          data.sceneName != config.scenes!.video
        ) {
          if (!loggedTimestampForCurrentGame) {
            obs.call('GetRecordStatus').then(async (data) => {
              if (data.outputActive) {
                obsDataReplicant.value!.recordingName = await getRecordingPath();
                nodecg.sendMessage('createVoDTimeStamp', {
                  timestamp: data.outputDuration,
                  run: activeRunReplicant.value!,
                  recordingName: obsDataReplicant.value!.recordingName,
                });
              }
            });
            loggedTimestampForCurrentGame = true;
          }
        }
      }

      obsDataReplicant.value!.scene = data.sceneName;
    }
  }
});

obs.on('SceneTransitionStarted', () => {
  if (obsDataReplicant.value?.studioMode) {
    obs.call('GetCurrentPreviewScene').then((data) => {
      // foobar control
      if (foobarConfig.enabled) {
        const regex = new RegExp('\\[' + foobarConfig.musicKeyword + '(.*?)\\]');
        const match = data.currentPreviewSceneName.match(regex);
        setTimeout(() => {
          if (match && match[1]) {
            const volume = parseInt(match[1], 10);

            if (!Number.isNaN(volume)) {
              foobar.setVolume(volume);
            } else {
              foobar.setVolume(0);
            }
          } else {
            // mute foobar if no music found
            foobar.setVolume(-100);
          }
        }, config.stingerActionDelay);
      }
    });
  }
});

obs.on('RecordStateChanged', (data) => {
  if (data.outputActive) {
    obsDataReplicant.value!.recording = true;
    obsDataReplicant.value!.recordingName = data.outputPath;
  } else {
    obsDataReplicant.value!.recording = false;
  }
});

obs.on('StreamStateChanged', (data) => {
  if (data.outputActive) {
    obsDataReplicant.value!.streaming = true;
  } else {
    obsDataReplicant.value!.streaming = false;
  }
});

obs.on('StudioModeStateChanged', (data) => {
  obsDataReplicant.value!.studioMode = data.studioModeEnabled;
});

obs.on('MediaInputPlaybackEnded', (data) => {
  if (data.inputName === config.sources!.intermissionVideo) {
    if (!playLongVideoReplicant.value) {
      if (videosPlayed < 2) {
        videoType = 'charity';
        playShortVideo(videoType);
      } else {
        switchFromHostScreen();
      }
    } else {
      switchFromHostScreen();
    }
  }
});

obs.on('InputMuteStateChanged', (data) => {
  let channel = config.sources!.hostAudio;
  if (data.inputName == channel) {
    hostMuteStatusReplicant.value = data.inputMuted;
  }
})

obs.on('ConnectionOpened', () => {
  log.info('Połączono z OBSem!');
  obsDataReplicant.value!.connected = true;
});

obs.on('ConnectionClosed', () => {
  log.info('Rozłączono z OBSem! Próbuję połączyć się ponownie za 5 sekund...');
  setTimeout(reconnectToOBS, 5000);
  obsDataReplicant.value!.connected = false;
});

activeRunReplicant.on('change', () => {
  if (loggedTimestampForCurrentGame) {
    loggedTimestampForCurrentGame = false;
  }
});

nodecg.listenFor('switchToIntermission', switchToIntermission);
nodecg.listenFor('switchFromHostScreen', switchFromHostScreen);
nodecg.listenFor('videoPlayerFinished', switchFromHostScreen);
nodecg.listenFor('playIntermissionVideo', (playLongVideo) => {
  playIntermissionVideo(playLongVideo);
});
nodecg.listenFor('refreshWindows', refreshWindows);
nodecg.listenFor('crop', crop);
nodecg.listenFor('crop4By3', crop4By3);
nodecg.listenFor('resetCrop', resetCrop);
nodecg.listenFor('addCropper', addCropper);
nodecg.listenFor('modifyCropper', ({ cropperIndex, newCropper }) =>
  modifyCropper(cropperIndex, newCropper)
);
nodecg.listenFor('removeCropper', removeCropper);
nodecg.listenFor('toggleHostMute', toggleHostMute);
