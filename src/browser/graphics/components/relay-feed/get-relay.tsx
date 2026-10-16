import { RunDataPlayer, RunDataTeam } from 'speedcontrol/src/types';

export const getCurrentRelayRunner = (team: RunDataTeam): RunDataPlayer | undefined =>
  team.players.find((player) => player.id === team.relayPlayerID);
