import fs from "fs";
import path from "path";
import { type ModuleParams } from "@gsps-layouts/types";
import { stringify } from "csv-stringify";
import {
  type RunData,
  type RunDataActiveRun,
  type RunDataTeam,
} from "speedcontrol/types";

export async function setup({
  nodecg,
  logger,
}: ModuleParams<object>): Promise<void> {
  function formatPlayers(run: RunData) {
    return (
      run.teams
        .map(
          (team: RunDataTeam) =>
            team.name ?? team.players.map((player) => player.name).join(";"),
        )
        .join(";") ?? "Bez gracza"
    );
  }

  function formatTwitch(run: RunData) {
    return run.teams
      .map(
        (team: RunDataTeam) =>
          team.name ??
          team.players.map((player) => player.social.twitch).join(";"),
      )
      .join(";");
  }

  function getFileName(filePath: string) {
    return path.parse(filePath).name;
  }

  function getDirectory(filePath: string) {
    return path.parse(filePath).dir;
  }

  function createVoDTimeStamp(
    timestamp: number,
    run: RunDataActiveRun,
    recordingName: string,
  ) {
    const fileName = getFileName(recordingName) + ".csv";
    const path = getDirectory(recordingName) + "\\" + fileName;

    if (run && run.game) {
      stringify(
        [
          {
            timestamp,
            game: run.game,
            category: run.category,
            players: formatPlayers(run),
            twitch: formatTwitch(run),
          },
        ],
        {
          header: false,
        },
        (err, output) => {
          if (err) {
            logger.error(`Błąd przy przygotowaniu danych do pliku CSV! ${err}`);
            return;
          } else {
            try {
              fs.appendFileSync(path, output);
              logger.info("Zapisano timestamp do pliku CSV");
            } catch (err) {
              logger.error(`Błąd przy zapisywaniu pliku CSV! ${err}`);
            }
          }
        },
      );
    } else {
      logger.info("Brak obecnej gry!");
    }
  }

  nodecg.listenFor(
    "createVoDTimeStamp",
    ({
      timestamp,
      run,
      recordingName,
    }: {
      recordingName: string;
      run: RunDataActiveRun;
      timestamp: number;
    }) => {
      if (run !== undefined) {
        createVoDTimeStamp(timestamp, run, recordingName);
      }
    },
  );
}
