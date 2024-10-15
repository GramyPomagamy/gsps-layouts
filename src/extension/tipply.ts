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
  const response = await needle('get', `https://tipply.pl/api/widget/goal/${config.goalID}`);

  if (response.statusCode != 200) {
    const amount = 0;
    totalReplicant.value = { raw: amount, formatted: formatDollars(amount) };
    nodecg.log.warn('[Tipply] No data received, writing empty numbers');
    return;
  }

  const data: TipplyApi = response.body;

  const amount = data.config?.initial_value ?? 0 / 100 + data.stats?.amount ?? 0 / 100;

  totalReplicant.value = { raw: amount, formatted: formatDollars(amount) };
}

if (config.enabled && config.goalID) {
  getAmount();

  setInterval(getAmount, 5000);
}
