import rawMilestonesJson from "../../data/milestones/raw_milestones.json" with { type: "json" };
import processedMilestonesJson from "../../data/milestones/processed_milestones.json" with { type: "json" };
import { Milestones } from "../../../extension/util/milestones";
import { describe, expect, it, vi } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("Milestones", () => {
  const milestones = new Milestones("https://api.example.com/milestones");

  describe("constructor", () => {
    it("should store url in instance", async () => {
      expect(milestones["url"]).toBe("https://api.example.com/milestones");
    });
  });

  describe("getMilestones", () => {
    it("should fetch and return processed milestones on success", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: rawMilestonesJson,
      });

      const result = await milestones.getMilestones();

      expect(axios.get).toHaveBeenCalledWith(
        "https://api.example.com/milestones"
      );
      expect(result).toEqual(processedMilestonesJson);
    });

    it("should throw error when API returns non-200 status", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 500,
        data: [],
      });

      await expect(milestones.getMilestones()).rejects.toThrow(
        "Failed to download milestones"
      );
    });

    it("should throw error when API returns 404", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 404,
        data: null,
      });

      await expect(milestones.getMilestones()).rejects.toThrow(
        "Failed to download milestones"
      );
    });

    it("should propagate network errors", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("Network Error"));

      await expect(milestones.getMilestones()).rejects.toThrow("Network Error");
    });
  });

  describe("processMilestones", () => {
    it("should return empty array when given empty array", () => {
      const result = milestones["processMilestones"]([]);
      expect(result).toEqual([]);
    });

    it("should handle single milestone", () => {
      const single = [{ Nazwa: "Milestone", Kwota: 100 }];
      const result = milestones["processMilestones"](single);
      expect(result).toEqual([{ name: "Milestone", amount: 100 }]);
    });

    it("should sort milestones by amount in ascending order", () => {
      const unsorted = [
        { Nazwa: "Milestone 1", Kwota: 500 },
        { Nazwa: "Milestone 2", Kwota: 100 },
        { Nazwa: "Milestone 3", Kwota: 300 },
      ];
      const result = milestones["processMilestones"](unsorted);

      expect(result).toEqual([
        { name: "Milestone 2", amount: 100 },
        { name: "Milestone 3", amount: 300 },
        { name: "Milestone 1", amount: 500 },
      ]);
    });

    it("should handle milestones with same amount", () => {
      const sameAmount = [
        { Nazwa: "First", Kwota: 100 },
        { Nazwa: "Second", Kwota: 100 },
      ];
      const result = milestones["processMilestones"](sameAmount);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(100);
    });
  });
});
