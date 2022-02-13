'use strict';

/**
 * Formats an amount as USD, cents optional.
 * @param {Number} amount - The amount to format.
 * @param {Boolean} cents - Whether or not to include cents in the formatted string.
 * @returns {string} - The formatted string.
 */
export function formatDollars(amount: Number, { cents = true } = {}) {
  const fractionDigits = cents ? 2 : 0;
  return (
    parseFloat(amount as unknown as string).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    }) + ' PLN'
  );
}
