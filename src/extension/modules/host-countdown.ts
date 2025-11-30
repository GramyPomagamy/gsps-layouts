import { type CountdownRunning, type ModuleParams } from "@gsps-layouts/types";
import TimeUtils, {
  type ICountdownTimer,
  type TimeStruct,
} from "../util/lib/time";

export async function setup({ nodecg }: ModuleParams<object>): Promise<void> {
  const hostCountdown = nodecg.Replicant<TimeStruct>("hostCountdown", {
    defaultValue: TimeUtils.createTimeStruct(3 * 60 * 1000),
    persistent: false,
  });
  const hostCountdownRunning = nodecg.Replicant<CountdownRunning>(
    "hostCountdownRunning",
    {
      defaultValue: false,
      persistent: false,
    },
  );
  let hostCountdownTimer: ICountdownTimer;

  const startHostCountdown = (startTime = "3:00") => {
    if (hostCountdownRunning.value) {
      return;
    }

    const durationMs = TimeUtils.parseTimeString(startTime);
    if (durationMs <= 0) {
      return;
    }

    hostCountdownRunning.value = true;
    hostCountdown.value = TimeUtils.createTimeStruct(durationMs);

    if (hostCountdownTimer) {
      hostCountdownTimer.stop();
      hostCountdownTimer.removeAllListeners();
    }

    hostCountdownTimer = new TimeUtils.InfiniteCountdownTimer(
      Date.now() + durationMs,
    );
    hostCountdownTimer.on("tick", (remainingTimeStruct: TimeStruct) => {
      hostCountdown.value = remainingTimeStruct;
    });
  };

  const stopHostCountdown = () => {
    if (!hostCountdown.value) {
      return;
    }

    hostCountdownRunning.value = false;
    if (hostCountdownTimer) {
      hostCountdownTimer.stop();
    }
  };

  nodecg.listenFor("startHostCountdown", (startTime) => {
    startHostCountdown(startTime);
  });
  nodecg.listenFor("stopHostCountdown", () => {
    stopHostCountdown();
  });
}
