import { type ModuleParams } from "@gsps-layouts/types";
import { type RunDataActiveRun } from "speedcontrol/types/schemas";
import { type NameCycle, type PlayerStreams } from "src/types/generated";

export async function setup({ nodecg }: ModuleParams<object>) {
  let cycleTimeout: NodeJS.Timeout;

  const nameCycleReplicant = nodecg.Replicant<NameCycle>("nameCycle");
  const activeRunReplicant = nodecg.Replicant<RunDataActiveRun>(
    "runDataActiveRun",
    "nodecg-speedcontrol",
  );
  const readerAlertReplicant = nodecg.Replicant("readerAlert");
  const playerStreamsReplicant = nodecg.Replicant<PlayerStreams>(
    "playerStreams",
    {
      defaultValue: {
        player1: "",
        player2: "",
        player3: "",
        player4: "",
      },
    },
  );

  const doAllPlayersInRunHaveTwitch = (run: RunDataActiveRun): boolean => {
    const players = [];
    const playersWithTwitch = [];

    if (run && run.teams) {
      for (const team of run.teams) {
        if (team) {
          for (const player of team.players) {
            players.push(player.name);
            if (player.social.twitch) {
              playersWithTwitch.push(player.name);
            }
          }
        }
      }

      return JSON.stringify(players) === JSON.stringify(playersWithTwitch);
    } else {
      return false;
    }
  };

  // Controls the name cycling ticks for players/hosts
  const cycleNames = (reset = false): void => {
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
  };

  activeRunReplicant.on("change", () => {
    cycleNames(true);
  });

  cycleNames(true);

  const toggleReaderAlert = () => {
    readerAlertReplicant.value = !readerAlertReplicant.value;
  };

  nodecg.listenFor("toggleAlert", toggleReaderAlert);

  let hosterkaNameTimeout: NodeJS.Timeout;

  // hide hosterka names after 10s
  nodecg.listenFor("showNames", () => {
    hosterkaNameTimeout = setTimeout(() => {
      nodecg.sendMessage("hideNames");
    }, 10 * 1000);
  });

  nodecg.listenFor("hideNames", () => {
    clearTimeout(hosterkaNameTimeout);
  });

  nodecg.listenFor(
    "setFeedStream",
    ({ feed, twitchStream }: { feed: number; twitchStream: string }) => {
      switch (feed) {
        case 0:
          playerStreamsReplicant.value!.player1 = twitchStream;
          break;
        case 1:
          playerStreamsReplicant.value!.player2 = twitchStream;
          break;
        case 2:
          playerStreamsReplicant.value!.player3 = twitchStream;
          break;
        case 3:
          playerStreamsReplicant.value!.player4 = twitchStream;
          break;
        default:
          break;
      }
    },
  );
}
