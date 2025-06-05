import { RunData } from 'speedcontrol/src/types';

export function formatPlayers(run: RunData) {
  return (
    run.teams
      .map((team) => team.name || team.players.map((player) => player.name).join(', '))
      .join(' vs. ') || 'Bez gracza'
  );
}
