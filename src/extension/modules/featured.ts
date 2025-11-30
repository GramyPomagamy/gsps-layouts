import { type Configschema, type ModuleParams } from "@gsps-layouts/types";
import axios from "axios";

export async function setup({
  nodecg,
  config,
  logger,
}: ModuleParams<Configschema["twitchExt"]>): Promise<void> {
  const updateFeatured = async (players: Array<string>) => {
    const channels = players.join(",");
    try {
      const resp = await axios.get(
        `https://api.furious.pro/featuredchannels/bot/${config.token}/${encodeURIComponent(channels)}`,
      );

      if (resp.status === 200) {
        logger.info(
          `Pomyślnie zaktualizowano panel z runnerami pod streamem z kanałami ${channels}`,
        );
      } else {
        throw new Error(`Status Code ${resp.status}`);
      }
    } catch (err) {
      logger.warn(
        "Błąd przy aktualizowaniu panelu z runnerami pod streamem: ",
        err,
      );
    }
  };

  nodecg.listenFor(
    "repeaterFeaturedChannels",
    "nodecg-speedcontrol",
    (names) => {
      if (config.enabled) {
        void updateFeatured(names);
      }
    },
  );
}
