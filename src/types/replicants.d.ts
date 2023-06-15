import { TimeStruct } from 'src/extension/lib/time';
import { Asset, Bid, LogoCycle, Milestones, Prize } from './custom';
import {
  AutoUpdateTotal,
  Bids,
  Commentators,
  Countdown,
  CountdownRunning,
  DonationsToRead,
  Hosterka,
  NameCycle,
  ObsData,
  Prizes,
  Reader,
  SecondaryTimer,
  Song,
  Total,
} from './generated';

type ReplicantMap = {
  autoUpdateTotal: AutoUpdateTotal;
  currentBids: Bids;
  allBids: Bids;
  commentators: Commentators;
  countdown: TimeStruct;
  countdownRunning: CountdownRunning;
  donationsToRead: DonationsToRead;
  hosterka: Hosterka;
  nameCycle: NameCycle;
  obsData: ObsData;
  prizes: Prizes;
  reader: Reader;
  secondaryTimer: SecondaryTimer;
  song: Song;
  total: Total;
  logoCycles: Array<LogoCycle>;
  logoCyclesBreak: Array<LogoCycle>;
  'assets:videosCharity': Array<Asset>;
  'assets:videosSponsors': Array<Asset>;
  'assets:videosLong': Array<Asset>;
  milestones: Milestones;
  donationsToAccept: number;
  bidsToAccept: number;
  readerAlert: boolean;
  playLongVideo: boolean;
  currentlyShownBid: Bid | null;
  currentlyShownPrize: Prize | null;
  currentlyShownBidIndex: number;
  currentlyShownPrizeIndex: number;
  showBidsPanel: boolean;
  showPrizePanel: boolean;
  hostCountdown: TimeStruct;
  hostCountdownRunning: boolean;
};

export {
  AutoUpdateTotal,
  Bids,
  Commentators,
  Countdown,
  CountdownRunning,
  DonationsToRead,
  Hosterka,
  NameCycle,
  ObsData,
  Prizes,
  Reader,
  SecondaryTimer,
  Song,
  Total,
  LogoCycle,
  Asset,
  Bid,
  Prize,
  Milestones,
  ReplicantMap,
};
