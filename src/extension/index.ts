import type NodeCG from "@nodecg/types";
import { type Configschema } from "../types/generated";
import { type ModuleDefinition } from "./util/helpers";
import { set } from "./util/nodecg";
import { TaggedLogger } from "./util/tagged-logger";

export default async (nodecg: NodeCG.ServerAPI<Configschema>) => {
  set(nodecg);
  require("./countdown");
  require("./bids");
  require("./donations-prizes");
  require("./featured");
  require("./foobar");
  require("./footpedal");
  require("./highlighter");
  require("./host-countdown");
  require("./layouts");
  require("./media-box");
  require("./milestones");
  require("./nowplaying");
  require("./obs");
  require("./scheduling");
  require("./sd");
  require("./secondary-timer");
  require("./timestamps");
  require("./total");
  require("./generic-replicant");
  require("./mixer");

  const modules = {
    tracker: {
      name: "tracker",
      enabled: nodecg.bundleConfig.tracker.enabled,
      config: nodecg.bundleConfig.tracker,
      loadFn: () => import("./tracker"),
    },
    genericReplicant: {
      name: "generic-replicant",
      enabled: nodecg.bundleConfig.genericReplicant.enabled,
      config: nodecg.bundleConfig.genericReplicant,
      loadFn: () => import("./generic-replicant"),
    },
  };

  // load all modules at once instead of looping over the object and loading them one by one
  await Promise.all(
    Object.values(modules).map(async (module) => {
      // unfortunately TypeScript *really* doesn't like the stuff I'm doing here, so `any` type it is
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { name, enabled, loadFn, config } = module as ModuleDefinition<any>;

      if (!enabled) return;

      const logger = new TaggedLogger(name);

      try {
        const mod = await loadFn();

        await mod.setup({ nodecg, config, logger });

        logger.info(`Module ${name} loaded`);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err.message);
        } else {
          logger.error(err);
        }
      }
    }),
  );
};
