import {
  type Asset,
  type Commentators,
  type Configschema,
  type Cropper,
  type Hosterka,
  type ModuleParams,
  type ObsData,
  type WindowInfo,
} from "@gsps-layouts/types";
import axios from "axios";
import { type RunDataActiveRun } from "speedcontrol/types";
import { FoobarControl } from "../util/foobar";
import { ObsControl } from "../util/obs-control";
import { Videos } from "../util/videos";

type VideoTypes = "charity" | "sponsors";

const hostNamesDisplayDuration = 10 * 1000;
const reconnectDelay = 5000;
const maxShortVideos = 2;

export async function setup({
  nodecg,
  config,
  logger,
}: ModuleParams<{
  foobarConfig: Configschema["foobar"];
  nodecgPort: number;
  obsConfig: Configschema["obs"];
}>) {
  const { obsConfig, foobarConfig, nodecgPort } = config;

  if (!obsConfig.sources) {
    throw new Error(
      "OBS Control module is enabled, but no source names are provided!",
    );
  }

  if (!obsConfig.scenes) {
    throw new Error(
      "OBS Control module is enabled, but no scene names are provided!",
    );
  }

  if (!obsConfig.address || !obsConfig.password) {
    throw new Error(
      "OBS Control module is enabled, but address or password are not provided",
    );
  }

  const obsDataReplicant = nodecg.Replicant<ObsData>("obsData", {
    persistent: false,
  });
  const commentatorsReplicant = nodecg.Replicant<Commentators>("commentators");
  const activeRunReplicant = nodecg.Replicant<RunDataActiveRun>(
    "runDataActiveRun",
    "nodecg-speedcontrol",
  );
  const playLongVideoReplicant = nodecg.Replicant<boolean>("playLongVideo");
  const videosCharity = nodecg.Replicant<Asset[]>("assets:videos-charity");
  const videosSponsors = nodecg.Replicant<Asset[]>("assets:videos-sponsors");
  const videosLong = nodecg.Replicant<Asset[]>("assets:videos-long");
  const hosterkaReplicant = nodecg.Replicant<Hosterka>("hosterka");
  const hostMuteStatusReplicant = nodecg.Replicant<boolean>("hostMuteStatus");
  const showBidsPanel = nodecg.Replicant<boolean>("showBidsPanel");
  const showPrizePanel = nodecg.Replicant<boolean>("showPrizePanel");

  let shuffledVideosCharity = new Videos(videosCharity.value, 0, undefined);
  let shuffledVideosLong = new Videos(videosLong.value, 0, undefined);
  let shuffledVideosSponsors = new Videos(videosSponsors.value, 0, undefined);
  let reconnectTimeout: NodeJS.Timeout;
  let loggedTimestampForCurrentGame = false;
  let videoType: VideoTypes = "sponsors";
  let videosPlayed = 0;

  obsDataReplicant.value!.croppers = [...(obsConfig.croppers ?? [])];

  const obs = new ObsControl(obsConfig.sources);

  const foobar: FoobarControl | undefined =
    foobarConfig.enabled && foobarConfig.address
      ? new FoobarControl(foobarConfig.address, logger)
      : undefined;

  const reconnectToOBS = () => {
    clearTimeout(reconnectTimeout);
    if (!obsDataReplicant.value!.connected) {
      logger.info("Próbuję się połączyć z OBSem...");
      obs.connect(obsConfig.address, obsConfig.password).catch((err) => {
        logger.error(`Nie udało się połączyć z OBSem! Powód: ${err}`);
        reconnectTimeout = setTimeout(reconnectToOBS, reconnectDelay);
      });
    }
  };

  const handleChangedVideos = (
    newValue: Asset[] | undefined,
    oldValue: Asset[] | undefined,
    shuffledVideos: Videos,
  ) => {
    if (newValue && oldValue) {
      if (newValue.length > oldValue.length) {
        //adding new video
        for (let i = oldValue.length; i < newValue.length; ++i) {
          shuffledVideos.addNewVideo(newValue[i]);
        }
      } else if (newValue.length < oldValue.length) {
        //removing video
        const previousVideo = shuffledVideos.getLastPlayedVideo();
        shuffledVideos = new Videos(newValue, 0, previousVideo);
      }
    }
    return shuffledVideos;
  };

  const addCropper = () => {
    obsDataReplicant.value!.croppers.push({
      name: "new cropper",
      sceneName: "",
      sourceName: "",
      url: "",
    });
  };

  const removeCropper = (cropperIndex: number) => {
    obsDataReplicant.value!.croppers.splice(cropperIndex, 1);
  };

  const modifyCropper = (cropperIndex: number, newCropper: Cropper) => {
    obsDataReplicant.value!.croppers[cropperIndex] = newCropper;
  };

  const resetCrop = (cropperIndex: number) => {
    const cropperConfig = obsDataReplicant.value!.croppers[cropperIndex];
    if (cropperConfig) {
      obs
        .resetCrop({ cropperInfo: cropperConfig })
        .catch((err) => logger.error(err));
    }
  };

  const resetAllCrops = () => {
    for (const cropper of obsDataReplicant.value!.croppers) {
      obs.resetCrop({ cropperInfo: cropper }).catch((err) => logger.error(err));
    }
  };

  const refreshWindows = async (cropperIndex: number) => {
    const cropperConfig = obsDataReplicant.value!.croppers[cropperIndex];

    if (!cropperConfig?.url) {
      logger.error(`Cropper ${cropperIndex} has no URL configured`);
      return;
    }

    try {
      const response = await axios.get<WindowInfo[]>(cropperConfig.url);
      if (response.status === 200 && Array.isArray(response.data)) {
        const windowsInfo = {
          cropperIndex,
          windows: response.data,
        };
        nodecg.sendMessage("windowsRefreshed", windowsInfo);
      } else {
        logger.error(
          `Could not get windows for ${cropperConfig.name}, response code ${response.status}`,
        );
      }
    } catch (error: unknown) {
      let msg = `Could not get windows for ${cropperConfig.name}`;
      if (error instanceof Error && error.message) {
        msg = `${msg}:\n${error.message}`;
      }
      logger.error(msg);
    }
  };

  const switchToIntermission = async () => {
    if (obsDataReplicant.value?.scene === obsConfig.scenes!.intermission)
      return; // if we're already on intermission, don't do anything

    nodecg.sendMessageToBundle("changeToNextRun", "nodecg-speedcontrol");
    if (!obsDataReplicant.value!.studioMode) {
      obs
        .call("SetStudioModeEnabled", { studioModeEnabled: true })
        .catch((err) => {
          logger.error(`Wystąpił błąd przy włączaniu Studio Mode: ${err};
          }`);
        });
    }
    try {
      if (obsDataReplicant.value?.studioMode) {
        await obs.setCurrentPreviewScene(obsConfig.scenes!.intermission);
      }

      await obs.setCurrentProgramScene(obsConfig.scenes!.intermission);
    } catch (error) {
      logger.error("Nie udało się zmienić sceny na przerwę: ", error);
    }

    obsDataReplicant.value!.scene = obsConfig.scenes!.intermission; // sometimes this isn't set automatically, setting it here just in case
    setTimeout(() => {
      nodecg.sendMessage("hideNames");
      hosterkaReplicant.value = {
        hostL: { name: "", pronouns: "" },
        hostR: { name: "", pronouns: "" },
      };
      showBidsPanel.value = false;
      showPrizePanel.value = false;
      resetAllCrops();
      commentatorsReplicant.value = [];
      nodecg.sendMessage("intermissionStarted");
    }, obsConfig.stingerActionDelay);
  };

  const switchFromHostScreen = async () => {
    await obs.setCurrentPreviewScene(obsConfig.scenes!.intermission);
    await obs.setCurrentProgramScene(obsConfig.scenes!.intermission);

    obsDataReplicant.value!.scene = obsConfig.scenes!.intermission; // sometimes this isn't set automatically, setting it here just in case
    hosterkaReplicant.value = {
      hostL: { name: "", pronouns: "" },
      hostR: { name: "", pronouns: "" },
    };
    showBidsPanel.value = false;
    showPrizePanel.value = false;

    // clear intermission video source
    if (obsConfig.sources && obsConfig.sources.intermissionVideo) {
      await obs.setIntermissionVideo("");
    }

    videosPlayed = 0;
  };

  const playLongVideo = () => {
    logger.debug("Puszczam długi film");
    const currentVideo = shuffledVideosLong.getNextVideo();
    if (currentVideo) {
      setTimeout(() => {
        obs
          .setIntermissionVideo(
            `http://localhost:${nodecgPort}${currentVideo.url}`,
          )
          .catch((err) => logger.error(err));
      }, obsConfig.stingerActionDelay);
    } else {
      logger.error("Nie udało puścić się długiego filmu");
    }
  };

  const playShortVideo = (type: VideoTypes) => {
    logger.debug("Puszczam krótki film");
    const currentVideo =
      type === "charity"
        ? shuffledVideosCharity.getNextVideo()
        : shuffledVideosSponsors.getNextVideo();
    if (currentVideo) {
      videosPlayed++;
      setTimeout(() => {
        obs
          .setIntermissionVideo(
            `http://localhost:${nodecgPort}${currentVideo.url}`,
          )
          .catch((err) => logger.error(err));
      }, obsConfig.stingerActionDelay);
    } else {
      logger.error("Nie udało puścić się krótkiego filmu");
    }
  };

  const playIntermissionVideo = async (longVideo: boolean) => {
    videosPlayed = 0;
    playLongVideoReplicant.value = longVideo;
    await obs.setCurrentProgramScene(obsConfig.scenes!.video);
    if (longVideo) {
      playLongVideo();
    } else {
      videoType = "sponsors";
      playShortVideo(videoType);
    }
  };

  obs
    .connect(obsConfig.address, obsConfig.password)
    .then(async () => {
      if (obsConfig.sources && obsConfig.sources.intermissionVideo) {
        try {
          await obs.setIntermissionVideo("");
        } catch (err) {
          logger.error("Nie udało się wyzerować filmu na przerwie: ", err);
        }
      }
      const hostMuteStatus = await obs.getHostAudioMuteStatus();
      hostMuteStatusReplicant.value = hostMuteStatus;
    })
    .catch((err) => {
      logger.error(`Nie udało się połączyć z OBSem! Powód: ${err}`);
      reconnectTimeout = setTimeout(reconnectToOBS, reconnectDelay);
    });

  // OBS event listeners
  obs.on("CurrentProgramSceneChanged", (data) => {
    void (async () => {
      try {
        if (obsDataReplicant.value) {
          if (obsDataReplicant.value!.scene !== data.sceneName) {
            // host names showing
            if (data.sceneName === obsConfig.scenes!.hosterka) {
              nodecg.sendMessage("showNames");
              setTimeout(() => {
                nodecg.sendMessage("hideNames");
              }, hostNamesDisplayDuration);
            }

            if (obsConfig.scenes) {
              // timestamp when switching from intermission or countdown to game/hosterka
              if (
                (obsDataReplicant.value!.scene ===
                  obsConfig.scenes!.intermission ||
                  obsDataReplicant.value!.scene ===
                    obsConfig.scenes!.countdown) &&
                data.sceneName !== obsConfig.scenes!.intermission &&
                data.sceneName !== obsConfig.scenes!.video
              ) {
                if (!loggedTimestampForCurrentGame) {
                  const { isRecording, recordingDuration } =
                    await obs.getRecordingStatus();

                  if (isRecording) {
                    const recordingName = await obs.getRecordingPath();
                    obsDataReplicant.value.recordingName = recordingName;
                    nodecg.sendMessage("createVoDTimeStamp", {
                      timestamp: recordingDuration,
                      run: activeRunReplicant.value!,
                      recordingName: obsDataReplicant.value!.recordingName,
                    });
                    loggedTimestampForCurrentGame = true;
                  }
                }
              }
            }

            obsDataReplicant.value!.scene = data.sceneName;
          }
        }
      } catch (err) {
        logger.error(err);
      }
    })();
  });

  obs.on("SceneTransitionStarted", () => {
    void (async () => {
      try {
        if (obsDataReplicant.value?.studioMode) {
          const currentPreviewScene = await obs.getCurrentPreviewScene();

          if (foobarConfig.enabled && foobar) {
            const regex = new RegExp(
              "\\[" + foobarConfig.musicKeyword + "(.*?)\\]",
            );
            const match = currentPreviewScene.match(regex);
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
            }, obsConfig.stingerActionDelay);
          }
        }
      } catch (err) {
        logger.error(err);
      }
    })();
  });

  obs.on("RecordStateChanged", ({ outputActive, outputPath }) => {
    obsDataReplicant.value!.recording = outputActive;
    obsDataReplicant.value!.recordingName = outputPath;
  });

  obs.on("StreamStateChanged", ({ outputActive }) => {
    obsDataReplicant.value!.streaming = outputActive;
  });

  obs.on("StudioModeStateChanged", ({ studioModeEnabled }) => {
    obsDataReplicant.value!.studioMode = studioModeEnabled;
  });

  obs.on("MediaInputPlaybackEnded", ({ inputName }) => {
    if (inputName === obs.sources.intermissionVideo) {
      if (!playLongVideoReplicant.value) {
        if (videosPlayed < maxShortVideos) {
          videoType = "charity";
          playShortVideo(videoType);
        } else {
          void switchFromHostScreen();
        }
      } else {
        void switchFromHostScreen();
      }
    }
  });

  obs.on("InputMuteStateChanged", ({ inputName, inputMuted }) => {
    if (inputName === obs.sources.hostAudio) {
      hostMuteStatusReplicant.value = inputMuted;
    }
  });

  obs.on("ConnectionOpened", () => {
    logger.info("Połączono z OBSem!");
    obsDataReplicant.value!.connected = true;
  });

  obs.on("ConnectionClosed", () => {
    logger.info(
      `Rozłączono z OBSem! Próbuję połączyć się ponownie za ${reconnectDelay / 1000} sekund...`,
    );
    setTimeout(reconnectToOBS, reconnectDelay);
    obsDataReplicant.value!.connected = false;
  });

  // NodeCG event listeners

  videosCharity.on("change", (newValue, oldValue) => {
    shuffledVideosCharity = handleChangedVideos(
      newValue,
      oldValue,
      shuffledVideosCharity,
    );
  });

  videosSponsors.on("change", (newValue, oldValue) => {
    shuffledVideosSponsors = handleChangedVideos(
      newValue,
      oldValue,
      shuffledVideosSponsors,
    );
  });

  videosLong.on("change", (newValue, oldValue) => {
    shuffledVideosLong = handleChangedVideos(
      newValue,
      oldValue,
      shuffledVideosLong,
    );
  });

  activeRunReplicant.on("change", () => {
    if (loggedTimestampForCurrentGame) {
      loggedTimestampForCurrentGame = false;
    }
  });

  nodecg.listenFor("switchToIntermission", () => {
    switchToIntermission().catch((err) => {
      logger.error(err);
    });
  });
  nodecg.listenFor("switchFromHostScreen", () => {
    switchFromHostScreen().catch((err) => {
      logger.error(err);
    });
  });
  nodecg.listenFor("videoPlayerFinished", () => {
    switchFromHostScreen().catch((err) => {
      logger.error(err);
    });
  });

  nodecg.listenFor("playIntermissionVideo", (playLongVideo: boolean) => {
    playIntermissionVideo(playLongVideo).catch((err) => {
      logger.error(err);
    });
  });

  nodecg.listenFor("refreshWindows", (cropperIndex: number) => {
    refreshWindows(cropperIndex).catch((err) => {
      logger.error(err);
    });
  });

  nodecg.listenFor(
    "crop",
    ({
      cropperIndex,
      windowInfo,
    }: {
      cropperIndex: number;
      windowInfo: WindowInfo;
    }) => {
      const cropperInfo = obsDataReplicant.value!.croppers[cropperIndex];
      if (cropperInfo) {
        obs
          .cropSource({ cropperInfo, windowInfo })
          .catch((err) => logger.error(err));
      }
    },
  );
  nodecg.listenFor("crop4By3", (cropperIndex) => {
    const cropperInfo = obsDataReplicant.value!.croppers[cropperIndex];
    if (cropperInfo) {
      obs.crop4By3({ cropperInfo }).catch((err) => logger.error(err));
    }
  });
  nodecg.listenFor("resetCrop", resetCrop);
  nodecg.listenFor("addCropper", addCropper);
  nodecg.listenFor("modifyCropper", ({ cropperIndex, newCropper }) =>
    modifyCropper(cropperIndex, newCropper),
  );
  nodecg.listenFor("removeCropper", removeCropper);
  nodecg.listenFor("toggleHostMute", () => {
    if (hostMuteStatusReplicant.value !== undefined) {
      obs
        .setHostAudioMuteStatus(!hostMuteStatusReplicant.value)
        .catch((err) => {
          logger.error(err);
        });
    }
  });
}
