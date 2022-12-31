import type { TransformProperties } from '@gsps-layouts/types';
import OBSWebSocket from 'obs-websocket-js';
import FoobarControl from './foobar';
import request from 'request';
import { Configschema, WindowInfo } from '@gsps-layouts/types/schemas';
import { Cropper } from '@gsps-layouts/types';
import { get as nodecg } from './util/nodecg';
import {
  obsDataReplicant,
  commentatorsReplicant,
  activeRunReplicant,
} from './util/replicants';
import { TaggedLogger } from './util/tagged-logger';

const obs = new OBSWebSocket();
const config = (nodecg().bundleConfig as Configschema).obs;
const foobarConfig = (nodecg().bundleConfig as Configschema).foobar;
let foobar: FoobarControl;
if (foobarConfig.enabled) {
  foobar = new FoobarControl(foobarConfig.address!);
}
const log = new TaggedLogger('OBS');
let reconnectTimeout: NodeJS.Timeout;
let loggedTimestampForCurrentGame = false;

// Connect to OBS
if (config.enabled) {
  for (let cropper of config.croppers!) {
    obsDataReplicant.value.croppers.push(cropper);
  }

  log.info('Próbuję się połączyć z OBSem...');
  obs.connect(config.address, config.password).catch((err) => {
    log.error(`Nie udało się połączyć z OBSem! Powód: ${err}`);
    reconnectTimeout = setTimeout(reconnectToOBS, 5000);
  });
}

function reconnectToOBS() {
  clearTimeout(reconnectTimeout);
  if (!obsDataReplicant.value.connected && config.enabled) {
    log.info('Próbuję się połączyć z OBSem...');
    obs.connect(config.address, config.password).catch((err) => {
      log.error(`Nie udało się połączyć z OBSem! Powód: ${err}`);
      reconnectTimeout = setTimeout(reconnectToOBS, 5000);
    });
  }
}

function switchToIntermission() {
  obs.call('SetCurrentProgramScene', {
    sceneName: config.scenes!.intermission,
  });
  obsDataReplicant.value.scene = config.scenes!.intermission; // sometimes this isn't set automatically, setting it here just in case
  if (foobarConfig.enabled) {
    foobar.unmute();
  }

  commentatorsReplicant.value = { amount: 0, names: '' };
  if (!obsDataReplicant.value.studioMode) {
    obs
      .call('SetStudioModeEnabled', { studioModeEnabled: true })
      .catch((err) => {
        log.error(`Wystąpił błąd przy włączaniu Studio Mode: ${err};
      }`);
      });
  }
  setTimeout(() => {
    nodecg().sendMessageToBundle('changeToNextRun', 'nodecg-speedcontrol');
  }, 1000);
  resetAllCrops();
}

function switchFromHostScreen() {
  obs.call('SetCurrentProgramScene', {
    sceneName: config.scenes!.intermission,
  });
  obsDataReplicant.value.scene = config.scenes!.intermission; // sometimes this isn't set automatically, setting it here just in case
  if (foobarConfig.enabled) {
    foobar.unmute();
  }

}

function playIntermissionVideo() {
  obs.call('SetCurrentProgramScene', { sceneName: config.scenes!.video });
}

function crop(cropInfo: { cropperIndex: number; windowInfo: WindowInfo }) {
  const cropperIndex = cropInfo.cropperIndex;
  const windowInfo = cropInfo.windowInfo;
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];

  obs
    .call('GetSceneItemId', {
      sceneName: cropperConfig.sceneName,
      sourceName: cropperConfig.sourceName,
    })
    .then((data) => {
      const itemId = data.sceneItemId;
      obs
        .call('GetSceneItemTransform', {
          sceneName: cropperConfig.sceneName,
          sceneItemId: itemId,
        })
        .then((data) => {
          const transformData =
            data.sceneItemTransform as unknown as TransformProperties;
          const width = transformData.width;
          const height = transformData.height;

          const top = windowInfo.y;
          const bottom = height - windowInfo.y - windowInfo.h;
          const left = windowInfo.x;
          const right = width - windowInfo.x - windowInfo.w;

          obs
            .call('SetSceneItemTransform', {
              sceneName: cropperConfig.sceneName,
              sceneItemId: itemId,
              sceneItemTransform: {
                cropTop: top,
                cropBottom: bottom,
                cropLeft: left,
                cropRight: right,
              },
            })
            .catch((error) => {
              log.error(
                `Failed to crop ${cropperConfig.sourceName}. Error: ${error}`
              );
            });
        })
        .catch((error) => {
          log.error(
            `Failed to fetch source ${cropperConfig.sourceName} properties. Error: ${error}`
          );
        });
    })
    .catch((error) => {
      log.error(
        `Failed to fetch source ${cropperConfig.sourceName} id. Error: ${error}`
      );
    });
}

function crop4By3(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];
  obs
    .call('GetSceneItemId', {
      sceneName: cropperConfig.sceneName,
      sourceName: cropperConfig.sourceName,
    })
    .then((data) => {
      const itemId = data.sceneItemId;
      obs
        .call('GetSceneItemTransform', {
          sceneName: cropperConfig.sceneName,
          sceneItemId: itemId,
        })
        .then((data) => {
          const transformData =
            data.sceneItemTransform as unknown as TransformProperties;
          const width = transformData.width;

          const top = 0;
          const bottom = 0;
          const margin = width / 8;
          const left = margin;
          const right = margin;

          obs
            .call('SetSceneItemTransform', {
              sceneName: cropperConfig.sceneName,
              sceneItemId: itemId,
              sceneItemTransform: {
                cropTop: top,
                cropBottom: bottom,
                cropLeft: left,
                cropRight: right,
              },
            })
            .catch((error) => {
              log.error(
                `Failed to crop ${cropperConfig.sourceName}. Error: ${error}`
              );
            });
        })
        .catch((error) => {
          log.error(
            `Failed to fetch source ${cropperConfig.sourceName} properties. Error: ${error}`
          );
        });
    })
    .catch((error) => {
      log.error(
        `Failed to fetch source ${cropperConfig.sourceName} id. Error: ${error}`
      );
    });
}

function resetCrop(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];

  obs
    .call('GetSceneItemId', {
      sceneName: cropperConfig.sceneName,
      sourceName: cropperConfig.sourceName,
    })
    .then((data) => {
      const itemId = data.sceneItemId;
      obs
        .call('SetSceneItemTransform', {
          sceneName: cropperConfig.sceneName,
          sceneItemId: itemId,
          sceneItemTransform: {
            cropTop: 0,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
          },
        })
        .catch((error) => {
          log.error(
            `Failed to crop ${cropperConfig.sourceName}. Error: ${error}`
          );
        });
    })
    .catch((error) => {
      log.error(
        `Failed to fetch source ${cropperConfig.sourceName} id. Error: ${error}`
      );
    });
}

function resetAllCrops() {
  for (let i = 0; i < obsDataReplicant.value.croppers.length; i++) {
    resetCrop(i);
  }
}

function refreshWindows(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];

  request(cropperConfig.url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let windows;
      try {
        windows = JSON.parse(body);
      } catch (e) {
        log.error(
          `Could not parse windows for ${cropperConfig.name}, response not a valid JSON:\n\t`,
          body
        );
        return;
      }
      const windowsInfo = {
        cropperIndex,
        windows,
      };
      nodecg().sendMessage('windowsRefreshed', windowsInfo);
    } else {
      let msg = `Could not get windows for ${cropperConfig.name}`;
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
  obsDataReplicant.value.croppers.push({
    name: 'new cropper',
    sceneName: '',
    sourceName: '',
    url: '',
  });
}

function removeCropper(cropperIndex: number) {
  obsDataReplicant.value.croppers.splice(cropperIndex, 1);
}

function modifyCropper(cropperIndex: number, newCropper: Cropper) {
  obsDataReplicant.value.croppers[cropperIndex] = newCropper;
}

obs.on('CurrentProgramSceneChanged', (data) => {
  if (obsDataReplicant.value.scene != data.sceneName) {
    // host names showing
    if (data.sceneName === config.scenes!.hosterka) {
      nodecg().sendMessage('showNames');
      setTimeout(() => {
        nodecg().sendMessage('hideNames');
      }, 10 * 1000);
    }

    // foobar control
    if (foobarConfig.enabled) {
      if (data.sceneName.includes(foobarConfig.unmuteKeyword!)) {
        foobar.unmute();
      } else {
        foobar.mute();
      }
    }

    if (config.scenes) {
      if (
        obsDataReplicant.value.scene === config.scenes!.intermission &&
        data.sceneName != config.scenes!.intermission &&
        data.sceneName != config.scenes!.video
      ) {
        if (!loggedTimestampForCurrentGame) {
          obs.call('GetRecordStatus').then((data) => {
            if (data.outputActive) {
              nodecg().sendMessage('createVoDTimeStamp', {
                timestamp: data.outputDuration,
                run: activeRunReplicant.value,
              });
            }
          });
          loggedTimestampForCurrentGame = true;
        }
      }
    }

    obsDataReplicant.value.scene = data.sceneName;
  }
});

obs.on('RecordStateChanged', (data) => {
  if (data.outputActive) {
    obsDataReplicant.value.recording = true;
  } else {
    obsDataReplicant.value.recording = false;
  }
});

obs.on('StreamStateChanged', (data) => {
  if (data.outputActive) {
    obsDataReplicant.value.streaming = true;
  } else {
    obsDataReplicant.value.streaming = false;
  }
});

obs.on('StudioModeStateChanged', (data) => {
  obsDataReplicant.value.studioMode = data.studioModeEnabled;
});

obs.on('ConnectionOpened', () => {
  log.info('Połączono z OBSem!');
  obsDataReplicant.value.connected = true;
});

obs.on('ConnectionClosed', () => {
  log.info('Rozłączono z OBSem! Próbuję połączyć się ponownie za 5 sekund...');
  setTimeout(reconnectToOBS, 5000);
  obsDataReplicant.value.connected = false;
});

activeRunReplicant.on('change', () => {
  if (loggedTimestampForCurrentGame) {
    loggedTimestampForCurrentGame = false;
  }
});

nodecg().listenFor('switchToIntermission', switchToIntermission);
nodecg().listenFor('switchFromHostScreen', switchFromHostScreen);
nodecg().listenFor('videoPlayerFinished', switchFromHostScreen);
nodecg().listenFor('playIntermissionVideo', playIntermissionVideo);
nodecg().listenFor('refreshWindows', refreshWindows);
nodecg().listenFor('crop', crop);
nodecg().listenFor('crop4By3', crop4By3);
nodecg().listenFor('resetCrop', resetCrop);
nodecg().listenFor('addCropper', addCropper);
nodecg().listenFor('modifyCropper', ({ cropperIndex, newCropper }) =>
  modifyCropper(cropperIndex, newCropper)
);
nodecg().listenFor('removeCropper', removeCropper);
