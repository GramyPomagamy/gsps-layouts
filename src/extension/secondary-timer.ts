/* eslint-disable @typescript-eslint/no-empty-function */
import livesplitCore from 'livesplit-core';
import { msToTimeStr } from './util/helpers';
import { NodeCG } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';

/** Code relating to the secondary timer. */
export const secondaryTimer = (nodecg: NodeCG) => {
  const timerRep = nodecg.Replicant('secondaryTimer');
  // eslint-disable-next-line prefer-const
  let timer: livesplitCore.Timer;
  const logger = new TaggedLogger('Secondary Timer');

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
    timerRep.value!.time = '00:00';
    timerRep.value!.milliseconds = 0;
    timerRep.value!.timestamp = 0;
    timerRep.value!.phase = 'stopped';

    logger.debug('Replicant przywrócony do stanu pierwotnego');
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
    logger.debug(`Game Time ustawiony na ${ms}ms`);
  }

  /**
   * Start/resume the timer, depending on the current state.
   * @param force Force the timer to start, even if it's state is running/changes are disabled.
   */
  async function startTimer(force?: boolean): Promise<void> {
    try {
      // Error if the timer is disabled.
      if (!force) {
        throw new Error('Zmiany timera są wyłączone');
      }
      // Error if the timer is finished.
      if (timerRep.value!.phase === 'finished') {
        throw new Error('Timer jest w stanie ukończonym');
      }
      // Error if the timer isn't stopped or paused (and we're not forcing it).
      if (!force && !['stopped', 'paused'].includes(timerRep.value!.phase)) {
        throw new Error('Timer nie jest zapauzowany/zatrzymany');
      }

      if (timer.currentPhase() === LS_TIMER_PHASE.NotRunning) {
        timer.start();
        logger.debug('Rozpoczęto timer');
      } else {
        timer.resume();
        logger.debug('Kontynuuje timer');
      }
      setGameTime(timerRep.value!.milliseconds);
      timerRep.value!.phase = 'running';
    } catch (err) {
      logger.debug('Nie można zacząć/kontynuować timera:', err);
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
        throw new Error('Timer obecnie nie chodzi');
      }

      timer.pause();
      timerRep.value!.phase = 'paused';
      logger.debug('Zapauzowano');
    } catch (err) {
      logger.debug('Nie zapauzować timera:', err);
      throw err;
    }
  }

  /**
   * Reset the timer.
   * @param force Forces a reset even if changes are disabled.
   */
  async function resetTimer(force?: boolean): Promise<void> {
    try {
      // Error if the timer is disabled.
      if (!force) {
        throw new Error('Zmiany timera są wyłączone');
      }
      // Error if the timer is stopped.
      if (timerRep.value!.phase === 'stopped') {
        throw new Error('Timer jest zatrzymany');
      }

      timer.reset(false);
      resetTimerRepToDefault();
      logger.debug('Zresetowano');
    } catch (err) {
      logger.debug('Nie można zresetować timera:', err);
      throw err;
    }
  }

  /**
   * Stop/finish the timer.
   * @param id Team's ID you wish to have finish (if there is an active run).
   * @param forfeit Specify this if the team has forfeit.
   */
  async function stopTimer(): Promise<void> {
    try {
      // Error if timer is not running.
      if (!['running', 'paused'].includes(timerRep.value!.phase)) {
        throw new Error('Timer nie jest w ruchu/nie jest zapauzowany');
      }

      // Stop the timer if all the teams have finished (or no teams exist).
      if (timerRep.value!.phase === 'paused') {
        timer.resume();
      }
      timer.split();
      timerRep.value!.phase = 'finished';
      logger.debug('Ukończono');
    } catch (err) {
      logger.debug('Nie można zatrzymać timera:', err);
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
    logger.info(`Odzyskano ${(missedTime / 1000).toFixed(2)} sekund straconego czasu`);
    startTimer(true).catch(() => {
      /* catch error if needed, for safety */
    });
  }

  nodecg.listenFor('secondaryTimerStart', () => {
    startTimer(true).catch(() => {});
  });
  nodecg.listenFor('secondaryTimerPause', () => {
    pauseTimer().catch(() => {});
  });
  nodecg.listenFor('secondaryTimerReset', (force) => {
    resetTimer(force).catch(() => {});
  });
  nodecg.listenFor('secondaryTimerFinish', () => {
    stopTimer().catch(() => {});
  });

  setInterval(tick, 100);
};
