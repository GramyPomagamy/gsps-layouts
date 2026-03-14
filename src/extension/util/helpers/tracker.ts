/**
 * Selects the next prize from a given tier.
 * Returns the prize at the current index (wrapping if needed) and the adjusted index.
 * @param prizes - Array of all prizes.
 * @param tier - The minimum bid tier to filter by.
 * @param currentIndex - The current index within the filtered prizes.
 */
export function selectPrizeFromTier<T extends { minimumBid: number }>(
  prizes: T[],
  tier: number,
  currentIndex: number,
): { newIndex: number; prize: T | undefined } {
  const prizesInTier = prizes.filter((prize) => prize.minimumBid === tier);
  if (prizesInTier.length === 0) {
    return { prize: undefined, newIndex: 0 };
  }
  const adjustedIndex = currentIndex >= prizesInTier.length ? 0 : currentIndex;
  return {
    prize: prizesInTier[adjustedIndex],
    newIndex: adjustedIndex,
  };
}

/**
 * Result of selecting the next bid to show.
 */
export type SelectBidResult<T> =
  | { bid: T; newIndex: number; showPanel: true }
  | { bid: undefined; newIndex: number; showPanel: false };

/**
 * Selects the next bid to show from the bids array.
 * Handles first-call behavior (starting from index 0) and subsequent calls (incrementing).
 * @param bids - Array of all current bids.
 * @param currentIndex - The current bid index.
 * @param panelCurrentlyShown - Whether the bid panel is currently visible.
 */
export function selectNextBid<T>(
  bids: T[],
  currentIndex: number,
  panelCurrentlyShown: boolean,
): SelectBidResult<T> {
  if (bids.length === 0) {
    return { bid: undefined, newIndex: 0, showPanel: false };
  }

  if (!panelCurrentlyShown) {
    // First call: start from the beginning
    return { bid: bids[0]!, newIndex: 0, showPanel: true };
  }

  // Subsequent calls: advance to the next bid, wrapping if needed
  const nextIndex = currentIndex + 1;
  const adjustedIndex = nextIndex >= bids.length ? 0 : nextIndex;
  return {
    bid: bids[adjustedIndex]!,
    newIndex: adjustedIndex,
    showPanel: true,
  };
}
