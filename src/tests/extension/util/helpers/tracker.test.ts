import { describe, expect, it } from "vitest";
import {
  selectPrizeFromTier,
  selectNextBid,
} from "../../../../extension/util/helpers/tracker";

describe("tracker helpers", () => {
  describe("selectPrizeFromTier", () => {
    const prizes = [
      { id: 1, name: "Prize A", minimumBid: 10 },
      { id: 2, name: "Prize B", minimumBid: 10 },
      { id: 3, name: "Prize C", minimumBid: 25 },
      { id: 4, name: "Prize D", minimumBid: 50 },
      { id: 5, name: "Prize E", minimumBid: 10 },
    ];

    it("returns undefined for empty prizes array", () => {
      const result = selectPrizeFromTier([], 10, 0);
      expect(result.prize).toBeUndefined();
      expect(result.newIndex).toBe(0);
    });

    it("returns undefined when no prizes match the tier", () => {
      const result = selectPrizeFromTier(prizes, 100, 0);
      expect(result.prize).toBeUndefined();
      expect(result.newIndex).toBe(0);
    });

    it("returns the first prize at index 0", () => {
      const result = selectPrizeFromTier(prizes, 10, 0);
      expect(result.prize).toEqual({ id: 1, name: "Prize A", minimumBid: 10 });
      expect(result.newIndex).toBe(0);
    });

    it("returns the correct prize at a given index", () => {
      const result = selectPrizeFromTier(prizes, 10, 1);
      expect(result.prize).toEqual({ id: 2, name: "Prize B", minimumBid: 10 });
      expect(result.newIndex).toBe(1);
    });

    it("wraps index when it exceeds available prizes in tier", () => {
      // There are 3 prizes in tier 10 (indices 0, 1, 2)
      const result = selectPrizeFromTier(prizes, 10, 3);
      expect(result.prize).toEqual({ id: 1, name: "Prize A", minimumBid: 10 });
      expect(result.newIndex).toBe(0);
    });

    it("wraps index when it far exceeds available prizes", () => {
      const result = selectPrizeFromTier(prizes, 10, 100);
      expect(result.prize).toEqual({ id: 1, name: "Prize A", minimumBid: 10 });
      expect(result.newIndex).toBe(0);
    });

    it("returns the only prize in a single-prize tier", () => {
      const result = selectPrizeFromTier(prizes, 50, 0);
      expect(result.prize).toEqual({ id: 4, name: "Prize D", minimumBid: 50 });
      expect(result.newIndex).toBe(0);
    });

    it("wraps immediately for single-prize tier at index 1", () => {
      const result = selectPrizeFromTier(prizes, 50, 1);
      expect(result.prize).toEqual({ id: 4, name: "Prize D", minimumBid: 50 });
      expect(result.newIndex).toBe(0);
    });
  });

  describe("selectNextBid", () => {
    const bids = [
      { id: 1, name: "Bid A" },
      { id: 2, name: "Bid B" },
      { id: 3, name: "Bid C" },
    ];

    it("returns showPanel false for empty bids array", () => {
      const result = selectNextBid([], 0, false);
      expect(result.bid).toBeUndefined();
      expect(result.newIndex).toBe(0);
      expect(result.showPanel).toBe(false);
    });

    it("returns showPanel false for empty bids even if panel was shown", () => {
      const result = selectNextBid([], 0, true);
      expect(result.bid).toBeUndefined();
      expect(result.showPanel).toBe(false);
    });

    it("returns first bid when panel is not currently shown", () => {
      const result = selectNextBid(bids, 2, false);
      expect(result.bid).toEqual({ id: 1, name: "Bid A" });
      expect(result.newIndex).toBe(0);
      expect(result.showPanel).toBe(true);
    });

    it("advances to next bid when panel is already shown", () => {
      const result = selectNextBid(bids, 0, true);
      expect(result.bid).toEqual({ id: 2, name: "Bid B" });
      expect(result.newIndex).toBe(1);
      expect(result.showPanel).toBe(true);
    });

    it("continues advancing through bids", () => {
      const result = selectNextBid(bids, 1, true);
      expect(result.bid).toEqual({ id: 3, name: "Bid C" });
      expect(result.newIndex).toBe(2);
      expect(result.showPanel).toBe(true);
    });

    it("wraps to first bid after reaching the end", () => {
      const result = selectNextBid(bids, 2, true);
      expect(result.bid).toEqual({ id: 1, name: "Bid A" });
      expect(result.newIndex).toBe(0);
      expect(result.showPanel).toBe(true);
    });

    it("handles single bid array", () => {
      const singleBid = [{ id: 1, name: "Only Bid" }];

      // First call (panel not shown)
      const result1 = selectNextBid(singleBid, 0, false);
      expect(result1.bid).toEqual({ id: 1, name: "Only Bid" });
      expect(result1.newIndex).toBe(0);

      // Second call (panel shown, should wrap to same bid)
      const result2 = selectNextBid(singleBid, 0, true);
      expect(result2.bid).toEqual({ id: 1, name: "Only Bid" });
      expect(result2.newIndex).toBe(0);
    });
  });
});

