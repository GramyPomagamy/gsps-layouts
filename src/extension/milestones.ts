import { get as nodecg } from './util/nodecg';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import { Milestones } from '@gsps-layouts/types';
import type { RawMilestone } from '@gsps-layouts/types';
import type { NodeCG } from 'nodecg/types/server';
import needle from 'needle';
import { milestonesReplicant } from './util/replicants';

const URL = (nodecg().bundleConfig as Configschema).milestonesUrl;
const log = new (nodecg() as NodeCG).Logger(
  `${nodecg().bundleName}:milestones`
);

async function updateMilestones() {
  try {
    const raw = await needle('get', URL);
    const milestones = processMilestones(raw.body);
    milestonesReplicant.value = milestones;
  } catch (err) {
    log.error(`Błąd przy pobieraniu milestonów: ${err}`);
  }
}

function processMilestones(milestones: RawMilestone[]): Milestones {
  const sorted = milestones
    .sort((a: RawMilestone, b: RawMilestone) => {
      return a.Kwota - b.Kwota;
    })
    .map((milestone) => ({
      name: milestone.Nazwa,
      amount: milestone.Kwota,
    }));
  return sorted;
}

updateMilestones();

setInterval(updateMilestones, 60 * 1000);