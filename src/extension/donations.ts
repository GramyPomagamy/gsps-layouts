import needle from 'needle';
import type { NeedleResponse } from 'needle';
import { get as nodecg } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';
import type { NodeCG } from 'nodecg/types/server';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import type { Tracker } from '@gsps-layouts/types';
import {
  donationsToReadReplicant,
  donationsToAcceptReplicant,
  bidsToAcceptReplicant,
} from './util/replicants';
import { updatePrizes } from './prizes';

const donationsLog = new TaggedLogger('donations');
const config = (nodecg().bundleConfig as Configschema).tracker;
const rootURL = config!.rootURL;
const eventID = config!.eventID;
const LOGIN_URL = `${rootURL}/admin/login/`;

let isFirstLogin = true;
let cookies: NeedleResponse['cookies'];
const refreshTime = 10 * 1000; // Odśwież donacje co 10 sekund.
let updateTimeout: NodeJS.Timeout;

async function loginToTracker(): Promise<void> {
  if (isFirstLogin) donationsLog.info(`Loguję się jako ${config!.username}`);
  else donationsLog.info(`Odświeżam sesję jako ${config!.username}`);

  try {
    const resp1 = await needle('get', LOGIN_URL);
    if (resp1.statusCode !== 200) {
      throw new Error('Brak dostępu do strony logowania trackera');
    }

    const resp2 = await needle(
      'post',
      LOGIN_URL,
      {
        username: config!.username,
        password: config!.password,
        csrfmiddlewaretoken: resp1.cookies
          ? resp1.cookies.csrftoken
          : undefined,
      },
      {
        cookies: resp1.cookies,
        headers: {
          referer: LOGIN_URL,
        },
      }
    );

    if (
      resp2.statusCode !== 302 ||
      (resp2.cookies && !resp2.cookies.tracker_session)
    ) {
      throw new Error(
        'Zalogowanie się nie powiodło, czy użytkownik/hasło są poprawne?'
      );
    }

    cookies = resp2.cookies;

    if (isFirstLogin) {
      isFirstLogin = false;
      donationsLog.info(`Zalogowano pomyślnie jako ${config!.username}`);
    } else {
      donationsLog.info(`Odświeżono sesję jako ${config!.username}`);
    }

    setTimeout(loginToTracker, 90 * 60 * 1000);
  } catch (err) {
    donationsLog.warn('Błąd przy logowaniu! ', err);
    if (!isFirstLogin) {
      setTimeout(loginToTracker, 60 * 1000);
    } else {
      throw new Error('Nie udało się zalogować do trackera.');
    }
  }
}

function processToReadDonations(
  donations: Tracker.Donation[]
): Tracker.FormattedDonation[] {
  return donations
    .map((donation) => ({
      id: donation.pk,
      name: donation.fields.donor__public,
      amount: parseFloat(donation.fields.amount),
      comment:
        donation.fields.commentstate === 'APPROVED'
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

async function updateToReadDonations() {
  clearTimeout(updateTimeout);
  nodecg().sendMessage('donationsToRead:updating');
  try {
    const resp = await needle(
      'get',
      `${rootURL}/search?event=${eventID}&type=donation&feed=toread`,
      { cookies: cookies }
    );
    const currentDonations = processToReadDonations(resp.body);
    const donationBids = await getDonationBids();
    for (let i = 0; i < currentDonations.length; i++) {
      const donationBid = donationBids
        .filter(
          (e: Tracker.DonationBid) =>
            e.fields.donation === currentDonations[i].id
        )
        .map((donation) => ({
          id: donation.fields.bid,
          amount: parseFloat(donation.fields.amount),
        }));
      let donation = currentDonations[i];

      donation.bid = donationBid;
    }
    donationsToReadReplicant.value = currentDonations;

    const donationsToAcceptResp = await needle(
      'get',
      `${rootURL}/search?event=${eventID}&type=donation&commentstate=PENDING`,
      { cookies: cookies }
    );
    donationsToAcceptReplicant.value = donationsToAcceptResp.body.length;

    const bidsToAcceptResp = await needle(
      'get',
      `${rootURL}/search?event=${eventID}&type=bidtarget&state=PENDING`,
      { cookies: cookies }
    );
    bidsToAcceptReplicant.value = bidsToAcceptResp.body.length;

    nodecg().sendMessage('donationsToRead:updated');
  } catch (err) {
    donationsLog.warn('Błąd przy aktualizowaniu donacji do przeczytania:', err);
    donationsToReadReplicant.value.length = 0; // Wyczyść dane na wszelki wypadek
    donationsToAcceptReplicant.value = 0;
    bidsToAcceptReplicant.value = 0;
    nodecg().sendMessage('donationsToRead:updated');
  }
  updateTimeout = setTimeout(updateToReadDonations, refreshTime);
}

async function getDonationBids(): Promise<Tracker.DonationBid[]> {
  try {
    const resp = await needle(
      'get',
      `${rootURL}/search?event=${config!.eventID}&type=donationbid`,
      {
        cookies: cookies,
      }
    );
    return resp.body;
  } catch (err) {
    donationsLog.warn(
      'Błąd przy aktualizowaniu licytacji na którę poszły donację:',
      err
    );
    return [];
  }
}

async function setDonationAsRead(id: number): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `${rootURL}/edit?type=donation&id=${id}` +
        '&readstate=READ&commentstate=APPROVED',
      {
        cookies: cookies,
      }
    );
    if (resp.statusCode === 200) {
      donationsLog.info(`Pomyślnie zaznaczono donację ${id} jako przeczytaną`);
    } else {
      throw new Error(`Status Code ${resp.statusCode}`);
    }
  } catch (err) {
    donationsLog.warn(
      `Błąd przy zaznaczaniu donacji ${id} jako przeczytaną: ${err}`
    );
  }
}

export function getCookies(): NeedleResponse['cookies'] {
  return cookies;
}

loginToTracker().then(() => {
  updateToReadDonations();
  updatePrizes();
});

nodecg().listenFor('updateDonations', updateToReadDonations);
nodecg().listenFor('setDonationAsRead', (id) => {
  setDonationAsRead(id);
});
