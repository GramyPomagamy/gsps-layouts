import type { NodeCG } from 'nodecg/types/server';
import OBSWebSocket from 'obs-websocket-js';
import FoobarControl from './foobar';
import request from 'request';
import { Configschema, WindowInfo } from '@gsps-layouts/types/schemas';
import { Cropper } from '@gsps-layouts/types';
import { get as nodecg } from './util/nodecg';
import { obsDataReplicant } from './util/replicants';
import { TaggedLogger } from './util/tagged-logger';

const obs = new OBSWebSocket();
const config = (nodecg().bundleConfig as Configschema).obs;
const foobarConfig = (nodecg().bundleConfig as Configschema).foobar;
let foobar: FoobarControl;
if (foobarConfig.enabled) {
  foobar = new FoobarControl(foobarConfig.address);
}
const log = new TaggedLogger('OBS');
let reconnectTimeout: NodeJS.Timeout;

// Connect to OBS
if (config.enabled) {
  for (let cropper of config.croppers) {
    obsDataReplicant.value.croppers.push(cropper);
  }

  log.info('Próbuję się połączyć z OBSem...');
  obs
    .connect({ address: config.address, password: config.password })
    .catch((err) => {
      log.error(`Nie udało się połączyć z OBSem! Powód: ${err.error}`);
    });
}

function reconnectToOBS() {
  clearTimeout(reconnectTimeout);
  if (!obsDataReplicant.value.connected && config.enabled) {
    log.info('Próbuję się połączyć z OBSem...');
    obs
      .connect({
        address: config.address,
        password: config.password,
      })
      .catch((err) => {
        log.error(`Nie udało się połączyć z OBSem! Powód: ${err.error}`);
        reconnectTimeout = setTimeout(reconnectToOBS, 5000);
      });
  }
}

function switchToIntermission() {
  obs.send('SetCurrentScene', { 'scene-name': config.scenes.intermission });
  if (!obsDataReplicant.value.studioMode) {
    obs.send('EnableStudioMode').catch((err) => {
      log.error(`Wystąpił błąd przy włączaniu Studio Mode: ${err.error};
      }`);
    });
  }
  setTimeout(() => {
    nodecg().sendMessageToBundle('changeToNextRun', 'nodecg-speedcontrol');
  }, 1000);
  resetAllCrops();
}

function switchFromHostScreen() {
  obs.send('SetCurrentScene', { 'scene-name': config.scenes.intermission });
}

function playIntermissionVideo() {
  obs.send('SetCurrentScene', { 'scene-name': config.scenes.video });
}

function crop(cropInfo: { cropperIndex: number; windowInfo: WindowInfo }) {
  const cropperIndex = cropInfo.cropperIndex;
  const windowInfo = cropInfo.windowInfo;
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];

  obs
    .send('GetSceneItemProperties', {
      'scene-name': cropperConfig.sceneName,
      item: { name: cropperConfig.sourceName },
    })
    .then((data) => {
      const width = data.width;
      const height = data.height;

      const top = windowInfo.y;
      const bottom = height - windowInfo.y - windowInfo.h;
      const left = windowInfo.x;
      const right = width - windowInfo.x - windowInfo.w;

      obs.send('SetSceneItemProperties', {
        'scene-name': cropperConfig.sceneName,
        item: { name: cropperConfig.sourceName },
        position: {},
        scale: {},
        crop: { top: top, bottom: bottom, left: left, right: right },
        bounds: {},
      });
    })
    .catch((error) => {
      log.error(
        `Failed to fetch source ${cropperConfig.sourceName} properties. Error: ${error}`
      );
    });
}

function crop4By3(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];

  obs
    .send('GetSceneItemProperties', {
      'scene-name': cropperConfig.sceneName,
      item: { name: cropperConfig.sourceName },
    })
    .then((data) => {
      const width = data.width;

      const top = 0;
      const bottom = 0;
      const margin = width / 8;
      const left = margin;
      const right = margin;

      obs.send('SetSceneItemProperties', {
        'scene-name': cropperConfig.sceneName,
        item: { name: cropperConfig.sourceName },
        position: {},
        scale: {},
        crop: { top: top, bottom: bottom, left: left, right: right },
        bounds: {},
      });
    })
    .catch((error) => {
      log.error(
        `Failed to fetch source ${cropperConfig.sourceName} properties. Error: ${error}`
      );
    });
}

function resetCrop(cropperIndex: number) {
  const cropperConfig = obsDataReplicant.value.croppers[cropperIndex];

  obs.send('SetSceneItemProperties', {
    'scene-name': cropperConfig.sceneName,
    item: { name: cropperConfig.sourceName },
    position: {},
    scale: {},
    crop: { top: 0, bottom: 0, left: 0, right: 0 },
    bounds: {},
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

obs.on('SwitchScenes', (data) => {
  if (obsDataReplicant.value.scene != data['scene-name']) {
    if (data['scene-name'].includes(foobarConfig.unmuteKeyword)) {
      if (foobarConfig.enabled) {
        foobar.unmute();
      }
    } else {
      if (foobarConfig.enabled) {
        foobar.mute();
      }
    }
    obsDataReplicant.value.scene = data['scene-name'];
  }
});

obs.on('StreamStarted', () => {
  obsDataReplicant.value.streaming = true;
});

obs.on('StreamStopped', () => {
  obsDataReplicant.value.streaming = false;
});

obs.on('RecordingStarted', () => {
  obsDataReplicant.value.recording = true;
});

obs.on('RecordingStopped', () => {
  obsDataReplicant.value.recording = false;
});

obs.on('StudioModeSwitched', (data) => {
  obsDataReplicant.value.studioMode = data['new-state'];
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
