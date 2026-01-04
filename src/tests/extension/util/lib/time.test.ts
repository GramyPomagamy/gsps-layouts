import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import TimeUtils from "../../../../extension/util/lib/time";

describe("TimeUtils", () => {
  describe("createTimeStruct", () => {
    it("creates a TimeStruct with default value of 0", () => {
      const result = TimeUtils.createTimeStruct();

      expect(result.raw).toBe(0);
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.milliseconds).toBe(0);
      expect(result.formatted).toBe("00:00");
      expect(result.timestamp).toBeCloseTo(Date.now(), -2);
    });

    it("creates a TimeStruct with the provided milliseconds", () => {
      const ms = 3_661_500; // 1h 1m 1s 500ms

      const result = TimeUtils.createTimeStruct(ms);

      expect(result.raw).toBe(ms);
      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(1);
      expect(result.milliseconds).toBe(500);
      expect(result.formatted).toBe("1:01:01");
    });

    it("handles days in the TimeStruct", () => {
      const ms = 90_061_000; // 1d 1h 1m 1s

      const result = TimeUtils.createTimeStruct(ms);

      expect(result.days).toBe(1);
      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(1);
      expect(result.formatted).toBe("1d 1:01:01");
    });
  });

  describe("formatMilliseconds", () => {
    it("formats zero milliseconds as 00:00", () => {
      expect(TimeUtils.formatMilliseconds(0)).toBe("00:00");
    });

    it("formats seconds with leading zeros", () => {
      expect(TimeUtils.formatMilliseconds(1_000)).toBe("00:01");
      expect(TimeUtils.formatMilliseconds(9_000)).toBe("00:09");
      expect(TimeUtils.formatMilliseconds(10_000)).toBe("00:10");
    });

    it("formats minutes with leading zeros", () => {
      expect(TimeUtils.formatMilliseconds(60_000)).toBe("01:00");
      expect(TimeUtils.formatMilliseconds(540_000)).toBe("09:00");
      expect(TimeUtils.formatMilliseconds(600_000)).toBe("10:00");
    });

    it("formats hours without leading zeros", () => {
      expect(TimeUtils.formatMilliseconds(3_600_000)).toBe("1:00:00");
      expect(TimeUtils.formatMilliseconds(36_000_000)).toBe("10:00:00");
    });

    it("formats days with 'd' suffix", () => {
      expect(TimeUtils.formatMilliseconds(86_400_000)).toBe("1d 00:00");
      expect(TimeUtils.formatMilliseconds(172_800_000)).toBe("2d 00:00");
    });

    it("formats complex times correctly", () => {
      // 1d 2h 3m 4s
      const ms = 86_400_000 + 2 * 3_600_000 + 3 * 60_000 + 4_000;
      expect(TimeUtils.formatMilliseconds(ms)).toBe("1d 2:03:04");
    });

    it("formats negative times with a minus prefix", () => {
      expect(TimeUtils.formatMilliseconds(-60_000)).toBe("-01:00");
      expect(TimeUtils.formatMilliseconds(-3_661_000)).toBe("-1:01:01");
    });
  });

  describe("parseMs", () => {
    it("parses milliseconds into time components", () => {
      const result = TimeUtils.parseMs(90_061_500);

      expect(result.days).toBe(1);
      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(1);
      expect(result.milliseconds).toBe(500);
    });

    it("returns zeros for zero milliseconds", () => {
      const result = TimeUtils.parseMs(0);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.milliseconds).toBe(0);
    });
  });

  describe("parseSeconds", () => {
    it("parses seconds by converting to milliseconds first", () => {
      const result = TimeUtils.parseSeconds(3661);

      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(1);
    });

    it("handles fractional seconds", () => {
      const result = TimeUtils.parseSeconds(1.5);

      expect(result.seconds).toBe(1);
      expect(result.milliseconds).toBe(500);
    });
  });

  describe("parseTimeString", () => {
    it("parses hh:mm:ss format", () => {
      expect(TimeUtils.parseTimeString("01:02:03")).toBe(
        1 * 3_600_000 + 2 * 60_000 + 3 * 1_000
      );
      expect(TimeUtils.parseTimeString("00:00:00")).toBe(0);
      expect(TimeUtils.parseTimeString("10:30:45")).toBe(
        10 * 3_600_000 + 30 * 60_000 + 45 * 1_000
      );
    });

    it("parses mm:ss format", () => {
      expect(TimeUtils.parseTimeString("01:30")).toBe(1 * 60_000 + 30 * 1_000);
      expect(TimeUtils.parseTimeString("00:05")).toBe(5_000);
    });

    it("parses ss format", () => {
      expect(TimeUtils.parseTimeString("30")).toBe(30_000);
      expect(TimeUtils.parseTimeString("5")).toBe(5_000);
    });

    it("parses fractional seconds", () => {
      expect(TimeUtils.parseTimeString("00:00:01.5")).toBe(1_500);
      expect(TimeUtils.parseTimeString("01:30.5")).toBe(90_500);
      expect(TimeUtils.parseTimeString("1.5")).toBe(1_500);
    });

    it("throws error for invalid format", () => {
      expect(() => TimeUtils.parseTimeString("")).toThrow(
        "Unexpected format of timeString argument"
      );
      expect(() => TimeUtils.parseTimeString("   ")).toThrow(
        "Unexpected format of timeString argument"
      );
    });
  });

  describe("Timers", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe("CountdownTimer", () => {
      it("throws error if endTime is not a number", () => {
        expect(() => new TimeUtils.CountdownTimer(undefined as any)).toThrow(
          "endTime must be defined and it must be a number"
        );
      });

      it("emits tick events and done when countdown reaches zero", () => {
        const endTime = Date.now() + 500;
        const timer = new TimeUtils.CountdownTimer(endTime);
        const tickHandler = vi.fn();
        const doneHandler = vi.fn();

        timer.on("tick", tickHandler);
        timer.on("done", doneHandler);

        vi.advanceTimersByTime(600);

        expect(tickHandler).toHaveBeenCalled();
        expect(doneHandler).toHaveBeenCalled();
        // Clamps to zero when past end time
        const lastCall = tickHandler.mock.calls[tickHandler.mock.calls.length - 1];
        expect(lastCall[0].raw).toBe(0);

        timer.stop();
      });
    });

    describe("CountupTimer", () => {
      it("emits tick events with elapsed time and respects offset", () => {
        const timer = new TimeUtils.CountupTimer({ offset: 5_000 });
        const tickHandler = vi.fn();

        timer.on("tick", tickHandler);

        vi.advanceTimersByTime(100);

        expect(tickHandler).toHaveBeenCalled();
        const timeStruct = tickHandler.mock.calls[0][0];
        expect(timeStruct.raw).toBeGreaterThanOrEqual(5_100);

        timer.stop();
      });
    });

    describe("InfiniteCountdownTimer", () => {
      it("throws error if endTime is not a number", () => {
        expect(
          () => new TimeUtils.InfiniteCountdownTimer(undefined as any)
        ).toThrow("endTime must be defined and it must be a number");
      });

      it("continues counting into negative time after end time", () => {
        const endTime = Date.now() + 500;
        const timer = new TimeUtils.InfiniteCountdownTimer(endTime);
        const tickHandler = vi.fn();

        timer.on("tick", tickHandler);

        vi.advanceTimersByTime(1_000);

        const lastCall = tickHandler.mock.calls[tickHandler.mock.calls.length - 1];
        expect(lastCall[0].raw).toBeLessThan(0);

        timer.stop();
      });
    });

    it("all timers stop emitting when stop is called", () => {
      const endTime = Date.now() + 10_000;
      const timers = [
        new TimeUtils.CountdownTimer(endTime),
        new TimeUtils.CountupTimer(),
        new TimeUtils.InfiniteCountdownTimer(endTime),
      ];

      for (const timer of timers) {
        const tickHandler = vi.fn();
        timer.on("tick", tickHandler);

        vi.advanceTimersByTime(100);
        const callCountBeforeStop = tickHandler.mock.calls.length;

        timer.stop();

        vi.advanceTimersByTime(500);
        expect(tickHandler.mock.calls.length).toBe(callCountBeforeStop);
      }
    });

    it("all timers respect custom tick rate", () => {
      const endTime = Date.now() + 10_000;
      const timers = [
        new TimeUtils.CountdownTimer(endTime, { tickRate: 500 }),
        new TimeUtils.CountupTimer({ tickRate: 500 }),
        new TimeUtils.InfiniteCountdownTimer(endTime, { tickRate: 500 }),
      ];

      for (const timer of timers) {
        const tickHandler = vi.fn();
        timer.on("tick", tickHandler);

        vi.advanceTimersByTime(1_000);

        // With 500ms tick rate, should have 2 ticks in 1000ms
        expect(tickHandler.mock.calls.length).toBe(2);

        timer.stop();
      }
    });
  });
});

