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
} from '@gsps-layouts/types/schemas';
import { Big20Progress, Milestones } from '@gsps-layouts/types';
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
export const milestonesReplicant = nodecg().Replicant<Milestones>('milestones');
export const prizesReplicant = nodecg().Replicant<Prizes>('prizes');
export const donationsToAcceptReplicant =
  nodecg().Replicant<number>('donationsToAccept');
export const bidsToAcceptReplicant = nodecg().Replicant<number>('bidsToAccept');
export const commentatorsReplicant =
  nodecg().Replicant<Commentators>('commentators');
export const big20Progress = nodecg().Replicant<Big20Progress>('big20Progress', {
  defaultValue: {
    games:[
      "01. Super Mario Bros",
      "02. Ninja Gaiden",
      "03. Mega Man",
      "04. Darkwing Duck",
      "05. StarTropics",
      "06. Contra",
      "07. Batman",
      "08. Crystalis",
      "09. Super Mario Bros 2",
      "10. Blaster Master",
      "11. Kid Icarus",
      "12. The Legend of Zelda",
      "13. DuckTales",
      "14. Battletoads",
      "15. Castlevania",
      "16. Little Samson",
      "17. Chip 'n  Dale  Rescue  Rangers",
      "18. Zelda 2",
      "19. Super Mario Bros 3",
      "20. Mega Man 2",
    ],
    players: [
      {
        name: "Kaadzik",
        position: 0,
        color: "#18d3dd"
      },
      {
        "name": "WhiteMonster",
        "position": 0,
        "color": "#ffffff"
      },
      {
        "name": "pitpo",
        "position": 0,
        "color": "#ffbd16",
      }
    ],
  }
});
