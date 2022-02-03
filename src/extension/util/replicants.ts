/* eslint-disable max-len */

import {
    Total,
    AutoUpdateTotal,
    NameCycle,
    Song,
    ObsData,
} from '@gsps-layouts/types/schemas'
import { get as nodecg } from './nodecg'

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const totalReplicant = nodecg().Replicant<Total>('total')
export const autoUpdateTotalReplicant =
    nodecg().Replicant<AutoUpdateTotal>('autoUpdateTotal')
export const nameCycleReplicant = nodecg().Replicant<NameCycle>('nameCycle')
export const songReplicant = nodecg().Replicant<Song>('song')
export const obsDataReplicant = nodecg().Replicant<ObsData>('obsData', {
    persistent: false,
})
