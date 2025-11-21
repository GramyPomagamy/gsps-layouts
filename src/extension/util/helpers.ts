import { type NodeCGServer } from "./nodecg";
import { type TaggedLogger } from "./tagged-logger";

/**
 * Checks if number needs a 0 adding to the start and does so if needed.
 * @param num Number which you want to turn into a padded string.
 */
export function padTimeNumber(num: number): string {
  return num.toString().padStart(2, "0");
}

/**
 * Converts a time string (HH:MM:SS) into milliseconds.
 * @param time Time string you wish to convert.
 */
export function timeStrToMS(time: string): number {
  const ts = time.split(":");
  if (ts.length === 2) {
    ts.unshift("00"); // Adds 0 hours if they are not specified.
  }
  return Date.UTC(1970, 0, 1, Number(ts[0]), Number(ts[1]), Number(ts[2]));
}

/**
 * Converts milliseconds into a time string (HH:MM:SS).
 * @param ms Milliseconds you wish to convert.
 */
export function msToTimeStr(ms: number): string {
  let string = "";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours > 0) {
    string += `${hours}:`;
  }
  string += `${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
  return string;
}

/**
 * Allow a script to wait for an amount of milliseconds.
 * @param ms Milliseconds to sleep for.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Formats an amount as PLN, cents optional.
 * @param {Number} amount - The amount to format.
 * @returns {string} - The formatted string.
 */
export function formatAmount(amount: number): string {
  return (
    parseFloat(amount.toString()).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    }) + " PLN"
  );
}

export type ModuleParams<TConfig> = {
  config: TConfig;
  logger: TaggedLogger;
  nodecg: NodeCGServer;
};

export type LoadableModule<TConfig> = {
  setup: (params: ModuleParams<TConfig>) => Promise<void> | void;
};

export type ModuleDefinition<TConfig> = {
  config: TConfig;
  enabled: boolean;
  loadFn: () => Promise<LoadableModule<TConfig>>;
  name: string;
};
