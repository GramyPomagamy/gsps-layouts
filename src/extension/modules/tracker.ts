import {
  type AutoUpdateTotal,
  type Bids,
  type Configschema,
  type Donation,
  type DonationsToRead,
  type ModuleParams,
  type Prizes,
  type ReadDonations,
  type Total,
} from "@gsps-layouts/types";
import deepEqual from "deep-equal";
import io from "socket.io-client";
import { TrackerApi } from "../util/tracker-api";

const bidsPollInterval = 20 * 1000;
const donationsPollInterval = 10 * 1000;
const prizesPollInterval = 60 * 1000;

export async function setup({
  config,
  nodecg,
  logger,
}: ModuleParams<{
  socketConfig: Configschema["donationSocket"];
  trackerConfig: Configschema["tracker"];
}>): Promise<void> {
  const { trackerConfig, socketConfig } = config;

  if (
    !trackerConfig.username ||
    !trackerConfig.password ||
    typeof trackerConfig.eventID === "undefined"
  ) {
    logger.error("Missing username, password or event ID!");
    return;
  }

  // === Replicants ===
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
    { defaultValue: 0 },
  );

  const currentBidsReplicant = nodecg.Replicant<Bids>("currentBids");
  const allBidsReplicant = nodecg.Replicant<Bids>("allBids");

  const prizesReplicant = nodecg.Replicant<Prizes>("prizes");

  const totalReplicant = nodecg.Replicant<Total>("total");
  const autoUpdateTotalReplicant =
    nodecg.Replicant<AutoUpdateTotal>("autoUpdateTotal");

  const tracker = new TrackerApi({
    rootUrl: trackerConfig.rootURL,
    eventId: trackerConfig.eventID,
  });

  await tracker.login({
    username: trackerConfig.username,
    password: trackerConfig.password,
  });

  const updateDonationsToRead = async () => {
    nodecg.sendMessage("donationsToRead:updating");
    try {
      const donationsToRead = await tracker.getDonationsToRead();
      donationsToReadReplicant.value = donationsToRead;
    } catch (err) {
      logger.error("Error updating donations to read:", err);
      donationsToReadReplicant.value = [];
    }
    nodecg.sendMessage("donationsToRead:updated");
  };

  const updateDonationsToAcceptCount = async () => {
    try {
      const donationsToAcceptCount = await tracker.getDonationsToAcceptCount();
      donationsToAcceptReplicant.value = donationsToAcceptCount;
    } catch (err) {
      logger.error("Error updating donations to accept count:", err);
      donationsToAcceptReplicant.value = 0;
    }
  };

  const updateBidsToAcceptCount = async () => {
    try {
      const bidsToAcceptCount = await tracker.getBidsToAcceptCount();
      bidsToAcceptReplicant.value = bidsToAcceptCount;
    } catch (err) {
      logger.error("Error updating bids to accept count:", err);
      bidsToAcceptReplicant.value = 0;
    }
  };

  const setDonationAsRead = async (
    id: number,
    name: string,
    amount: number,
  ) => {
    if (readDonationsReplicant.value) {
      const alreadyExists = readDonationsReplicant.value.some(
        (donation) => donation.id === id,
      );
      if (!alreadyExists) {
        readDonationsReplicant.value.unshift({ id, name, amount });
      }
    } else {
      readDonationsReplicant.value = [{ id, name, amount }];
    }

    try {
      await tracker.markDonationAsRead(id);
      logger.info(`Successfully marked donation ${id} as read`);
    } catch (err) {
      logger.error(`Error marking donation ${id} as read:`, err);
    }
  };

  const getRecentlyReadDonations = async () => {
    try {
      const recentlyRead = await tracker.getRecentlyReadDonations();
      readDonationsReplicant.value = recentlyRead;
    } catch (err) {
      logger.error("Error getting recently read donations:", err);
    }
  };

  const updateBids = async () => {
    nodecg.sendMessage("bids:updating");
    try {
      const { allBids, currentBids } = await tracker.getBids();

      if (!deepEqual(allBidsReplicant.value, allBids)) {
        allBidsReplicant.value = allBids;
      }

      if (!deepEqual(currentBidsReplicant.value, currentBids)) {
        currentBidsReplicant.value = currentBids;
      }
    } catch (err) {
      logger.error("Error updating bids:", err);
    }
    nodecg.sendMessage("bids:updated");
  };

  const updatePrizes = async () => {
    try {
      const prizes = await tracker.getPrizes();
      prizesReplicant.value = prizes;
    } catch (err) {
      logger.error("Error updating prizes:", err);
      prizesReplicant.value = [];
    }
  };

  const updateTotal = async (): Promise<boolean> => {
    try {
      const freshTotal = await tracker.getTotal();

      if (freshTotal.raw === totalReplicant.value?.raw) {
        return false;
      }

      totalReplicant.value = {
        raw: freshTotal.raw,
        formatted: freshTotal.formatted,
      };
      return true;
    } catch (err) {
      logger.error("Error updating total:", err);
      return false;
    }
  };

  const manuallyUpdateTotal = async () => {
    logger.info("Manually updating total");
    try {
      await updateTotal();
      nodecg.sendMessage("total:manuallyUpdated", totalReplicant.value);
    } catch (err) {
      logger.error("Error in manual total update:", err);
    }
  };

  const formatDonation = (rawAmount: number, newTotal: number) => {
    const parsedAmount = parseFloat(rawAmount.toString());
    const parsedNewTotal = parseFloat(newTotal.toString());

    let amount = `${parsedAmount.toFixed(2)} zł`;
    if (amount.endsWith(".00 zł")) {
      amount = `${parsedAmount.toFixed(0)} zł`;
    }

    return {
      amount,
      rawAmount: parsedAmount,
      newTotal: `${parsedNewTotal.toFixed(2)} zł`,
      rawNewTotal: parsedNewTotal,
    };
  };
  if (trackerConfig.eventID !== currentEventTrackerId.value) {
    currentEventTrackerId.value = trackerConfig.eventID;
    readDonationsReplicant.value = [];
    await getRecentlyReadDonations();
  }

  await Promise.all([
    updateDonationsToRead(),
    updateDonationsToAcceptCount(),
    updateBidsToAcceptCount(),
    updateBids(),
    updatePrizes(),
    updateTotal(),
  ]);

  setInterval(() => {
    updateDonationsToRead().catch((err) => logger.error(err));
    updateDonationsToAcceptCount().catch((err) => logger.error(err));
    updateBidsToAcceptCount().catch((err) => logger.error(err));
  }, donationsPollInterval);

  setInterval(() => {
    updateBids().catch((err) => logger.error(err));
  }, bidsPollInterval);

  setInterval(() => {
    updatePrizes().catch((err) => logger.error(err));
  }, prizesPollInterval);

  if (trackerConfig.updateRecentlyReadDonationsFromTracker) {
    setInterval(() => {
      getRecentlyReadDonations().catch((err) => logger.error(err));
    }, donationsPollInterval);
  }

  nodecg.listenFor("updateDonations", () => void updateDonationsToRead());
  nodecg.listenFor(
    "setDonationAsRead",
    ({ id, name, amount }: { amount: number; id: number; name: string }) => {
      readerAlertReplicant.value = false;
      setDonationAsRead(id, name, amount).catch((err) => logger.error(err));
    },
  );
  nodecg.listenFor("updateBids", () => void updateBids());
  nodecg.listenFor("updateTotal", () => void manuallyUpdateTotal());
  nodecg.listenFor(
    "setTotal",
    ({ type, newValue }: { newValue: number; type: string }) => {
      if (type === "cash") {
        totalReplicant.value = {
          raw: parseFloat(newValue.toString()),
          formatted: `${parseFloat(newValue.toString()).toFixed(2)} zł`,
        };
      } else {
        logger.error(`Unexpected "type" sent to setTotal: "${type}"`);
      }
    },
  );

  autoUpdateTotalReplicant.on("change", (newVal) => {
    if (newVal) {
      logger.info("Automatic updating of donation total enabled");
      manuallyUpdateTotal().catch((err) => logger.error(err));
    } else {
      logger.warn("Automatic updating of donation total DISABLED");
    }
  });

  if (socketConfig.enabled && socketConfig.url) {
    const socket = io(socketConfig.url) as ReturnType<typeof io>;
    let loggedXhrPollError = false;

    socket.on("connect", () => {
      logger.info(`Connected to donation socket: ${socketConfig.url}`);
      loggedXhrPollError = false;
    });

    socket.on("connect_error", (err: { message: string }) => {
      if (err.message === "xhr poll error") {
        if (loggedXhrPollError) {
          return;
        }
        loggedXhrPollError = true;
      }
      logger.error("Donation socket connect_error:", err);
    });

    socket.on("donation", (data: Donation) => {
      if (!data || !data.rawAmount) {
        return;
      }

      const donation = formatDonation(data.rawAmount, data.newTotal);

      if (autoUpdateTotalReplicant.value) {
        totalReplicant.value = {
          raw: donation.rawNewTotal,
          formatted: donation.newTotal,
        };
      }
    });

    socket.on("disconnect", () => {
      logger.error(
        "Disconnected from donation socket, cannot receive donations!",
      );
    });

    socket.on("error", (err: unknown) => {
      logger.error("Donation socket error:", err);
    });
  } else {
    logger.warn(
      "Donation socket is disabled or URL not configured.\n" +
        "\tThis means that we cannot receive new incoming PayPal donations from the tracker,\n" +
        "\tand that donation notifications will not be displayed as a result. The total also will not update in real-time.",
    );
  }
}
