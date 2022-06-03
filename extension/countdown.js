'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Ours
const nodecg_1 = require("./util/nodecg");
const time_1 = __importDefault(require("./lib/time"));
const time = (0, nodecg_1.get)().Replicant('countdown', {
    defaultValue: time_1.default.createTimeStruct(600 * 1000),
    persistent: false,
});
const running = (0, nodecg_1.get)().Replicant('countdownRunning', {
    defaultValue: false,
    persistent: false,
});
let countdownTimer;
(0, nodecg_1.get)().listenFor('startCountdown', (startTime) => {
    start(startTime);
});
(0, nodecg_1.get)().listenFor('stopCountdown', () => {
    stop();
});
/**
 * Starts the countdown at the specified startTime.
 * @param {string} startTime - A formatted time string, such as 1:00 for one hour.
 * @returns {undefined}
 */
function start(startTime = '10:00') {
    if (running.value) {
        return;
    }
    const durationMs = time_1.default.parseTimeString(startTime);
    if (durationMs <= 0) {
        return;
    }
    running.value = true;
    time.value = time_1.default.createTimeStruct(durationMs);
    if (countdownTimer) {
        countdownTimer.stop();
        countdownTimer.removeAllListeners();
    }
    countdownTimer = new time_1.default.CountdownTimer(Date.now() + durationMs);
    countdownTimer.on('tick', (remainingTimeStruct) => {
        time.value = remainingTimeStruct;
    });
}
/**
 * Stops the countdown.
 * @returns {undefined}
 */
function stop() {
    if (!running.value) {
        return;
    }
    running.value = false;
    if (countdownTimer) {
        countdownTimer.stop();
    }
}
