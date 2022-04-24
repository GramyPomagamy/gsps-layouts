"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookies = void 0;
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("./util/nodecg");
const tagged_logger_1 = require("./util/tagged-logger");
const replicants_1 = require("./util/replicants");
const prizes_1 = require("./prizes");
const donationsLog = new tagged_logger_1.TaggedLogger('donations');
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const rootURL = config.rootURL;
const eventID = config.eventID;
const LOGIN_URL = `${rootURL}/admin/login/`;
let isFirstLogin = true;
let cookies;
const refreshTime = 10 * 1000; // Odśwież donacje co 10 sekund.
let updateTimeout;
function loginToTracker() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isFirstLogin)
            donationsLog.info(`Loguję się jako ${config.username}`);
        else
            donationsLog.info(`Odświeżam sesję jako ${config.username}`);
        try {
            const resp1 = yield (0, needle_1.default)('get', LOGIN_URL);
            if (resp1.statusCode !== 200) {
                throw new Error('Brak dostępu do strony logowania trackera');
            }
            const resp2 = yield (0, needle_1.default)('post', LOGIN_URL, {
                username: config.username,
                password: config.password,
                csrfmiddlewaretoken: resp1.cookies
                    ? resp1.cookies.csrftoken
                    : undefined,
            }, {
                cookies: resp1.cookies,
                headers: {
                    referer: LOGIN_URL,
                },
            });
            if (resp2.statusCode !== 302 ||
                (resp2.cookies && !resp2.cookies.tracker_session)) {
                throw new Error('Zalogowanie się nie powiodło, czy użytkownik/hasło są poprawne?');
            }
            cookies = resp2.cookies;
            if (isFirstLogin) {
                isFirstLogin = false;
                donationsLog.info(`Zalogowano pomyślnie jako ${config.username}`);
            }
            else {
                donationsLog.info(`Odświeżono sesję jako ${config.username}`);
            }
            setTimeout(loginToTracker, 90 * 60 * 1000);
        }
        catch (err) {
            donationsLog.warn('Błąd przy logowaniu! ', err);
            if (!isFirstLogin) {
                setTimeout(loginToTracker, 60 * 1000);
            }
            else {
                throw new Error('Nie udało się zalogować do trackera.');
            }
        }
    });
}
function processToReadDonations(donations) {
    return donations
        .map((donation) => ({
        id: donation.pk,
        name: donation.fields.donor__public,
        amount: parseFloat(donation.fields.amount),
        comment: donation.fields.commentstate === 'APPROVED'
            ? donation.fields.comment
            : undefined,
        timestamp: Date.parse(donation.fields.timereceived),
    }))
        .sort((a, b) => {
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        if (a.timestamp > b.timestamp) {
            return 1;
        }
        return 0;
    });
}
function updateToReadDonations() {
    return __awaiter(this, void 0, void 0, function* () {
        clearTimeout(updateTimeout);
        (0, nodecg_1.get)().sendMessage('donationsToRead:updating');
        try {
            const resp = yield (0, needle_1.default)('get', `${rootURL}/search?event=${eventID}&type=donation&feed=toread`, { cookies: cookies });
            const currentDonations = processToReadDonations(resp.body);
            const donationBids = yield getDonationBids();
            for (let i = 0; i < currentDonations.length; i++) {
                const donationBid = donationBids
                    .filter((e) => e.fields.donation === currentDonations[i].id)
                    .map((donation) => ({
                    id: donation.fields.bid,
                    amount: parseFloat(donation.fields.amount),
                }));
                let donation = currentDonations[i];
                donation.bid = donationBid;
            }
            replicants_1.donationsToReadReplicant.value = currentDonations;
            const donationsToAcceptResp = yield (0, needle_1.default)('get', `${rootURL}/search?event=${eventID}&type=donation&commentstate=PENDING`, { cookies: cookies });
            replicants_1.donationsToAcceptReplicant.value = donationsToAcceptResp.body.length;
            const bidsToAcceptResp = yield (0, needle_1.default)('get', `${rootURL}/search?event=${eventID}&type=bidtarget&state=PENDING`, { cookies: cookies });
            replicants_1.bidsToAcceptReplicant.value = bidsToAcceptResp.body.length;
            (0, nodecg_1.get)().sendMessage('donationsToRead:updated');
        }
        catch (err) {
            donationsLog.warn('Błąd przy aktualizowaniu donacji do przeczytania:', err);
            replicants_1.donationsToReadReplicant.value.length = 0; // Wyczyść dane na wszelki wypadek
            replicants_1.donationsToAcceptReplicant.value = 0;
            replicants_1.bidsToAcceptReplicant.value = 0;
            (0, nodecg_1.get)().sendMessage('donationsToRead:updated');
        }
        updateTimeout = setTimeout(updateToReadDonations, refreshTime);
    });
}
function getDonationBids() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield (0, needle_1.default)('get', `${rootURL}/search?event=${config.eventID}&type=donationbid`, {
                cookies: cookies,
            });
            return resp.body;
        }
        catch (err) {
            donationsLog.warn('Błąd przy aktualizowaniu licytacji na którę poszły donację:', err);
            return [];
        }
    });
}
function setDonationAsRead(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield (0, needle_1.default)('get', `${rootURL}/edit?type=donation&id=${id}` +
                '&readstate=READ&commentstate=APPROVED', {
                cookies: cookies,
            });
            if (resp.statusCode === 200) {
                donationsLog.info(`Pomyślnie zaznaczono donację ${id} jako przeczytaną`);
            }
            else {
                throw new Error(`Status Code ${resp.statusCode}`);
            }
        }
        catch (err) {
            donationsLog.warn(`Błąd przy zaznaczaniu donacji ${id} jako przeczytaną: ${err}`);
        }
    });
}
function getCookies() {
    return cookies;
}
exports.getCookies = getCookies;
loginToTracker().then(() => {
    updateToReadDonations();
    (0, prizes_1.updatePrizes)();
});
(0, nodecg_1.get)().listenFor('updateDonations', updateToReadDonations);
(0, nodecg_1.get)().listenFor('setDonationAsRead', (id) => {
    setDonationAsRead(id);
});
