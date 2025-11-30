import { type ModuleParams } from "@gsps-layouts/types";
import { type CountdownRunning } from "src/types/generated";
import TimeUtils, {
  type ICountdownTimer,
  type TimeStruct,
} from "../util/lib/time";

export async function setup({ nodecg }: ModuleParams<object>): Promise<void> {
  const time = nodecg.Replicant<TimeStruct>("countdown", {
    defaultValue: TimeUtils.createTimeStruct(600 * 1000),
    persistent: false,
  });

  const running = nodecg.Replicant<CountdownRunning>("countdownRunning", {
    defaultValue: false,
    persistent: false,
  });
  let countdownTimer: ICountdownTimer;

  const start = (startTime = "10:00") => {
    if (running.value) {
      return;
    }

    const durationMs = TimeUtils.parseTimeString(startTime);
    if (durationMs <= 0) {
      return;
    }

    running.value = true;
    time.value = TimeUtils.createTimeStruct(durationMs);

    if (countdownTimer) {
      countdownTimer.stop();
      countdownTimer.removeAllListeners();
    }

    countdownTimer = new TimeUtils.CountdownTimer(Date.now() + durationMs);
    countdownTimer.on("tick", (remainingTimeStruct: TimeStruct) => {
      time.value = remainingTimeStruct;
    });
  };

  const stop = () => {
    if (!running.value) {
      return;
    }

    running.value = false;
    if (countdownTimer) {
      countdownTimer.stop();
    }
  };

  nodecg.listenFor("startCountdown", (startTime: string) => {
    start(startTime);
  });
  nodecg.listenFor("stopCountdown", () => {
    stop();
  });
}
