import { type Configschema } from "@gsps-layouts/types";
import express from "express";
import { type GenericReplicant } from "../types/custom";
import { type ModuleParams } from "./util/helpers";

export async function setup({
  nodecg,
  logger,
}: ModuleParams<Configschema["genericReplicant"]>) {
  const genericReplicant = nodecg.Replicant<GenericReplicant>(
    "genericReplicant",
    {
      defaultValue: {},
    },
  );

  const router = nodecg.Router();
  router.use(express.json());

  logger.debug("HTTP Endpoint dla GenericReplicant włączony");
  router.post("/generic-replicant/", (req, res) => {
    req.accepts("application/json");
    for (const [key, value] of Object.entries(req.body) as [string, string][]) {
      logger.error(key, value);
      genericReplicant.value[key] = value;
    }
    res.send("OK!");
  });

  nodecg.mount(router);
}
