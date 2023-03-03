import { get as nodecg } from './util/nodecg';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import { TaggedLogger } from './util/tagged-logger';

const logger = new TaggedLogger('Stream Deck');
const config = (nodecg().bundleConfig as Configschema).sd;
const router = nodecg().Router();

if (config.enabled) {
  logger.debug('HTTP Endpointy dla Decka włączone');
  router.get('/sd/showNextPrize/:tier', (req, res) => {
    res.send('OK!');
    nodecg().sendMessage('showNextPrize', req.params['tier']);
    logger.debug(`Pokazuję następną nagrodę z tieru ${req.params['tier']}`);
  });

  router.get('/sd/hidePrizes', (req, res) => {
    res.send('OK!');
    nodecg().sendMessage('hidePrizes');
    logger.debug('Ukrywam nagrody');
  });

  router.get('/sd/showNextBid', (req, res) => {
    res.send('OK!');
    nodecg().sendMessage('showNextBid');
    logger.debug('Pokazuję następną licytację');
  });

  router.get('/sd/hideBids', (req, res) => {
    res.send('OK!');
    nodecg().sendMessage('hideBids');
    logger.debug('Ukrywam licytacje');
  });

  router.get('/sd/switchFromHostScreen', (req, res) => {
    res.send('OK!');
    nodecg().sendMessage('switchFromHostScreen');
    logger.debug('Zmieniam scenę na przerwę');
  });
}

nodecg().mount(router);
