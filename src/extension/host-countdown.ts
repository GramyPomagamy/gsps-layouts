"use strict";

import { type CountdownRunning } from "src/types/generated";
import TimeUtils, { type ICountdownTimer, type TimeStruct } from "./lib/time";
// Ours
import { get } from "./util/nodecg";

const nodecg = get();

const hostCountdown = nodecg.Replicant<TimeStruct>("hostCountdown", {
  defaultValue: TimeUtils.createTimeStruct(3 * 60 * 1000),
  persistent: false,
});
const hostCountdownRunning = nodecg.Replicant<CountdownRunning>(
  "hostCountdownRunning",
  {
    defaultValue: false,
    persistent: false,
  },
);
let hostCountdownTimer: ICountdownTimer;

nodecg.listenFor("startHostCountdown", (startTime) => {
  startHostCountdown(startTime);
});
nodecg.listenFor("stopHostCountdown", () => {
  stopHostCountdown();
});

/**
 * Starts the countdown at the specified startTime.
 * @param {string} startTime - A formatted time string, such as 1:00 for one hour.
 * @returns {undefined}
 */
function startHostCountdown(startTime = "3:00") {
  if (hostCountdownRunning.value) {
    return;
  }

  const durationMs = TimeUtils.parseTimeString(startTime);
  if (durationMs <= 0) {
    return;
  }

  hostCountdownRunning.value = true;
  hostCountdown.value = TimeUtils.createTimeStruct(durationMs);

  if (hostCountdownTimer) {
    hostCountdownTimer.stop();
    hostCountdownTimer.removeAllListeners();
  }

  hostCountdownTimer = new TimeUtils.InfiniteCountdownTimer(
    Date.now() + durationMs,
  );
  hostCountdownTimer.on("tick", (remainingTimeStruct: TimeStruct) => {
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
