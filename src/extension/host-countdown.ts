'use strict';

// Ours
import { NodeCG } from './util/nodecg';
import TimeUtils, { TimeStruct, ICountdownTimer } from './lib/time';

/** Code relating to the host dashboard countdown. */
export const hostCountdown = (nodecg: NodeCG) => {
  const hostCountdown = nodecg.Replicant('hostCountdown', {
    defaultValue: TimeUtils.createTimeStruct(3 * 60 * 1000),
    persistent: false,
  });
  const hostCountdownRunning = nodecg.Replicant('hostCountdownRunning', {
    defaultValue: false,
    persistent: false,
  });
  let hostCountdownTimer: ICountdownTimer;

  nodecg.listenFor('startHostCountdown', (startTime) => {
    startHostCountdown(startTime);
  });
  nodecg.listenFor('stopHostCountdown', () => {
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

    hostCountdownTimer = new TimeUtils.InfiniteCountdownTimer(Date.now() + durationMs);
    hostCountdownTimer.on('tick', (remainingTimeStruct: TimeStruct) => {
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
};
