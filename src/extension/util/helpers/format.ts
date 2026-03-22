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
