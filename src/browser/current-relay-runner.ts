import { RunDataTeam, RunDataPlayer } from "speedcontrol/src/types";

const getCurrentRelayRunner = (team: RunDataTeam) => {
  let currentRelayRunner: RunDataPlayer | undefined;

  team.players.forEach((player: RunDataPlayer) => {
    if (player.id === team.relayPlayerID) {
      currentRelayRunner = player;
    }
  });
  return currentRelayRunner;
};

export default getCurrentRelayRunner;