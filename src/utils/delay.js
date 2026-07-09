/**
 * Helper to pause execution for a given duration.
 * 
 * @param {number} ms - Milliseconds to sleep.
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = delay;
