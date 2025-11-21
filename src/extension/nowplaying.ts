import { type Song, type SongProgress } from "src/types/generated";
import { FoobarControl } from "./util/foobar";
import { get } from "./util/nodecg";

const nodecg = get();
const config = nodecg.bundleConfig.foobar;
const foobar = new FoobarControl(config.address!);
const songReplicant = nodecg.Replicant<Song>("song");
const songProgressReplicant = nodecg.Replicant<SongProgress>("songProgress", {
  defaultValue: { duration: 0, position: 0 },
});

async function GetSong() {
  if (config.enabled) {
    const { displayName, duration, position } = await foobar.getSongInfo();

    songReplicant.value = displayName;
    songProgressReplicant.value.position = position;
    songProgressReplicant.value.duration = duration;
  }
}

setInterval(GetSong, 500);
