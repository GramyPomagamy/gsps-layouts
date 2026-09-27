/* eslint import/prefer-default-export: off */

import livesplitCore from 'livesplit-core';
import { msToTimeStr } from './util/helpers';
import { get } from './util/nodecg';
import { timerRep } from './util/gtaReplicants';

let timer: livesplitCore.Timer;
let nodecg = get();

// Cross references for LiveSplit's TimerPhases.
const LS_TIMER_PHASE = {
  NotRunning: 0,
  Running: 1,
  Ended: 2,
  Paused: 3,
};

/**
 * Resets timer replicant to default settings.
 */
function resetTimerRepToDefault(): void {
  timerRep.value = {
    time: '00:00',
    milliseconds: 0,
    timestamp: 0,
    phase: 'stopped',
  };
  nodecg.log.debug('[Timer] Replicant restored to default');
}

/**
 * Set timer replicant string time and milliseconds based off a millisecond value.
 * @param ms Milliseconds you want to set the timer replicant at.
 */
function setTime(ms: number): void {
  timerRep.value!.time = msToTimeStr(ms);
  timerRep.value!.milliseconds = ms;
  // nodecg.log.debug(`[Timer] Set to ${msToTimeStr(ms)}/${ms}`);
}

/**
 * Set game time.
 * Game Time is used so we can edit the timer easily.
 * @param ms Milliseconds you want to set the game time at.
 */
function setGameTime(ms: number): void {
  if (timerRep.value!.phase === 'stopped') {
    livesplitCore.TimeSpan.fromSeconds(0).with((t) => timer.setLoadingTimes(t));
    timer.initializeGameTime();
  }
  livesplitCore.TimeSpan.fromSeconds(ms / 1000).with((t) => timer.setGameTime(t));
  nodecg.log.debug(`[Timer] Game time set to ${ms}`);
}

/**
 * Start/resume the timer, depending on the current state.
 * @param force Force the timer to start, even if it's state is running/changes are disabled.
 */
async function startTimer(force?: boolean): Promise<void> {
  try {
    // Error if the timer is disabled.
    if (!force) {
      throw new Error('Timer changes are disabled');
    }
    // Error if the timer is finished.
    if (timerRep.value!.phase === 'finished') {
      throw new Error('Timer is in the finished state');
    }
    // Error if the timer isn't stopped or paused (and we're not forcing it).
    if (!force && !['stopped', 'paused'].includes(timerRep.value!.phase)) {
      throw new Error('Timer is not stopped/paused');
    }

    if (timer.currentPhase() === LS_TIMER_PHASE.NotRunning) {
      timer.start();
      nodecg.log.debug('[Timer] Started');
    } else {
      timer.resume();
      nodecg.log.debug('[Timer] Resumed');
    }
    setGameTime(timerRep.value!.milliseconds);
    timerRep.value!.phase = 'running';
  } catch (err) {
    nodecg.log.debug('[Timer] Cannot start/resume timer:', err);
    throw err;
  }
}

/**
 * Pause the timer.
 */
async function pauseTimer(): Promise<void> {
  try {
    // Error if the timer isn't running.
    if (timerRep.value!.phase !== 'running') {
      throw new Error('Timer is not running');
    }

    timer.pause();
    timerRep.value!.phase = 'paused';
    nodecg.log.debug('[Timer] Paused');
  } catch (err) {
    nodecg.log.debug('[Timer] Cannot pause timer:', err);
    throw err;
  }
}

/**
 * Reset the timer.
 * @param force Forces a reset even if changes are disabled.
 */
export async function resetTimer(force?: boolean): Promise<void> {
  try {
    // Error if the timer is disabled.
    if (!force) {
      throw new Error('Timer changes are disabled');
    }
    // Error if the timer is stopped.
    if (timerRep.value!.phase === 'stopped') {
      throw new Error('Timer is stopped');
    }

    timer.reset(false);
    resetTimerRepToDefault();
    nodecg.log.debug('[Timer] Reset');
  } catch (err) {
    nodecg.log.debug('[Timer] Cannot reset timer:', err);
    throw err;
  }
}

/**
 * Stop/finish the timer.
 */
async function stopTimer(): Promise<void> {
  try {
    // Error if timer is not running.
    if (!['running', 'paused'].includes(timerRep.value!.phase)) {
      throw new Error('Timer is not running/paused');
    }

    // Stop the timer if all the teams have finished (or no teams exist).
    if (timerRep.value!.phase === 'paused') {
      timer.resume();
    }
    timer.split();
    timerRep.value!.phase = 'finished';
    nodecg.log.debug('[Timer] Finished');
  } catch (err) {
    nodecg.log.debug('[Timer] Cannot stop timer:', err);
    throw err;
  }
}

/**
 * This stuff runs every 1/10th a second to keep the time updated.
 */
function tick(): void {
  if (timerRep.value!.phase === 'running') {
    // Calculates the milliseconds the timer has been running for and updates the replicant.
    const time = timer.currentTime().gameTime() as livesplitCore.TimeSpanRef;
    const ms = Math.floor(time.totalSeconds() * 1000);
    setTime(ms);
    timerRep.value!.timestamp = Date.now();
  }
}

// Sets up the timer with a single split.
const liveSplitRun = livesplitCore.Run.new();
liveSplitRun.pushSegment(livesplitCore.Segment.new('finish'));
timer = livesplitCore.Timer.new(liveSplitRun) as livesplitCore.Timer;

// If the timer was running when last closed, tries to resume it at the correct time.
if (timerRep.value!.phase === 'running') {
  const missedTime = Date.now() - timerRep.value!.timestamp;
  const previousTime = timerRep.value!.milliseconds;
  const timeOffset = previousTime + missedTime;
  setTime(timeOffset);
  nodecg.log.info(`[Timer] Recovered ${(missedTime / 1000).toFixed(2)} seconds of lost time`);
  startTimer(true).catch(() => {
    /* catch error if needed, for safety */
  });
}

// NodeCG messaging system.
nodecg.listenFor('timerStart', () => {
  startTimer(true).catch(() => {});
});
nodecg.listenFor('timerPause', () => {
  pauseTimer().catch(() => {});
});
nodecg.listenFor('timerReset', (force) => {
  resetTimer(force).catch(() => {});
});
nodecg.listenFor('timerFinish', () => {
  stopTimer().catch(() => {});
});

setInterval(() => {
  tick();
}, 1000);
