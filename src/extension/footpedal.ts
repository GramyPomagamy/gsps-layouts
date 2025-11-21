import { type Configschema } from "@gsps-layouts/types";
import { type NodeCGServer } from "./util/nodecg";
import { type TaggedLogger } from "./util/tagged-logger";

type ModuleParams = {
  config: Configschema["footpedal"];
  logger: TaggedLogger;
  nodecg: NodeCGServer;
};

export async function setup({ nodecg }: ModuleParams) {
  const router = nodecg.Router();

  router.get("/makeHighlight", (_req, res) => {
    res.send("OK!");
    nodecg.sendMessage("makeHighlight");
  });

  router.get("/switchFromHostScreen", (_req, res) => {
    res.send("OK!");
    nodecg.sendMessage("switchFromHostScreen");
  });

  nodecg.mount(router);
}
