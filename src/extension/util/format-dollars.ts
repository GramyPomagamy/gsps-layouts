'use strict';

/**
 * Formats an amount as USD, cents optional.
 * @param {Number} amount - The amount to format.
 * @returns {string} - The formatted string.
 */
export function formatDollars(amount: Number): string {
  return (
    parseFloat(amount as unknown as string).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    }) + ' zł'
  );
}
