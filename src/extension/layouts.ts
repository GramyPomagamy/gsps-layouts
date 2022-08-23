import { nameCycleReplicant, activeRunReplicant } from './util/replicants';
import { RunDataActiveRun } from '../../../nodecg-speedcontrol/src/types/schemas';

// Controls the name cycling ticks for players/hosts
function cycleNames(reset = false): void {
  let cycle = 0;
  if (doAllPlayersInRunHaveTwitch(activeRunReplicant.value)) {
    if (!reset) {
      cycle = nameCycleReplicant.value + 1;
    }
    if (cycle === 0) {
      // Name
      setTimeout(cycleNames, 45 * 1000);
    } else if (cycle === 1) {
      // Twitch
      setTimeout(cycleNames, 15 * 1000);
    } else {
      cycleNames(true);
      return;
    }
  } else {
    setTimeout(cycleNames, 45 * 1000);
  }

  nameCycleReplicant.value = cycle;
}

function doAllPlayersInRunHaveTwitch(run: RunDataActiveRun): boolean {
  let players = [];
  let playersWithTwitch = [];
  for (let i = 0; i < run.teams.length; i++) {
    let team = run.teams[i];
    for (let i = 0; i < team.players.length; i++) {
      players.push(team.players[i].name);
      if (team.players[i].social.twitch) {
        playersWithTwitch.push(team.players[i].social.twitch);
      }
    }
  }

  if (JSON.stringify(players) === JSON.stringify(playersWithTwitch)) {
    return true;
  } else {
    return false;
  }
}

cycleNames(true);
