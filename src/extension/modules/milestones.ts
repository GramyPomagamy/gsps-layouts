import {
  type Configschema,
  type Milestones as MilestonesType,
  type ModuleParams,
} from "@gsps-layouts/types";
import { Milestones } from "../util/milestones";

const MILESTONE_REFRESH_INTERVAL = 60 * 1000;

export async function setup({
  nodecg,
  config,
  logger,
}: ModuleParams<Configschema["milestones"]>) {
  if (!config.url) {
    throw new Error("Milestones API endpoint URL is missing!");
  }

  const milestonesReplicant = nodecg.Replicant<MilestonesType>("milestones");

  const milestones = new Milestones(config.url);

  const updateMilestones = async () => {
    const milestonesData = await milestones.getMilestones();
    milestonesReplicant.value = milestonesData;
  };

  await updateMilestones();

  setInterval(() => {
    updateMilestones().catch((err) => logger.error(err));
  }, MILESTONE_REFRESH_INTERVAL);

  nodecg.listenFor("updateMilestones", () => updateMilestones);
}
