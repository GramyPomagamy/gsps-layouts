import needle from 'needle';
import { prizesReplicant } from './util/replicants';
import { get as nodecg } from './util/nodecg';
import type { NodeCG } from 'nodecg/types/server';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import { Tracker } from '@gsps-layouts/types';
import { getCookies } from './donations';

const refreshTime = 60 * 1000; // Odśwież nagrody co 60s.
const config = (nodecg().bundleConfig as Configschema).tracker;
const rootURL = config!.rootURL;
const prizesLog = new (nodecg() as NodeCG).Logger(
  `${nodecg().bundleName}:nagrody`
);

function processRawPrizes(
  rawPrizes: Tracker.Prize[]
): Tracker.FormattedPrize[] {
  return Array.from(rawPrizes)
    .filter((prize) => prize.fields.state === 'ACCEPTED')
    .map((prize) => {
      const startTime =
        prize.fields.startrun__starttime || prize.fields.starttime;
      const endTime = prize.fields.endrun__endtime || prize.fields.endtime;
      return {
        id: prize.pk,
        name: prize.fields.name,
        provided: prize.fields.provider || undefined,
        minimumBid: parseFloat(prize.fields.minimumbid),
        image: prize.fields.image || undefined,
        startTime: startTime ? Date.parse(startTime) : undefined,
        endTime: endTime ? Date.parse(endTime) : undefined,
      };
    });
}

export async function updatePrizes(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `${rootURL}/search?event=${config!.eventID}&type=prize`,
      {
        cookies: getCookies(),
      }
    );
    const currentPrizes = processRawPrizes(resp.body);
    prizesReplicant.value = currentPrizes;
  } catch (err) {
    prizesLog.warn('Błąd przy otrzymywaniu nagród:', err);
    prizesReplicant.value.length = 0; // Wyczyść dane na wszelki wypadek
  }
  setTimeout(updatePrizes, refreshTime);
}
