import { type Configschema, type ModuleParams } from "@gsps-layouts/types";

export async function setup({
  nodecg,
}: ModuleParams<Configschema["footpedal"]>) {
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
