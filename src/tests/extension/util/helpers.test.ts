import { describe, expect, it } from "vitest";
import {
  timeStrToMS,
  msToTimeStr,
  formatAmount,
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
});
