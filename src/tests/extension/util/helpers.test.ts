import { describe, expect, it } from "vitest";
import {
  timeStrToMS,
  msToTimeStr,
  formatAmount,
  formatDonation,
  formatPlayers,
  formatTwitch,
  getCurrentGame,
} from "../../../extension/util/helpers";

describe("helpers", () => {
  describe("timeStrToMS", () => {
    it("converts HH:MM:SS format to milliseconds", () => {
      expect(timeStrToMS("00:00:00")).toBe(0);
      expect(timeStrToMS("00:00:01")).toBe(1_000);
      expect(timeStrToMS("00:01:00")).toBe(60_000);
      expect(timeStrToMS("01:00:00")).toBe(3_600_000);
      expect(timeStrToMS("01:02:03")).toBe(
        1 * 3_600_000 + 2 * 60_000 + 3 * 1_000
      );
    });

    it("treats MM:SS format as 0 hours", () => {
      expect(timeStrToMS("00:30")).toBe(30_000);
      expect(timeStrToMS("01:30")).toBe(90_000);
    });
  });

  describe("msToTimeStr", () => {
    it("formats times less than an hour as MM:SS", () => {
      expect(msToTimeStr(0)).toBe("00:00");
      expect(msToTimeStr(1_000)).toBe("00:01");
      expect(msToTimeStr(61_000)).toBe("01:01");
      expect(msToTimeStr(59_999)).toBe("00:59");
    });

    it("formats times of an hour or more as H:MM:SS", () => {
      expect(msToTimeStr(3_600_000)).toBe("1:00:00");
      expect(msToTimeStr(3_660_000)).toBe("1:01:00");
      expect(msToTimeStr(3_661_000)).toBe("1:01:01");
      expect(msToTimeStr(10 * 3_600_000 + 5 * 60_000 + 7_000)).toBe("10:05:07");
    });
  });

  describe("formatAmount", () => {
    it("formats integer amounts without fractional digits", () => {
      expect(formatAmount(0)).toBe("0 PLN");
      expect(formatAmount(1)).toBe("1 PLN");
      expect(formatAmount(1234)).toBe("1,234 PLN");
    });

    it("rounds decimal amounts and omits cents", () => {
      expect(formatAmount(1.2)).toBe("1 PLN");
      expect(formatAmount(1.5)).toBe("2 PLN");
      expect(formatAmount(1234.56)).toBe("1,235 PLN");
    });
  });

  describe("formatDonation", () => {
    it("formats decimal amounts with two decimal places", () => {
      const result = formatDonation(25.5, 1000);
      expect(result.amount).toBe("25.50 zł");
      expect(result.rawAmount).toBe(25.5);
      expect(result.newTotal).toBe("1000.00 zł");
      expect(result.rawNewTotal).toBe(1000);
    });

    it("formats whole numbers without decimal places", () => {
      const result = formatDonation(100.0, 5000);
      expect(result.amount).toBe("100 zł");
      expect(result.rawAmount).toBe(100);
    });

    it("handles zero amount", () => {
      const result = formatDonation(0, 0);
      expect(result.amount).toBe("0 zł");
      expect(result.rawAmount).toBe(0);
      expect(result.newTotal).toBe("0.00 zł");
      expect(result.rawNewTotal).toBe(0);
    });

    it("handles amounts with .00 suffix correctly", () => {
      const result = formatDonation(50.0, 150.0);
      expect(result.amount).toBe("50 zł");
      expect(result.newTotal).toBe("150.00 zł");
    });

    it("preserves decimals that are not .00", () => {
      const result = formatDonation(25.01, 100.99);
      expect(result.amount).toBe("25.01 zł");
      expect(result.newTotal).toBe("100.99 zł");
    });

    it("handles large amounts", () => {
      const result = formatDonation(12345.67, 999999.99);
      expect(result.amount).toBe("12345.67 zł");
      expect(result.rawAmount).toBe(12345.67);
      expect(result.newTotal).toBe("999999.99 zł");
      expect(result.rawNewTotal).toBe(999999.99);
    });
  });

  describe("formatPlayers", () => {
    it("formats a single player in a single team", () => {
      const teams = [
        {
          players: [{ name: "Player1" }],
        },
      ];
      expect(formatPlayers(teams)).toBe("Player1");
    });

    it("formats multiple players in a single team with semicolons", () => {
      const teams = [
        {
          players: [{ name: "Player1" }, { name: "Player2" }, { name: "Player3" }],
        },
      ];
      expect(formatPlayers(teams)).toBe("Player1;Player2;Player3");
    });

    it("formats multiple teams with semicolons", () => {
      const teams = [
        { players: [{ name: "Player1" }] },
        { players: [{ name: "Player2" }] },
      ];
      expect(formatPlayers(teams)).toBe("Player1;Player2");
    });

    it("uses team name when available instead of player names", () => {
      const teams = [
        {
          name: "Team Alpha",
          players: [{ name: "Player1" }, { name: "Player2" }],
        },
      ];
      expect(formatPlayers(teams)).toBe("Team Alpha");
    });

    it("mixes team names and player names appropriately", () => {
      const teams = [
        {
          name: "Team Alpha",
          players: [{ name: "Player1" }],
        },
        {
          players: [{ name: "Player2" }, { name: "Player3" }],
        },
      ];
      expect(formatPlayers(teams)).toBe("Team Alpha;Player2;Player3");
    });

    it("returns 'Bez gracza' for empty teams array", () => {
      expect(formatPlayers([])).toBe("Bez gracza");
    });
  });

  describe("formatTwitch", () => {
    it("formats a single player with Twitch handle", () => {
      const teams = [
        {
          players: [{ social: { twitch: "player1_twitch" } }],
        },
      ];
      expect(formatTwitch(teams)).toBe("player1_twitch");
    });

    it("formats multiple players with semicolons", () => {
      const teams = [
        {
          players: [
            { social: { twitch: "player1_twitch" } },
            { social: { twitch: "player2_twitch" } },
          ],
        },
      ];
      expect(formatTwitch(teams)).toBe("player1_twitch;player2_twitch");
    });

    it("formats multiple teams with semicolons", () => {
      const teams = [
        { players: [{ social: { twitch: "p1" } }] },
        { players: [{ social: { twitch: "p2" } }] },
      ];
      expect(formatTwitch(teams)).toBe("p1;p2");
    });

    it("uses team name when available instead of Twitch handles", () => {
      const teams = [
        {
          name: "Team Alpha",
          players: [{ social: { twitch: "player1_twitch" } }],
        },
      ];
      expect(formatTwitch(teams)).toBe("Team Alpha");
    });

    it("handles players without Twitch handles", () => {
      const teams = [
        {
          players: [
            { social: { twitch: "player1_twitch" } },
            { social: {} },
            { social: { twitch: "player3_twitch" } },
          ],
        },
      ];
      expect(formatTwitch(teams)).toBe("player1_twitch;;player3_twitch");
    });

    it("returns empty string for empty teams array", () => {
      expect(formatTwitch([])).toBe("");
    });
  });

  describe("getCurrentGame", () => {
    it("returns default message for null run", () => {
      expect(getCurrentGame(null)).toBe("Brak ustawionej gry");
    });

    it("returns default message for undefined run", () => {
      expect(getCurrentGame(undefined)).toBe("Brak ustawionej gry");
    });

    it("returns game name when only game is set", () => {
      expect(getCurrentGame({ game: "Super Mario 64" })).toBe("Super Mario 64");
    });

    it("returns game and category when both are set", () => {
      expect(
        getCurrentGame({ game: "Super Mario 64", category: "120 Star" })
      ).toBe("Super Mario 64 120 Star");
    });

    it("returns default message when game is not set but category is", () => {
      expect(getCurrentGame({ category: "Any%" })).toBe("Brak ustawionej gry Any%");
    });

    it("returns default message for empty object", () => {
      expect(getCurrentGame({})).toBe("Brak ustawionej gry");
    });
  });
});
