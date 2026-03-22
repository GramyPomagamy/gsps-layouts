import fs from "fs";
import path from "path";
import { type ModuleParams } from "@gsps-layouts/types";
import { stringify } from "csv-stringify";
import { type RunDataActiveRun } from "speedcontrol/types";
import { formatPlayers, formatTwitch } from "../util/helpers";

export async function setup({
  nodecg,
  logger,
}: ModuleParams<object>): Promise<void> {
  const getFileName = (filePath: string) => {
    return path.parse(filePath).name;
  };

  const getDirectory = (filePath: string) => {
    return path.parse(filePath).dir;
  };

  const createVoDTimeStamp = (
    timestamp: number,
    run: RunDataActiveRun,
    recordingName: string,
  ) => {
    const fileName = getFileName(recordingName) + ".csv";
    const path = getDirectory(recordingName) + "\\" + fileName;

    if (run && run.game) {
      stringify(
        [
          {
            timestamp,
            game: run.game,
            category: run.category,
            players: formatPlayers(run.teams),
            twitch: formatTwitch(run.teams),
          },
        ],
        {
          header: false,
        },
        (err, output) => {
          if (err) {
            logger.error(`Failed to prepare data for CSV file: ${err}`);
            return;
          } else {
            try {
              fs.appendFileSync(path, output);
              logger.info("Saved timestamp to CSV file");
            } catch (err) {
              logger.error(`Failed to save CSV file: ${err}`);
            }
          }
        },
      );
    } else {
      logger.info("No current game!");
    }
  };

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
