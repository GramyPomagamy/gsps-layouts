import {
  type Configschema,
  type ModuleParams,
  type Song,
  type SongProgress,
} from "@gsps-layouts/types";
import { FoobarControl } from "../util/foobar";

export async function setup({
  nodecg,
  config,
  logger,
}: ModuleParams<Configschema["foobar"]>) {
  if (!config.address) {
    throw new Error("Foobar API URL not provided!");
  }

  const foobar = new FoobarControl(config.address, logger);
  const songReplicant = nodecg.Replicant<Song>("song");
  const songProgressReplicant = nodecg.Replicant<SongProgress>("songProgress", {
    defaultValue: { duration: 0, position: 0 },
  });

  const getSong = async () => {
    const { displayName, duration, position } = await foobar.getSongInfo();

    songReplicant.value = displayName;
    songProgressReplicant.value.position = position;
    songProgressReplicant.value.duration = duration;
  };

  setInterval(() => getSong, 500);
}
