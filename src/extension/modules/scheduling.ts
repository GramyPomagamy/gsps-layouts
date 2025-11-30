import {
  type Configschema,
  type ModuleParams,
  type RunCustomData,
  type RunCustomPlayerData,
} from "@gsps-layouts/types";
import { type RunDataArray } from "speedcontrol/types";
import { type OengusImportStatus } from "speedcontrol/types/schemas";

export async function setup({
  nodecg,
}: ModuleParams<Configschema["autoUpdateGameAfterImport"]>) {
  const oengusImportStatus = nodecg.Replicant<OengusImportStatus>(
    "oengusImportStatus",
    "nodecg-speedcontrol",
  );
  const runDataArray = nodecg.Replicant<RunDataArray>(
    "runDataArray",
    "nodecg-speedcontrol",
  );

  const defaultGame = "Games + Demos";

  oengusImportStatus.on("change", (newVal, oldVal) => {
    if (
      oldVal &&
      oldVal.importing === true &&
      newVal &&
      newVal.importing === false
    ) {
      runDataArray.value!.forEach((run) => {
        if (run.game) {
          const customData = run.customData as RunCustomData;
          run.gameTwitch =
            typeof customData.gameTwitchName != "undefined"
              ? customData.gameTwitchName
              : defaultGame;

          run.teams.forEach((team) => {
            team.players.forEach((player) => {
              // zero out oengus data if we get any
              player.pronouns = "";
              player.country = "";
              if (customData.players) {
                const playerData = JSON.parse(customData.players);
                if (
                  typeof (playerData[player.name] as RunCustomPlayerData) !=
                  "undefined"
                ) {
                  // player pronouns
                  player.pronouns =
                    typeof (playerData[player.name] as RunCustomPlayerData)
                      .pronouns != "undefined"
                      ? (playerData[player.name] as RunCustomPlayerData)
                          .pronouns
                      : "";

                  // player flag
                  player.country =
                    typeof (playerData[player.name] as RunCustomPlayerData)
                      .flagToShow != "undefined"
                      ? (playerData[player.name] as RunCustomPlayerData)
                          .flagToShow
                      : "";
                } else {
                  player.pronouns = "";
                }
              } else {
                player.pronouns = "";
              }
            });
          });
        }
      });
    }
  });
}
