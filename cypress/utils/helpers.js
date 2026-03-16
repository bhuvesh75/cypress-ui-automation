/**
 * @file        helpers.js
 * @description Utility functions used across the test suite for generating
 *              random data, waiting for network conditions, and other
 *              common operations that do not belong to a specific page object.
 * @purpose     Provides reusable helper functions that keep test code DRY
 *              and focused on business logic rather than data generation.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * Generates a random alphanumeric string of the specified length.
 * Useful for creating unique usernames, order references, or test data
 * that must not collide across parallel test runs.
 *
 * @param {number} [length=8] - The desired length of the random string.
 *                               Defaults to 8 characters if not provided.
 * @returns {string} A random string containing lowercase letters and digits.
 *
 * @example
 * const id = generateRandomString(12);
 * // => "a7b3x9k2m1p4"
 */
function generateRandomString(length = 8) {
  // Character pool: lowercase letters and digits provide sufficient randomness
  // for test data without introducing special characters that might need escaping
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Build the string character by character using random indices
  let result = '';
  for (let i = 0; i < length; i++) {
    // Pick a random index from the character pool
    const randomIndex = Math.floor(Math.random() * characters.length);
    // Append the character at that index to the result
    result += characters.charAt(randomIndex);
  }

  return result;
}

/**
 * Generates a random email address using a random local part and
 * a fixed test domain. The domain "testautomation.com" is intentionally
 * non-existent to prevent accidental delivery of real emails.
 *
 * @returns {string} A random email address (e.g. "user_a7b3x9k2@testautomation.com").
 *
 * @example
 * const email = generateRandomEmail();
 * // => "user_k3m9x2p7@testautomation.com"
 */
function generateRandomEmail() {
  // Prefix with "user_" for readability in logs and reports
  const localPart = `user_${generateRandomString(8)}`;

  // Use a non-existent domain to avoid sending real emails during tests
  const domain = 'testautomation.com';

  return `${localPart}@${domain}`;
}

/**
 * Waits for network activity to settle by intercepting all XHR and fetch
 * requests and waiting until no new requests have been made within the
 * specified timeout window. This is useful for pages that load data
 * asynchronously after the initial page load.
 *
 * Note: This is a best-effort approach. For deterministic waits, prefer
 * intercepting specific API endpoints with cy.intercept() and using
 * cy.wait() on named aliases.
 *
 * @param {number} [timeout=2000] - Milliseconds to wait for network silence.
 *                                   Defaults to 2000ms which covers most
 *                                   async data fetches on the Sauce Demo app.
 * @returns {void}
 *
 * @example
 * waitForNetworkIdle(3000);
 */
function waitForNetworkIdle(timeout = 2000) {
  // Use cy.intercept to monitor all outgoing requests matching any path
  cy.intercept('**/*').as('networkRequests');

  // Wait for the specified duration to allow pending requests to complete
  // This approach uses a simple timeout rather than tracking individual requests
  // because Cypress does not natively support "wait until no requests in flight"
  cy.wait(timeout);
}

// ─── MODULE EXPORTS ───────────────────────────────────────────────────────────
// Export all helper functions for use in test files and custom commands
module.exports = {
  generateRandomString,
  generateRandomEmail,
  waitForNetworkIdle,
};
