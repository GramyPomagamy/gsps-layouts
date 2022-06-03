'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDollars = void 0;
/**
 * Formats an amount as USD, cents optional.
 * @param {Number} amount - The amount to format.
 * @param {Boolean} cents - Whether or not to include cents in the formatted string.
 * @returns {string} - The formatted string.
 */
function formatDollars(amount, { cents = true } = {}) {
    const fractionDigits = cents ? 2 : 0;
    return (parseFloat(amount).toLocaleString('en-US', {
        maximumFractionDigits: 0,
    }) + ' PLN');
}
exports.formatDollars = formatDollars;
