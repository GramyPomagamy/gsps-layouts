import {
  type Configschema,
  type ModuleParams,
  type ObsData,
} from "@gsps-layouts/types";
import { GoogleSpreadsheet } from "google-spreadsheet";
import io from "socket.io-client";
import { type RunDataActiveRun, type Timer } from "speedcontrol/types";

export async function setup({
  config,
  nodecg,
  logger,
}: ModuleParams<Configschema["highlighter"]>): Promise<void> {
  if (!config.spreadsheetId || !config.service_email || !config.private_key) {
    logger.error(
      "Highlighter module is enabled but missing required configuration (spreadsheetId, service_email, or private_key)",
    );
    return;
  }

  const obsDataReplicant = nodecg.Replicant<ObsData>("obsData");
  const timerReplicant = nodecg.Replicant<Timer>(
    "timer",
    "nodecg-speedcontrol",
  );
  const activeRunReplicant = nodecg.Replicant<RunDataActiveRun>(
    "runDataActiveRun",
    "nodecg-speedcontrol",
  );

  const sheets = new GoogleSpreadsheet(config.spreadsheetId);
  await sheets.useServiceAccountAuth({
    client_email: config.service_email,
    private_key: config.private_key,
  });
  await sheets.loadInfo();

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toISOString();
  };

  const getCurrentGame = (activeRun: RunDataActiveRun | null): string => {
    if (!activeRun) {
      return "Brak ustawionej gry";
    }

    let run = "Brak ustawionej gry";
    if (activeRun.game) {
      run = activeRun.game;
    }
    if (activeRun.category) {
      run += ` ${activeRun.category}`;
    }
    return run;
  };

  const makeHighlight = async (): Promise<void> => {
    try {
      const sheet = sheets.sheetsByTitle["Raw"];
      if (!sheet) {
        logger.error("Sheet 'Raw' not found in spreadsheet");
        return;
      }

      const timestamp = formatTime(Date.now());
      const timer = timerReplicant.value?.time ?? "00:00:00";
      const run = getCurrentGame(activeRunReplicant.value);
      const scene = obsDataReplicant.value?.scene ?? "Brak sceny";

      await sheet.addRow([timestamp, run, timer, scene]);
      logger.info("Highlight wykonany poprawnie");
    } catch (err) {
      logger.error(`Błąd przy dodawaniu danych do arkusza: ${err}`);
    }
  };

  nodecg.listenFor("makeHighlight", () => {
    void makeHighlight();
  });

  if (config.remote?.enabled && config.remote.url) {
    const socket = io(config.remote.url);
    let loggedXhrPollError = false;

    socket.on("connect", () => {
      logger.info(
        `Podłączono do socketa highlightera na ${config.remote!.url!}`,
      );
      loggedXhrPollError = false;
    });

    socket.on("connect_error", (err: { message: string }) => {
      if (err.message === "xhr poll error") {
        if (loggedXhrPollError) {
          return;
        }
        loggedXhrPollError = true;
      }

      logger.error("Highlighter socket connect_error:", err);
    });

    socket.on("highlight", () => {
      void makeHighlight();
    });
  }
}
