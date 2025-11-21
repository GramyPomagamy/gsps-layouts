import request from "request";
import io from "socket.io-client";
import { type AutoUpdateTotal, type Total } from "src/types/generated";
import type { Donation } from "../types/custom";
import type { Configschema } from "../types/generated/configschema";
import { formatDollars } from "./util/format-dollars";
import { get } from "./util/nodecg";
import { TaggedLogger } from "./util/tagged-logger";

const nodecg = get();
const totalLog = new TaggedLogger("total");
const config = nodecg.bundleConfig.tracker;
const rootURL = config!.rootURL;
const eventID = config!.eventID;
const socketConfig = (nodecg.bundleConfig as Configschema).donationSocket;
const TOTAL_URL = `${rootURL}/${eventID}?json`;
const totalReplicant = nodecg.Replicant<Total>("total");
const autoUpdateTotalReplicant =
  nodecg.Replicant<AutoUpdateTotal>("autoUpdateTotal");

autoUpdateTotalReplicant.on("change", (newVal) => {
  if (newVal) {
    totalLog.info("Automatic updating of donation total enabled");
    manuallyUpdateTotal();
  } else {
    totalLog.warn("Automatic updating of donation total DISABLED");
  }
});

if (socketConfig.enabled) {
  const socket = io(socketConfig.url!);
  let loggedXhrPollError = false;

  socket.on("connect", () => {
    totalLog.info("Connected to donation socket", socketConfig.url!);
    loggedXhrPollError = false;
  });

  socket.on("connect_error", (err: { message: string }) => {
    if (err.message === "xhr poll error") {
      if (loggedXhrPollError) {
        return;
      }

      loggedXhrPollError = true;
    }

    totalLog.error("Donation socket connect_error:", err);
  });

  // Get initial data, then listen for donations.
  updateTotal().then(() => {
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
  });

  socket.on("disconnect", () => {
    totalLog.error(
      "Disconnected from donation socket, can not receive donations!",
    );
  });

  socket.on("error", (err: unknown) => {
    totalLog.error("Donation socket error:", err);
  });
} else {
  totalLog.warn(
    `cfg/${nodecg.bundleName}.json has the donation socket disabled.` +
      "\n\tThis means that we cannot receive new incoming PayPal donations from the tracker," +
      "\n\tand that donation notifications will not be displayed as a result. The total also will not update.",
  );
}

// Dashboard can invoke manual updates
nodecg.listenFor("updateTotal", () => manuallyUpdateTotal());

nodecg.listenFor("setTotal", ({ type, newValue }) => {
  if (type === "cash") {
    totalReplicant.value = {
      raw: parseFloat(newValue.toString()),
      formatted: formatDollars(newValue),
    };
  } else {
    totalLog.error('Unexpected "type" sent to setTotal: "%s"', type);
  }
});

/**
 * Handles manual "updateTotal" requests.
 * @returns {undefined}
 */
function manuallyUpdateTotal() {
  totalLog.info("Aktualizuje kwote");

  updateTotal()
    .then(() => {
      nodecg.sendMessage("total:manuallyUpdated", totalReplicant.value!);
    })
    .catch((error) => {
      totalLog.error("Błąd w ręczej aktualizacji zebranej kwoty: ", error);
    });
}

/**
 * Updates the "total" replicant with the latest value from the GDQ Tracker API.
 * @returns {Promise} - A promise.
 */
function updateTotal() {
  return new Promise((resolve, reject) => {
    request(TOTAL_URL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let stats;
        try {
          stats = JSON.parse(body);
        } catch (e) {
          totalLog.error(
            "Could not parse total, response not valid JSON:\n\t",
            body,
          );
          return;
        }

        const freshTotal = parseFloat(stats.agg.total_amount || 0);

        if (freshTotal === totalReplicant.value!.raw) {
          resolve(false);
        } else {
          totalReplicant.value = {
            raw: freshTotal,
            formatted: formatDollars(freshTotal),
          };
          resolve(true);
        }
      } else {
        let msg = "Could not get donation total, unknown error";
        if (error) {
          msg = `Could not get donation total:\n${error.message}`;
        } else if (response) {
          msg = `Could not get donation total, response code ${response.statusCode}`;
        }
        totalLog.error(msg);
        reject(msg);
      }
    });
  });
}

/**
 * Formats each donation coming in from the socket repeater, which in turn is receiving them
 * from a Postback URL on the tracker.
 * @param {Number} rawAmount - The numeric amount of the donation.
 * @param {Number} rawNewTotal - The new numeric donation total, including this donation.
 * @returns {{amount: String, rawAmount: Number, newTotal: String, rawNewTotal: Number}} - A formatted donation.
 */
function formatDonation(rawAmount: number, newTotal: number) {
  rawAmount = parseFloat(rawAmount.toString());
  const rawNewTotal = parseFloat(newTotal.toString());

  // Format amount
  let amount = formatDollars(rawAmount);

  // If a whole dollar, get rid of cents
  if (amount.endsWith(".00")) {
    amount = amount.substr(0, amount.length - 3);
  }

  return {
    amount,
    rawAmount,
    newTotal: formatDollars(rawNewTotal),
    rawNewTotal,
  };
}
