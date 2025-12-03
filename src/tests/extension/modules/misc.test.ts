import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createMockNodeCG,
  type MockNodeCG,
  type MockReplicant,
} from "../../helpers";
import { setup } from "../../../extension/modules/misc";
import type { RunDataActiveRun } from "../../../../bundles/nodecg-speedcontrol/src/types";
import type { NameCycle } from "../../../types";

describe("misc module", () => {
  let mockNodecg: MockNodeCG;
  let nameCycleReplicant: MockReplicant<NameCycle>;
  let activeRunReplicant: MockReplicant<RunDataActiveRun>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockNodecg = createMockNodeCG();
  });

  afterEach(() => {
    vi.useRealTimers();
    mockNodecg.reset();
  });

  const getReplicants = () => {
    // nameCycle is created without namespace, so it uses the default bundleName
    nameCycleReplicant = mockNodecg.getReplicant<NameCycle>(
      "nameCycle",
      "gsps-layouts"
    )!;
    activeRunReplicant = mockNodecg.getReplicant<RunDataActiveRun>(
      "runDataActiveRun",
      "nodecg-speedcontrol"
    )!;
  };

  const createRunWithPlayers = (
    players: Array<{ name: string; twitch?: string }>
  ): RunDataActiveRun => ({
    id: "test-run",
    game: "Test Game",
    category: "Any%",
    teams: [
      {
        id: "team-1",
        players: players.map((p, i) => ({
          id: `player-${i}`,
          name: p.name,
          teamID: "team-1",
          social: {
            twitch: p.twitch,
          },
          customData: {},
        })),
      },
    ],
    customData: {},
  });

  describe("doAllPlayersInRunHaveTwitch (via cycleNames behavior)", () => {
    it("returns false when run is null/undefined - stays on 45s cycle", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      // Run is undefined by default
      expect(activeRunReplicant.value).toBeUndefined();
      expect(nameCycleReplicant.value).toBe(0);

      // After 45 seconds, should still be 0 (no twitch cycling)
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(0);

      // Another 45 seconds, still 0
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(0);
    });

    it("treats empty teams array as all players having twitch (vacuous truth)", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = {
        id: "test-run",
        game: "Test Game",
        teams: [],
        customData: {},
      };
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);

      // Since "all" (zero) players have twitch, it cycles
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(1);
    });

    it("returns false when at least one player lacks twitch - stays on 45s cycle", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "player1_twitch" },
        { name: "Player2" }, // No twitch
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);

      // Should stay on 45s cycle since not all have twitch
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(0);

      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(0);
    });

    it("returns true when all players have twitch - cycles between name and twitch", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "player1_twitch" },
        { name: "Player2", twitch: "player2_twitch" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      // Should reset to 0 on run change
      expect(nameCycleReplicant.value).toBe(0);

      // After 45 seconds (name display), should cycle to 1 (twitch)
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(1);

      // After 15 seconds (twitch display), should cycle back to 0 (name)
      vi.advanceTimersByTime(15_000);
      expect(nameCycleReplicant.value).toBe(0);
    });

    it("handles multiple teams with all players having twitch", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = {
        id: "test-run",
        game: "Test Game",
        teams: [
          {
            id: "team-1",
            players: [
              {
                id: "p1",
                name: "Player1",
                teamID: "team-1",
                social: { twitch: "p1_twitch" },
                customData: {},
              },
            ],
          },
          {
            id: "team-2",
            players: [
              {
                id: "p2",
                name: "Player2",
                teamID: "team-2",
                social: { twitch: "p2_twitch" },
                customData: {},
              },
            ],
          },
        ],
        customData: {},
      };
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);

      // Should cycle since all players have twitch
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(1);
    });

    it("handles multiple teams where one player lacks twitch", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = {
        id: "test-run",
        game: "Test Game",
        teams: [
          {
            id: "team-1",
            players: [
              {
                id: "p1",
                name: "Player1",
                teamID: "team-1",
                social: { twitch: "p1_twitch" },
                customData: {},
              },
            ],
          },
          {
            id: "team-2",
            players: [
              {
                id: "p2",
                name: "Player2",
                teamID: "team-2",
                social: {},
                customData: {},
              }, // No twitch
            ],
          },
        ],
        customData: {},
      };
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);

      // Should NOT cycle since not all players have twitch
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(0);
    });
  });

  describe("cycleNames", () => {
    it("resets cycle to 0 when active run changes", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      // Set up a run with all twitch
      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "p1" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      // Advance to cycle 1
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(1);

      // Change the run - should reset to 0
      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player2", twitch: "p2" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);
    });

    it("clears previous timeout when cycling", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "p1" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      // Advance partially through the 45s timeout
      vi.advanceTimersByTime(30_000);
      expect(nameCycleReplicant.value).toBe(0);

      // Change run mid-cycle - should reset and restart timer
      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player2", twitch: "p2" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);

      // Advance 30s more - shouldn't trigger old timeout
      vi.advanceTimersByTime(30_000);
      expect(nameCycleReplicant.value).toBe(0);

      // Need full 45s from the reset
      vi.advanceTimersByTime(15_000);
      expect(nameCycleReplicant.value).toBe(1);
    });

    it("uses 45s timeout for name display (cycle 0)", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "p1" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      expect(nameCycleReplicant.value).toBe(0);

      // Just before 45s - should still be 0
      vi.advanceTimersByTime(44_999);
      expect(nameCycleReplicant.value).toBe(0);

      // At 45s - should change to 1
      vi.advanceTimersByTime(1);
      expect(nameCycleReplicant.value).toBe(1);
    });

    it("uses 15s timeout for twitch display (cycle 1)", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "p1" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      // Get to cycle 1
      vi.advanceTimersByTime(45_000);
      expect(nameCycleReplicant.value).toBe(1);

      // Just before 15s - should still be 1
      vi.advanceTimersByTime(14_999);
      expect(nameCycleReplicant.value).toBe(1);

      // At 15s - should wrap back to 0
      vi.advanceTimersByTime(1);
      expect(nameCycleReplicant.value).toBe(0);
    });

    it("continues cycling indefinitely", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      activeRunReplicant.value = createRunWithPlayers([
        { name: "Player1", twitch: "p1" },
      ]);
      activeRunReplicant.emit("change", activeRunReplicant.value);

      // Run through multiple complete cycles
      for (let i = 0; i < 3; i++) {
        expect(nameCycleReplicant.value).toBe(0);
        vi.advanceTimersByTime(45_000);
        expect(nameCycleReplicant.value).toBe(1);
        vi.advanceTimersByTime(15_000);
      }
      expect(nameCycleReplicant.value).toBe(0);
    });

    it("initializes cycle on module setup", async () => {
      await setup({ nodecg: mockNodecg, config: {}, logger: mockNodecg.log });
      getReplicants();

      // Should initialize to 0 even without a run change event
      expect(nameCycleReplicant.value).toBe(0);
    });
  });
});
