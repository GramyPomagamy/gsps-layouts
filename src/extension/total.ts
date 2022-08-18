import type { Donation } from '@gsps-layouts/types';
import { get as nodecg } from './util/nodecg';
import { totalReplicant, autoUpdateTotalReplicant } from './util/replicants';
import request from 'request';
import { formatDollars } from './util/format-dollars';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import io from 'socket.io-client';
import { TaggedLogger } from './util/tagged-logger';

const totalLog = new TaggedLogger('total');
const config = (nodecg().bundleConfig as Configschema).tracker;
const rootURL = config!.rootURL;
const eventID = config!.eventID;
const donationSocketUrl = (nodecg().bundleConfig as Configschema)
  .donationSocketUrl;
const TOTAL_URL = `${rootURL}/${eventID}?json`;

autoUpdateTotalReplicant.on('change', (newVal) => {
  if (newVal) {
    totalLog.info('Automatic updating of donation total enabled');
    manuallyUpdateTotal(true);
  } else {
    totalLog.warn('Automatic updating of donation total DISABLED');
  }
});

if (donationSocketUrl) {
  const socket = io(donationSocketUrl);
  let loggedXhrPollError = false;

  socket.on('connect', () => {
    totalLog.info('Connected to donation socket', donationSocketUrl);
    loggedXhrPollError = false;
  });

  socket.on('connect_error', (err: { message: string }) => {
    if (err.message === 'xhr poll error') {
      if (loggedXhrPollError) {
        return;
      }

      loggedXhrPollError = true;
    }

    totalLog.error('Donation socket connect_error:', err);
  });

  // Get initial data, then listen for donations.
  updateTotal().then(() => {
    socket.on('donation', (data: Donation) => {
      if (!data || !data.rawAmount) {
        return;
      }

      const donation = formatDonation(data.rawAmount, data.newTotal);
      nodecg().sendMessage('donation', donation);

      if (autoUpdateTotalReplicant.value) {
        totalReplicant.value = {
          raw: donation.rawNewTotal,
          formatted: donation.newTotal,
        };
      }
    });
  });

  socket.on('disconnect', () => {
    totalLog.error(
      'Disconnected from donation socket, can not receive donations!'
    );
  });

  socket.on('error', (err: any) => {
    totalLog.error('Donation socket error:', err);
  });
} else {
  totalLog.warn(
    `cfg/${
      nodecg().bundleName
    }.json is missing the "donationSocketUrl" property.` +
      '\n\tThis means that we cannot receive new incoming PayPal donations from the tracker,' +
      '\n\tand that donation notifications will not be displayed as a result. The total also will not update.'
  );
}

// Dashboard can invoke manual updates
nodecg().listenFor('updateTotal', () => manuallyUpdateTotal());

nodecg().listenFor('setTotal', ({ type, newValue }) => {
  if (type === 'cash') {
    totalReplicant.value = {
      raw: parseFloat(newValue),
      formatted: formatDollars(newValue, { cents: false }),
    };
  } else {
    totalLog.error('Unexpected "type" sent to setTotal: "%s"', type);
  }
});

/**
 * Handles manual "updateTotal" requests.
 * @param {Boolean} [silent = false] - Whether to print info to logs or not.
 * @param {Function} [cb] - The callback to invoke after the total has been updated.
 * @returns {undefined}
 */
function manuallyUpdateTotal(
  silent: boolean = false,
  cb = function (error?: any, updated?: any) {}
) {
  totalLog.info('Aktualizuje kwote');

  updateTotal()
    .then((updated) => {
      if (updated) {
        nodecg().sendMessage('total:manuallyUpdated', totalReplicant.value);
      } else {
      }

      cb(null, updated);
    })
    .catch((error) => {
      cb(error);
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
            'Could not parse total, response not valid JSON:\n\t',
            body
          );
          return;
        }

        const freshTotal = parseFloat(stats.agg.amount || 0);

        if (freshTotal === totalReplicant.value.raw) {
          resolve(false);
        } else {
          totalReplicant.value = {
            raw: freshTotal,
            formatted: formatDollars(freshTotal, { cents: false }),
          };
          resolve(true);
        }
      } else {
        let msg = 'Could not get donation total, unknown error';
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
  if (amount.endsWith('.00')) {
    amount = amount.substr(0, amount.length - 3);
  }

  return {
    amount,
    rawAmount,
    newTotal: formatDollars(rawNewTotal, { cents: false }),
    rawNewTotal,
  };
}
