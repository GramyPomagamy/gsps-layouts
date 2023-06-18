import needle from 'needle';
import { NodeCGServer } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';

/** Code relating to the Featured Channels extension. */
export const featuredChannels = (nodecg: NodeCGServer) => {
  const featuredLog = new TaggedLogger('featured', nodecg);
  const config = nodecg.bundleConfig.twitchExt;

  async function updateFeatured(players: Array<string>) {
    const channels = players.join(',');
    try {
      const resp = await needle(
        'get',
        `https://api.furious.pro/featuredchannels/bot/${config.token}/${encodeURIComponent(
          channels
        )}`
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
};
