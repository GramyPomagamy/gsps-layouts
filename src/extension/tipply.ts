import needle from 'needle';
import { formatDollars } from './util/format-dollars';
import { get } from './util/nodecg';
import { Total } from '../types/generated';

const nodecg = get();

const config = nodecg.bundleConfig.tipply;
const totalReplicant = nodecg.Replicant<Total>('total');

type TipplyApi = {
  config: {
    initial_value: number;
  };
  stats: {
    amount: number;
  };
};

async function getAmount() {
  const data: TipplyApi = (
    await needle('get', `https://tipply.pl/api/widget/goal/${config.goalID}`)
  ).body;

  const amount = data.config.initial_value / 100 + data.stats.amount / 100;

  totalReplicant.value = { raw: amount, formatted: formatDollars(amount) };
}

if (config.enabled && config.goalID) {
  getAmount();

  setInterval(getAmount, 5000);
}
