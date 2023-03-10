/* eslint-disable max-len */

import {
  Total,
  AutoUpdateTotal,
  NameCycle,
  Song,
  ObsData,
  DonationsToRead,
  Prizes,
  Commentators,
  SecondaryTimer,
  Bids,
} from '@gsps-layouts/types/schemas';
import { Bid, Milestones, Prize, Asset } from '@gsps-layouts/types';
import type { RunDataActiveRun, Timer } from 'speedcontrol/src/types/schemas';
import { get as nodecg } from './nodecg';

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
export const milestonesReplicant = nodecg().Replicant<Milestones>('milestones');
export const prizesReplicant = nodecg().Replicant<Prizes>('prizes');
export const donationsToAcceptReplicant =
  nodecg().Replicant<number>('donationsToAccept');
export const bidsToAcceptReplicant = nodecg().Replicant<number>('bidsToAccept');
export const commentatorsReplicant =
  nodecg().Replicant<Commentators>('commentators');
export const readerAlertReplicant = nodecg().Replicant<boolean>('readerAlert', {
  defaultValue: false,
});
export const playLongVideoReplicant = nodecg().Replicant<boolean>(
  'playLongVideo',
  {
    defaultValue: false,
  }
);
export const secondaryTimerReplicant =
  nodecg().Replicant<SecondaryTimer>('secondaryTimer');
export const currentBidsRep = nodecg().Replicant<Bids>('currentBids', {
  defaultValue: [],
});
export const allBidsRep = nodecg().Replicant<Bids>('allBids', {
  defaultValue: [],
});
export const currentlyShownPrizeIndex = nodecg().Replicant<number>(
  'currentlyShownPrizeIndex',
  { defaultValue: 0 }
);
export const currentlyShownBidIndex = nodecg().Replicant<number>(
  'currentlyShownBidIndex',
  { defaultValue: 0 }
);
export const showBidsPanel = nodecg().Replicant<boolean>('showBidsPanel', {
  defaultValue: false,
});
export const showPrizePanel = nodecg().Replicant<boolean>('showPrizePanel', {
  defaultValue: false,
});
export const currentlyShownBid = nodecg().Replicant<Bid | null>(
  'currentlyShownBid',
  { defaultValue: null }
);
export const currentlyShownPrize = nodecg().Replicant<Prize | null>(
  'currentlyShownPrize',
  { defaultValue: null }
);
export const videosCharity = nodecg().Replicant<Asset[]>(
  'assets:videos-charity'
);
export const videosSponsors = nodecg().Replicant<Asset[]>(
  'assets:videos-sponsors'
);
export const videosLong = nodecg().Replicant<Asset[]>('assets:videos-long');
