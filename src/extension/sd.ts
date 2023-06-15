import { BundleNodecgInstance } from './util/nodecg';
import NodeCG from '@nodecg/types';
import { TaggedLogger } from './util/tagged-logger';
import { Bid, Prize } from '../types/custom';
import { klona } from 'klona/json';

/** Code relating to the Stream Deck integration. */
export const streamDeck = (nodecg: BundleNodecgInstance) => {
  const prizesReplicant = nodecg.Replicant('prizes');
  const currentBidsRep = nodecg.Replicant('currentBids');
  const currentlyShownBidIndex = nodecg.Replicant('currentlyShownBidIndex');
  const currentlyShownPrizeIndex = nodecg.Replicant('currentlyShownPrizeIndex');
  const showBidsPanel = nodecg.Replicant('showBidsPanel');
  const showPrizePanel = nodecg.Replicant('showPrizePanel');
  const currentlyShownBid = nodecg.Replicant('currentlyShownBid');
  const currentlyShownPrize = nodecg.Replicant('currentlyShownPrize');

  const logger = new TaggedLogger('Stream Deck', nodecg);
  const config = nodecg.bundleConfig.sd;
  const router = (nodecg as unknown as NodeCG.ServerAPI).Router();
  let currentPrizeTier = 10;

  if (config.enabled) {
    logger.debug('HTTP Endpointy dla Decka włączone');
    router.get('/sd/showNextPrize/:tier', (req, res) => {
      res.send('OK!');
      showBidsPanel.value = false;
      if (prizesReplicant.value!.length > 0) {
        // If prize panel is disabled, enable it and start from the beginning of current tier
        if (!showPrizePanel.value) {
          currentlyShownPrizeIndex.value = 0;
          currentPrizeTier = parseInt(req.params['tier']);
          const prizeToShow = getPrize(parseInt(req.params['tier']));
          currentlyShownPrize.value = prizeToShow;
          showPrizePanel.value = true;
        } else {
          // If different tier, start from the beginning
          if (parseInt(req.params['tier']) != currentPrizeTier) {
            currentPrizeTier = parseInt(req.params['tier']);
            currentlyShownPrizeIndex.value = 0;
          } else {
            currentlyShownPrizeIndex.value!++;
            currentPrizeTier = parseInt(req.params['tier']);
          }
          showPrizePanel.value = true;
          const prizeToShow = getPrize(parseInt(req.params['tier']));
          currentlyShownPrize.value = prizeToShow;
        }
      }
      logger.debug(`Pokazuję następną nagrodę z tieru ${req.params['tier']}`);
    });

    router.get('/sd/hidePrizes', (_req, res) => {
      res.send('OK!');
      currentlyShownPrize.value = null;
      showPrizePanel.value = false;
      logger.debug('Ukrywam nagrody');
    });

    router.get('/sd/showNextBid', (_req, res) => {
      res.send('OK!');
      showPrizePanel.value = false;
      currentlyShownBid.value = getBid();
      logger.debug('Pokazuję następną licytację');
    });

    router.get('/sd/hideBids', (_req, res) => {
      res.send('OK!');
      currentlyShownBid.value = null;
      showBidsPanel.value = false;
      logger.debug('Ukrywam licytacje');
    });

    router.get('/sd/switchFromHostScreen', (_req, res) => {
      res.send('OK!');
      nodecg.sendMessage('switchFromHostScreen');
      logger.debug('Zmieniam scenę na przerwę');
    });
  }

  function getPrize(tier: number): Prize | null {
    const cloned = klona(prizesReplicant.value!);
    const prizesInTier = cloned.filter((prize) => prize.minimumBid == tier);
    if (currentlyShownPrizeIndex.value! + 1 > prizesInTier.length) {
      currentlyShownPrizeIndex.value = 0;
    }
    const selectedPrize = prizesInTier[currentlyShownPrizeIndex.value!];
    return selectedPrize!;
  }

  function getBid(): Bid | null {
    if (currentBidsRep.value!.length > 0) {
      const currentBids = klona(currentBidsRep.value!);
      // If bid panel is disabled, enable it and set it to show first bid in the list
      if (!showBidsPanel.value) {
        showBidsPanel.value = true;
        currentlyShownBidIndex.value = 0;
        return currentBids[0]!;
      } else {
        currentlyShownBidIndex.value!++;
        if (currentlyShownBidIndex.value! + 1 > currentBidsRep.value!.length) {
          currentlyShownBidIndex.value = 0;
        }
        return currentBids[currentlyShownBidIndex.value!]!;
      }
    } else {
      showBidsPanel.value = false;
      return null;
    }
  }

  (nodecg as unknown as NodeCG.ServerAPI).mount(router);
};
