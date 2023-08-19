import needle from 'needle';
import { get } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';

const nodecg = get();
const featuredLog = new TaggedLogger('featured');
const config = nodecg.bundleConfig.twitchExt;

async function updateFeatured(players: Array<string>) {
  const channels = players.join(',');
  try {
    const resp = await needle(
      'get',
      `https://api.furious.pro/featuredchannels/bot/${config.token}/${encodeURIComponent(channels)}`
    );

    if (resp.statusCode === 200) {
      featuredLog.info(
        `Pomyślnie zaktualizowano panel z runnerami pod streamem z kanałami ${channels}`
      );
    } else {
      throw new Error(`Status Code ${resp.statusCode}`);
    }
  } catch (err) {
    featuredLog.warn('Błąd przy aktualizowaniu panelu z runnerami pod streamem: ', err);
  }
}

nodecg.listenFor('repeaterFeaturedChannels', 'nodecg-speedcontrol', (names) => {
  if (config.enabled) {
    updateFeatured(names);
  }
});
