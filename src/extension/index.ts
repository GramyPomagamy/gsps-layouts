import { type ModuleDefinition, type NodeCGServer } from "@gsps-layouts/types";
import { defineModules } from "./modules/index.js";
import { TaggedLogger } from "./util/tagged-logger.js";

export default async (nodecg: NodeCGServer) => {
  const modules = defineModules(nodecg);

  // load all modules at once instead of looping over the object and loading them one by one
  await Promise.all(
    Object.values(modules).map(
      // unfortunately TypeScript *really* doesn't like the stuff I'm doing here, so `any` type it is
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async ({ name, enabled, loadFn, config }: ModuleDefinition<any>) => {
        if (!enabled) return;

        const logger = new TaggedLogger(name, nodecg);

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
      },
    ),
  );
};
