import {
  type Channel,
  type Configschema,
  type ModuleParams,
} from "@gsps-layouts/types";
import { Mixer } from "../util/mixer";

export async function setup({
  config,
  nodecg,
  logger,
}: ModuleParams<Configschema["mixer"]>): Promise<void> {
  if (!config.address || !config.port) {
    throw new Error("Mixer address and port are required");
  }

  const channelIdToName: Record<string, string> = {
    "1": "H1",
    "2": "H2",
    "3": "H3",
    "4": "H4",
    "9": "Host1",
    "10": "Host2",
    "16": "Host3",
    "5": "Gra1",
    "7": "Gra2",
    "11": "Donacje",
  };

  const channelNames = Object.values(channelIdToName);

  const mixerSignalLevels = nodecg.Replicant<Record<string, number>>(
    "mixerSignalLevels",
    {
      defaultValue: channelNames.reduce(
        (acc, name) => {
          acc[name] = -Infinity;
          return acc;
        },
        { "": -Infinity } as Record<string, number>,
      ),
    },
  );

  nodecg.Replicant<Record<string, number>>("mixerThresholdLevels", {
    defaultValue: channelNames.reduce(
      (acc, name) => {
        acc[name] = -30;
        return acc;
      },
      { "": +Infinity } as Record<string, number>,
    ),
  });

  const mixer = new Mixer(
    { address: config.address, port: config.port },
    channelIdToName,
  );

  mixer.onMeters((levels) => {
    for (const [name, value] of Object.entries(levels)) {
      mixerSignalLevels.value![name as Channel] = value;
    }
  });

  mixer.onConnected((info) => {
    logger.info(info);
  });

  mixer.onError((error) => {
    logger.error(error.message);
  });

  mixer.onDebug((message) => {
    logger.debug(message);
  });

  mixer.connect();

  const onIntermission = () => {
    const channelsToMute = [
      "H1",
      "H2",
      "H3",
      "H4",
      "Gra1",
      "Gra2",
      "Host1",
      "Host2",
      "Host3",
    ];
    for (const channelName of channelsToMute) {
      mixer.muteChannel(channelName);
    }
  };

  nodecg.listenFor("intermissionStarted", onIntermission);
}
