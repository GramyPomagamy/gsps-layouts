/* eslint-disable max-len */
import { get as nodecg } from './nodecg';
import { timeStrToMS, deltaToTimeStr } from './helpers';
import { GtaTimer } from 'src/types/generated';

const splitsTime = nodecg().bundleConfig.gtaTrilogy?.splits;

export const timerRep = nodecg().Replicant<GtaTimer>('gtaTimer');
export const splitsTimerRep = nodecg().Replicant('gtaSplitsTimer');
export const completionRep = nodecg().Replicant('gtaCompletion', {
  defaultValue: '0',
});
export const currentSplitRep = nodecg().Replicant<"GTA III" | "GTA: Vice City" | "GTA: San Andreas" | undefined>('gtaCurrentSplit', {
  defaultValue: 'GTA III',
});

export const splitsRep = nodecg().Replicant('gtaSplits', {
  defaultValue: [
    {
      name: 'GTA III',
      originalTime: timeStrToMS(splitsTime?.GTA3 ?? ''),
      formattedOriginalTime: splitsTime?.GTA3,
      delta: 0,
      formattedDelta: deltaToTimeStr(0),
    },
    {
      name: 'GTA: Vice City',
      originalTime: timeStrToMS(splitsTime?.GTAVC ?? ''),
      formattedOriginalTime: splitsTime?.GTAVC,
      delta: 0,
      formattedDelta: deltaToTimeStr(0),
    },
    {
      name: 'GTA: San Andreas',
      originalTime: timeStrToMS(splitsTime?.GTASA ?? ''),
      formattedOriginalTime: splitsTime?.GTASA,
      delta: 0,
      formattedDelta: deltaToTimeStr(0),
    },
  ],
});
