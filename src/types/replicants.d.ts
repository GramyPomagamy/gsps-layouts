import { TimeStruct } from 'src/extension/lib/time';
import { Asset, Bid, LogoCycle, MediaBoxItem, Milestones, Prize } from './custom';
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
  'assets:videos-charity': Array<Asset>;
  'assets:videos-sponsors': Array<Asset>;
  'assets:videos-long': Array<Asset>;
  'assets:media-box': Array<Asset>;
  'assets:media-box-break': Array<Asset>;
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
  mediaBoxItem: MediaBoxItem;
  mediaBoxItemBreak: MediaBoxItem;
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
  MediaBoxItem,
  ReplicantMap,
};
