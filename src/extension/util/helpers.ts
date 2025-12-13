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
 * Formats an amount as PLN, without cents.
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

/**
 * Formats a donation amount and total for display.
 * Removes trailing ".00" from whole number amounts.
 * @param rawAmount - The donation amount.
 * @param newTotal - The new donation total.
 */
export function formatDonation(
  rawAmount: number,
  newTotal: number,
): {
  amount: string;
  newTotal: string;
  rawAmount: number;
  rawNewTotal: number;
} {
  const parsedAmount = parseFloat(rawAmount.toString());
  const parsedNewTotal = parseFloat(newTotal.toString());

  let amount = `${parsedAmount.toFixed(2)} zł`;
  if (amount.endsWith(".00 zł")) {
    amount = `${parsedAmount.toFixed(0)} zł`;
  }

  return {
    amount,
    rawAmount: parsedAmount,
    newTotal: `${parsedNewTotal.toFixed(2)} zł`,
    rawNewTotal: parsedNewTotal,
  };
}

/**
 * Formats players from a run for display.
 * Uses team name if available, otherwise joins player names with semicolons.
 * @param teams - The teams array from RunData.
 */
export function formatPlayers(
  teams: Array<{
    name?: string;
    players: Array<{ name: string }>;
  }>,
): string {
  return (
    teams
      .map(
        (team) =>
          team.name ?? team.players.map((player) => player.name).join(";"),
      )
      .join(";") || "Bez gracza"
  );
}

/**
 * Formats Twitch usernames from a run for display.
 * Uses team name if available, otherwise joins player Twitch handles with semicolons.
 * @param teams - The teams array from RunData.
 */
export function formatTwitch(
  teams: Array<{
    name?: string;
    players: Array<{ social: { twitch?: string } }>;
  }>,
): string {
  return teams
    .map(
      (team) =>
        team.name ??
        team.players.map((player) => player.social.twitch).join(";"),
    )
    .join(";");
}

/**
 * Gets the current game name with category for display.
 * @param activeRun - The active run data, or null/undefined.
 */
export function getCurrentGame(
  activeRun: { category?: string; game?: string } | null | undefined,
): string {
  if (!activeRun) {
    return "Brak ustawionej gry";
  }

  let run = "Brak ustawionej gry";
  if (activeRun.game) {
    run = activeRun.game;
  }
  if (activeRun.category) {
    run += ` ${activeRun.category}`;
  }
  return run;
}
