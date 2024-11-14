import needle from 'needle';
import { formatDollars } from './util/format-dollars';
import { get } from './util/nodecg';
import { Total } from '../types/generated';

const nodecg = get();

const config = nodecg.bundleConfig.tipply;
const totalReplicant = nodecg.Replicant<Total>('total');

const needleOptions = {
  headers: {"Accept": "application/json"},
}

async function getAmount() {
  let response;
  try {
    response = await needle('get', `https://tipply.pl/api/configuration/GOAL_VOTING/${config.goalID}`, needleOptions);
  } catch (error: any) {
    nodecg.log.warn('[Tipply] No data received: ' + error.message);
    return;
  }

  if (response.statusCode != 200) {
    nodecg.log.warn('[Tipply] HTTP status != 200: ' + JSON.stringify(response.headers) + ' ' + response.body);
    return;
  }

  let initial_values = 0;
  let amounts = 0;
  try {
    const goals = response.body.goals;
    goals.forEach((goal: any) => {
      initial_values += goal.goal.initial_value;
      amounts += goal.stats.amount;
    });

    const amount = initial_values / 100 + amounts / 100;

    totalReplicant.value = { raw: amount, formatted: formatDollars(amount) };
  }  catch (error: any) {
    nodecg.log.warn('[Tipply] Failed to process response: ' + error.message + ' ' + JSON.stringify(response.headers) + ' ' + response.body);
    return;
  }

}

if (config.enabled && config.goalID) {
  getAmount();

  setInterval(getAmount, 5000);
}
