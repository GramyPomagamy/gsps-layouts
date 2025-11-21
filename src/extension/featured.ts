import axios from "axios";
import { get } from "./util/nodecg";
import { TaggedLogger } from "./util/tagged-logger";

const nodecg = get();
const featuredLog = new TaggedLogger("featured");
const config = nodecg.bundleConfig.twitchExt;

async function updateFeatured(players: Array<string>) {
  const channels = players.join(",");
  try {
    const resp = await axios.get(
      `https://api.furious.pro/featuredchannels/bot/${config.token}/${encodeURIComponent(channels)}`,
    );

    if (resp.status === 200) {
      featuredLog.info(
        `Pomyślnie zaktualizowano panel z runnerami pod streamem z kanałami ${channels}`,
      );
    } else {
      throw new Error(`Status Code ${resp.status}`);
    }
  } catch (err) {
    featuredLog.warn(
      "Błąd przy aktualizowaniu panelu z runnerami pod streamem: ",
      err,
    );
  }
}

nodecg.listenFor("repeaterFeaturedChannels", "nodecg-speedcontrol", (names) => {
  if (config.enabled) {
    void updateFeatured(names);
  }
});
