/* eslint-disable max-len */

import type { Total, AutoUpdateTotal, NameCycle } from '@gsps-layouts/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const totalReplicant = nodecg().Replicant<Total>('total');
export const autoUpdateTotalReplicant = nodecg().Replicant<AutoUpdateTotal>('autoUpdateTotal');
export const nameCycleReplicant = nodecg().Replicant<NameCycle>('nameCycle');
