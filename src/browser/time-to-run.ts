import humanizeDuration from 'humanize-duration';
import { RunData } from 'speedcontrol/src/types/schemas';

function customizedRounding(time: number): number {
  let rounded: number;
  if (time < 300) {
    rounded = Math.round(time / 60) * 60;
  } else if (time < 3600) {
    rounded = Math.round(time / 300) * 300;
  } else if (time < 7200) {
    const round10 = Math.round(time / 600) * 600;
    const round15 = Math.round(time / 900) * 900;
    rounded = Math.abs(round10 - time) < Math.abs(round15 - time) ? round10 : round15;
  } else if (time < 14400) {
    rounded = Math.round(time / 900) * 900;
  } else if (time < 21600) {
    rounded = Math.round(time / 1800) * 1800;
  } else {
    rounded = Math.round(time / 3600) * 3600;
  }
  return rounded;
}

export function timeToRun(run: RunData): string {
  let value = '';

  if (run.scheduledS) {
    const now = Math.floor(Date.now() / 1000);
    const timerS = run.scheduledS - now;
    if (timerS > 30) {
      const roundedS = customizedRounding(timerS);
      value =
        ' za ok. ' +
        humanizeDuration(roundedS * 1000, {
          language: 'pl',
          conjunction: ' i ',
          serialComma: false,
          units: ['d', 'h', 'm'],
        });
    }
  }
  return value;
}
