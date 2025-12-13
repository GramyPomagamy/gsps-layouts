import {
  type Bid,
  type Bids,
  type Configschema,
  type ModuleParams,
  type Prize,
} from "@gsps-layouts/types";
import { selectNextBid, selectPrizeFromTier } from "../util/helpers";

export async function setup({
  nodecg,
  logger,
}: ModuleParams<Configschema["sd"]>): Promise<void> {
  const router = nodecg.Router();
  let currentPrizeTier = 10;

  const prizesReplicant = nodecg.Replicant<Prize[]>("prizes");
  const currentBidsRep = nodecg.Replicant<Bids>("currentBids");
  const currentlyShownBidIndex = nodecg.Replicant<number>(
    "currentlyShownBidIndex",
  );
  const currentlyShownPrizeIndex = nodecg.Replicant<number>(
    "currentlyShownPrizeIndex",
  );
  const showBidsPanel = nodecg.Replicant<boolean>("showBidsPanel");
  const showPrizePanel = nodecg.Replicant<boolean>("showPrizePanel");
  const currentlyShownBid = nodecg.Replicant<Bid>("currentlyShownBid");
  const currentlyShownPrize = nodecg.Replicant<Prize>("currentlyShownPrize");

  router.get("/sd/showNextPrize/:tier", (req, res) => {
    res.send("OK!");
    showBidsPanel.value = false;
    if (prizesReplicant.value!.length > 0) {
      const tier = parseInt(req.params.tier);
      // If prize panel is disabled, enable it
      if (!showPrizePanel.value) {
        currentPrizeTier = tier;
        const result = selectPrizeFromTier(
          prizesReplicant.value!,
          tier,
          currentlyShownPrizeIndex.value!,
        );
        currentlyShownPrizeIndex.value = result.newIndex;
        currentlyShownPrize.value = result.prize;
        showPrizePanel.value = true;
      } else {
        // If different tier, start from the beginning
        if (tier !== currentPrizeTier) {
          currentPrizeTier = tier;
          currentlyShownPrizeIndex.value = 0;
        } else {
          currentlyShownPrizeIndex.value!++;
          currentPrizeTier = tier;
        }
        showPrizePanel.value = true;
        const result = selectPrizeFromTier(
          prizesReplicant.value!,
          tier,
          currentlyShownPrizeIndex.value!,
        );
        currentlyShownPrizeIndex.value = result.newIndex;
        currentlyShownPrize.value = result.prize;
      }
    }
    logger.debug(`Pokazuję następną nagrodę z tieru ${req.params.tier}`);
  });

  router.get("/sd/hidePrizes", (_req, res) => {
    res.send("OK!");
    currentlyShownPrize.value = undefined;
    showPrizePanel.value = false;
    logger.debug("Ukrywam nagrody");
  });

  router.get("/sd/showNextBid", (_req, res) => {
    res.send("OK!");
    showPrizePanel.value = false;
    const result = selectNextBid(
      currentBidsRep.value!,
      currentlyShownBidIndex.value!,
      showBidsPanel.value!,
    );
    currentlyShownBidIndex.value = result.newIndex;
    showBidsPanel.value = result.showPanel;
    currentlyShownBid.value = result.bid;
    logger.debug("Pokazuję następną licytację");
  });

  router.get("/sd/hideBids", (_req, res) => {
    res.send("OK!");
    currentlyShownBid.value = undefined;
    showBidsPanel.value = false;
    logger.debug("Ukrywam licytacje");
  });

  router.get("/sd/switchFromHostScreen", (_req, res) => {
    res.send("OK!");
    nodecg.sendMessage("switchFromHostScreen");
    logger.debug("Zmieniam scenę na przerwę");
  });

  nodecg.mount(router);
}
