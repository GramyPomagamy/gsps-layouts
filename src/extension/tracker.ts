import {
  type Configschema,
  type DonationsToRead,
  type ReadDonations,
} from "@gsps-layouts/types";
import { type ModuleParams } from "./util/helpers";
import { TrackerApi } from "./util/tracker-api";

export async function setup({
  config,
  nodecg,
  logger,
}: ModuleParams<Configschema["tracker"]>): Promise<void> {
  if (
    !config.username ||
    !config.password ||
    typeof config.eventID === "undefined"
  ) {
    logger.error("Missing username, password or event ID!");
    return;
  }

  const donationsToReadReplicant =
    nodecg.Replicant<DonationsToRead>("donationsToRead");
  const donationsToAcceptReplicant =
    nodecg.Replicant<number>("donationsToAccept");
  const bidsToAcceptReplicant = nodecg.Replicant<number>("bidsToAccept");
  const readerAlertReplicant = nodecg.Replicant<boolean>("readerAlert");
  const readDonationsReplicant =
    nodecg.Replicant<ReadDonations>("readDonations");
  const currentEventTrackerId = nodecg.Replicant<number>(
    "currentEventTrackerId",
    {
      defaultValue: 0,
    },
  );

  const trackerApi = new TrackerApi({
    rootUrl: config.rootURL,
    eventId: config.eventID,
  });

  await trackerApi.login({
    username: config.username,
    password: config.password,
  });
}
