import { RunData } from '../../../nodecg-speedcontrol/src/types/schemas';

export function formatPlayers(run: RunData) {
  return (
    run.teams
      .map((team) => team.name || team.players.map((player) => player.name).join(', '))
      .join(' vs. ') || 'Bez gracza'
  );
}
