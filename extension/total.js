"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const request_1 = __importDefault(require("request"));
const format_dollars_1 = require("./util/format-dollars");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const tagged_logger_1 = require("./util/tagged-logger");
const totalLog = new tagged_logger_1.TaggedLogger('total');
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const rootURL = config.rootURL;
const eventID = config.eventID;
const donationSocketUrl = (0, nodecg_1.get)().bundleConfig
    .donationSocketUrl;
const TOTAL_URL = `${rootURL}/${eventID}?json`;
replicants_1.autoUpdateTotalReplicant.on('change', (newVal) => {
    if (newVal) {
        totalLog.info('Automatic updating of donation total enabled');
        manuallyUpdateTotal(true);
    }
    else {
        totalLog.warn('Automatic updating of donation total DISABLED');
    }
});
if (donationSocketUrl) {
    const socket = (0, socket_io_client_1.default)(donationSocketUrl);
    let loggedXhrPollError = false;
    socket.on('connect', () => {
        totalLog.info('Connected to donation socket', donationSocketUrl);
        loggedXhrPollError = false;
    });
    socket.on('connect_error', (err) => {
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
        socket.on('donation', (data) => {
            if (!data || !data.rawAmount) {
                return;
            }
            const donation = formatDonation(data.rawAmount, data.newTotal);
            (0, nodecg_1.get)().sendMessage('donation', donation);
            if (replicants_1.autoUpdateTotalReplicant.value) {
                replicants_1.totalReplicant.value = {
                    raw: donation.rawNewTotal,
                    formatted: donation.newTotal,
                };
            }
        });
    });
    socket.on('disconnect', () => {
        totalLog.error('Disconnected from donation socket, can not receive donations!');
    });
    socket.on('error', (err) => {
        totalLog.error('Donation socket error:', err);
    });
}
else {
    totalLog.warn(`cfg/${(0, nodecg_1.get)().bundleName}.json is missing the "donationSocketUrl" property.` +
        '\n\tThis means that we cannot receive new incoming PayPal donations from the tracker,' +
        '\n\tand that donation notifications will not be displayed as a result. The total also will not update.');
}
// Dashboard can invoke manual updates
(0, nodecg_1.get)().listenFor('updateTotal', () => manuallyUpdateTotal());
(0, nodecg_1.get)().listenFor('setTotal', ({ type, newValue }) => {
    if (type === 'cash') {
        replicants_1.totalReplicant.value = {
            raw: parseFloat(newValue),
            formatted: (0, format_dollars_1.formatDollars)(newValue, { cents: false }),
        };
    }
    else {
        totalLog.error('Unexpected "type" sent to setTotal: "%s"', type);
    }
});
/**
 * Handles manual "updateTotal" requests.
 * @param {Boolean} [silent = false] - Whether to print info to logs or not.
 * @param {Function} [cb] - The callback to invoke after the total has been updated.
 * @returns {undefined}
 */
function manuallyUpdateTotal(silent = false, cb = function (error, updated) { }) {
    totalLog.info('Aktualizuje kwote');
    updateTotal()
        .then((updated) => {
        if (updated) {
            (0, nodecg_1.get)().sendMessage('total:manuallyUpdated', replicants_1.totalReplicant.value);
        }
        else {
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
        (0, request_1.default)(TOTAL_URL, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let stats;
                try {
                    stats = JSON.parse(body);
                }
                catch (e) {
                    totalLog.error('Could not parse total, response not valid JSON:\n\t', body);
                    return;
                }
                const freshTotal = parseFloat(stats.agg.amount || 0);
                if (freshTotal === replicants_1.totalReplicant.value.raw) {
                    resolve(false);
                }
                else {
                    replicants_1.totalReplicant.value = {
                        raw: freshTotal,
                        formatted: (0, format_dollars_1.formatDollars)(freshTotal, { cents: false }),
                    };
                    resolve(true);
                }
            }
            else {
                let msg = 'Could not get donation total, unknown error';
                if (error) {
                    msg = `Could not get donation total:\n${error.message}`;
                }
                else if (response) {
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
function formatDonation(rawAmount, newTotal) {
    rawAmount = parseFloat(rawAmount.toString());
    const rawNewTotal = parseFloat(newTotal.toString());
    // Format amount
    let amount = (0, format_dollars_1.formatDollars)(rawAmount);
    // If a whole dollar, get rid of cents
    if (amount.endsWith('.00')) {
        amount = amount.substr(0, amount.length - 3);
    }
    return {
        amount,
        rawAmount,
        newTotal: (0, format_dollars_1.formatDollars)(rawNewTotal, { cents: false }),
        rawNewTotal,
    };
}
