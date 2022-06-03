'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Ours
const nodecg_1 = require("./util/nodecg");
const time_1 = __importDefault(require("./lib/time"));
const hostCountdown = (0, nodecg_1.get)().Replicant('hostCountdown', {
    defaultValue: time_1.default.createTimeStruct(3 * 60 * 1000),
    persistent: false,
});
const hostCountdownRunning = (0, nodecg_1.get)().Replicant('hostCountdownRunning', {
    defaultValue: false,
    persistent: false,
});
let hostCountdownTimer;
(0, nodecg_1.get)().listenFor('startHostCountdown', (startTime) => {
    startHostCountdown(startTime);
});
(0, nodecg_1.get)().listenFor('stopHostCountdown', () => {
    stopHostCountdown();
});
/**
 * Starts the countdown at the specified startTime.
 * @param {string} startTime - A formatted time string, such as 1:00 for one hour.
 * @returns {undefined}
 */
function startHostCountdown(startTime = '3:00') {
    if (hostCountdownRunning.value) {
        return;
    }
    const durationMs = time_1.default.parseTimeString(startTime);
    if (durationMs <= 0) {
        return;
    }
    hostCountdownRunning.value = true;
    hostCountdown.value = time_1.default.createTimeStruct(durationMs);
    if (hostCountdownTimer) {
        hostCountdownTimer.stop();
        hostCountdownTimer.removeAllListeners();
    }
    hostCountdownTimer = new time_1.default.InfiniteCountdownTimer(Date.now() + durationMs);
    hostCountdownTimer.on('tick', (remainingTimeStruct) => {
        hostCountdown.value = remainingTimeStruct;
    });
}
/**
 * Stops the countdown.
 * @returns {undefined}
 */
function stopHostCountdown() {
    if (!hostCountdown.value) {
        return;
    }
    hostCountdownRunning.value = false;
    if (hostCountdownTimer) {
        hostCountdownTimer.stop();
    }
}
