import type { NodeCG } from 'nodecg/types/server';
import OBSWebSocket from 'obs-websocket-js';
import FoobarControl from './foobar';
import { Configschema } from '@gsps-layouts/types/schemas';
import { get as nodecg } from './util/nodecg';
import { obsDataReplicant } from './util/replicants';

const obs = new OBSWebSocket();
const config = (nodecg().bundleConfig as Configschema).obs;
const foobarConfig = (nodecg().bundleConfig as Configschema).foobar;
const foobar = new FoobarControl(foobarConfig.address);
const log = new (nodecg() as NodeCG).Logger(`${nodecg().bundleName}:OBS`);
let reconnectTimeout: NodeJS.Timeout;

// Connect to OBS
if (config.enabled) {
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
  obs.send('EnableStudioMode');
  setTimeout(() => {
    nodecg().sendMessageToBundle('changeToNextRun', 'nodecg-speedcontrol');
  }, 1000);
}

function switchFromHostScreen() {
  obs.send('SetCurrentScene', { 'scene-name': config.scenes.intermission });
}

obs.on('SwitchScenes', (data) => {
  if (obsDataReplicant.value.scene != data['scene-name']) {
    if (data['scene-name'].includes('[M]')) {
      foobar.unmute();
    } else {
      foobar.mute();
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
