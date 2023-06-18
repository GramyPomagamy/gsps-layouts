import { NameCycle } from 'src/types/generated';
import { RunDataActiveRun } from '../../../nodecg-speedcontrol/src/types/schemas';
import { NodeCGServer } from './util/nodecg';

let cycleTimeout: NodeJS.Timeout;

/** Code relating to misc. layout functions. */
export const layouts = (nodecg: NodeCGServer) => {
  const nameCycleReplicant = nodecg.Replicant<NameCycle>('nameCycle');
  const activeRunReplicant = nodecg.Replicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const readerAlertReplicant = nodecg.Replicant('readerAlert');

  // Controls the name cycling ticks for players/hosts
  function cycleNames(reset = false): void {
    clearTimeout(cycleTimeout);
    let cycle = 0;
    if (doAllPlayersInRunHaveTwitch(activeRunReplicant.value!)) {
      if (!reset) {
        cycle = nameCycleReplicant.value! + 1;
      }
      if (cycle === 0) {
        // Name
        cycleTimeout = setTimeout(cycleNames, 45 * 1000);
      } else if (cycle === 1) {
        // Twitch
        cycleTimeout = setTimeout(cycleNames, 15 * 1000);
      } else {
        cycleNames(true);
        return;
      }
    } else {
      cycleTimeout = setTimeout(cycleNames, 45 * 1000);
    }

    nameCycleReplicant.value = cycle;
  }

  function doAllPlayersInRunHaveTwitch(run: RunDataActiveRun): boolean {
    const players = [];
    const playersWithTwitch = [];
    if (run && run.teams) {
      for (let i = 0; i < run.teams.length; i++) {
        const team = run.teams[i];
        if (team) {
          for (let i = 0; i < team.players.length; i++) {
            players.push(team.players[i]!.name);
            if (team.players[i]!.social.twitch) {
              playersWithTwitch.push(team.players[i]!.name);
            }
          }
        }
      }

      if (JSON.stringify(players) === JSON.stringify(playersWithTwitch)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  activeRunReplicant.on('change', () => {
    cycleNames(true);
  });

  cycleNames(true);

  function toggleReaderAlert() {
    readerAlertReplicant.value = !readerAlertReplicant.value;
  }

  nodecg.listenFor('toggleAlert', toggleReaderAlert);
};
