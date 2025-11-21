"use strict";

import { type CountdownRunning } from "src/types/generated";
import TimeUtils, { type ICountdownTimer, type TimeStruct } from "./lib/time";
// Ours
import { get } from "./util/nodecg";

const nodecg = get();

const time = nodecg.Replicant<TimeStruct>("countdown", {
  defaultValue: TimeUtils.createTimeStruct(600 * 1000),
  persistent: false,
});

const running = nodecg.Replicant<CountdownRunning>("countdownRunning", {
  defaultValue: false,
  persistent: false,
});
let countdownTimer: ICountdownTimer;

/**
 * Starts the countdown at the specified startTime.
 * @param {string} startTime - A formatted time string, such as 1:00 for one hour.
 * @returns {undefined}
 */
function start(startTime = "10:00") {
  if (running.value) {
    return;
  }

  const durationMs = TimeUtils.parseTimeString(startTime);
  if (durationMs <= 0) {
    return;
  }

  running.value = true;
  time.value = TimeUtils.createTimeStruct(durationMs);

  if (countdownTimer) {
    countdownTimer.stop();
    countdownTimer.removeAllListeners();
  }

  countdownTimer = new TimeUtils.CountdownTimer(Date.now() + durationMs);
  countdownTimer.on("tick", (remainingTimeStruct: TimeStruct) => {
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

nodecg.listenFor("startCountdown", (startTime: string) => {
  start(startTime);
});
nodecg.listenFor("stopCountdown", () => {
  stop();
});
