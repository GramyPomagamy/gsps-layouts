/* eslint-disable max-len */

import {
  Total,
  AutoUpdateTotal,
  NameCycle,
  Song,
  ObsData,
  DonationsToRead,
} from '@gsps-layouts/types/schemas';
import type {
  RunDataActiveRun,
  Timer,
} from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const totalReplicant = nodecg().Replicant<Total>('total');
export const autoUpdateTotalReplicant =
  nodecg().Replicant<AutoUpdateTotal>('autoUpdateTotal');
export const nameCycleReplicant = nodecg().Replicant<NameCycle>('nameCycle');
export const songReplicant = nodecg().Replicant<Song>('song');
export const obsDataReplicant = nodecg().Replicant<ObsData>('obsData', {
  persistent: false,
});
export const timerReplicant = nodecg().Replicant<Timer>(
  'timer',
  'nodecg-speedcontrol'
);
export const activeRunReplicant = nodecg().Replicant<RunDataActiveRun>(
  'runDataActiveRun',
  'nodecg-speedcontrol'
);
export const donationsToReadReplicant =
  nodecg().Replicant<DonationsToRead>('donationsToRead');
