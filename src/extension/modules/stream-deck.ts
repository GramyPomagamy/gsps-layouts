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
        const { newIndex, prize } = selectPrizeFromTier(
          prizesReplicant.value!,
          tier,
          currentlyShownPrizeIndex.value!,
        );
        currentlyShownPrizeIndex.value = newIndex;
        currentlyShownPrize.value = prize;
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
        const { newIndex, prize } = selectPrizeFromTier(
          prizesReplicant.value!,
          tier,
          currentlyShownPrizeIndex.value!,
        );
        currentlyShownPrizeIndex.value = newIndex;
        currentlyShownPrize.value = prize;
      }
    }
    logger.debug(`Showing next prize from tier ${req.params.tier}`);
  });

  router.get("/sd/hidePrizes", (_req, res) => {
    res.send("OK!");
    currentlyShownPrize.value = undefined;
    showPrizePanel.value = false;
    logger.debug("Hiding prizes");
  });

  router.get("/sd/showNextBid", (_req, res) => {
    res.send("OK!");
    showPrizePanel.value = false;
    const { newIndex, showPanel, bid } = selectNextBid(
      currentBidsRep.value!,
      currentlyShownBidIndex.value!,
      showBidsPanel.value!,
    );
    currentlyShownBidIndex.value = newIndex;
    showBidsPanel.value = showPanel;
    currentlyShownBid.value = bid;
    logger.debug("Showing next bid");
  });

  router.get("/sd/hideBids", (_req, res) => {
    res.send("OK!");
    currentlyShownBid.value = undefined;
    showBidsPanel.value = false;
    logger.debug("Hiding bids");
  });

  router.get("/sd/switchFromHostScreen", (_req, res) => {
    res.send("OK!");
    nodecg.sendMessage("switchFromHostScreen");
    logger.debug("Switching to intermission scene");
  });

  nodecg.mount(router);
}
