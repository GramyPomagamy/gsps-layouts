"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const obs_websocket_js_1 = __importDefault(require("obs-websocket-js"));
const foobar_1 = __importDefault(require("./foobar"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const tagged_logger_1 = require("./util/tagged-logger");
const obs = new obs_websocket_js_1.default();
const config = (0, nodecg_1.get)().bundleConfig.obs;
const foobarConfig = (0, nodecg_1.get)().bundleConfig.foobar;
let foobar;
if (foobarConfig.enabled) {
    foobar = new foobar_1.default(foobarConfig.address);
}
const log = new tagged_logger_1.TaggedLogger('OBS');
let reconnectTimeout;
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
    if (!replicants_1.obsDataReplicant.value.connected && config.enabled) {
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
    if (!replicants_1.obsDataReplicant.value.studioMode) {
        obs.send('EnableStudioMode').catch((err) => {
            log.error(`Wystąpił błąd przy włączaniu Studio Mode: ${err.error};
      }`);
        });
    }
    setTimeout(() => {
        (0, nodecg_1.get)().sendMessageToBundle('changeToNextRun', 'nodecg-speedcontrol');
    }, 1000);
}
function switchFromHostScreen() {
    obs.send('SetCurrentScene', { 'scene-name': config.scenes.intermission });
}
function switchToDemoty() {
    let lastScene;
    obs.send('GetCurrentScene').then((data) => {
        lastScene = data.name;
    });
    obs.send('SetCurrentScene', { 'scene-name': config.scenes.demotywatory });
    setTimeout(() => {
        obs.send('SetCurrentScene', { 'scene-name': lastScene });
    }, 5000);
}
function playIntermissionVideo() {
    obs.send('SetCurrentScene', { 'scene-name': config.scenes.video });
}
obs.on('SwitchScenes', (data) => {
    if (replicants_1.obsDataReplicant.value.scene != data['scene-name']) {
        if (data['scene-name'].includes(foobarConfig.unmuteKeyword)) {
            if (foobarConfig.enabled) {
                foobar.unmute();
            }
        }
        else {
            if (foobarConfig.enabled) {
                foobar.mute();
            }
        }
        replicants_1.obsDataReplicant.value.scene = data['scene-name'];
    }
});
obs.on('StreamStarted', () => {
    replicants_1.obsDataReplicant.value.streaming = true;
});
obs.on('StreamStopped', () => {
    replicants_1.obsDataReplicant.value.streaming = false;
});
obs.on('RecordingStarted', () => {
    replicants_1.obsDataReplicant.value.recording = true;
});
obs.on('RecordingStopped', () => {
    replicants_1.obsDataReplicant.value.recording = false;
});
obs.on('StudioModeSwitched', (data) => {
    replicants_1.obsDataReplicant.value.studioMode = data['new-state'];
});
obs.on('ConnectionOpened', () => {
    log.info('Połączono z OBSem!');
    replicants_1.obsDataReplicant.value.connected = true;
});
obs.on('ConnectionClosed', () => {
    log.info('Rozłączono z OBSem! Próbuję połączyć się ponownie za 5 sekund...');
    setTimeout(reconnectToOBS, 5000);
    replicants_1.obsDataReplicant.value.connected = false;
});
(0, nodecg_1.get)().listenFor('switchToIntermission', switchToIntermission);
(0, nodecg_1.get)().listenFor('switchFromHostScreen', switchFromHostScreen);
(0, nodecg_1.get)().listenFor('videoPlayerFinished', switchFromHostScreen);
(0, nodecg_1.get)().listenFor('playIntermissionVideo', playIntermissionVideo);
(0, nodecg_1.get)().listenFor('switchToDemoty', switchToDemoty);
