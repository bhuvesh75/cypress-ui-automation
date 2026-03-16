/**
 * @file        e2e.js
 * @description Cypress support file that is loaded automatically before every
 *              spec file. Registers global hooks, imports custom commands,
 *              and configures error handling behaviour.
 * @purpose     Ensures a consistent test environment by centralising setup
 *              logic that applies to all end-to-end tests in the suite.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

// ─── IMPORT CUSTOM COMMANDS ───────────────────────────────────────────────────
// Load all custom Cypress commands defined in commands.js so they are
// available as cy.<commandName> in every test file.
import './commands';

// ─── GLOBAL BEFORE-EACH HOOK ──────────────────────────────────────────────────
/**
 * Runs before every individual test across all spec files.
 * Logs the current test title to the Cypress command log for easier
 * debugging when reviewing screenshots, videos, or CI output.
 */
beforeEach(function () {
  // Access the current test's full title (including describe block names)
  const testTitle = this.currentTest.title;

  // Log the test name to the Cypress command log for visibility in the runner
  cy.log(`--- Running: ${testTitle} ---`);
});

// ─── UNCAUGHT EXCEPTION HANDLER ───────────────────────────────────────────────
/**
 * Prevents Cypress from failing a test when the application under test
 * throws an unhandled JavaScript error. The Sauce Demo application
 * occasionally emits benign console errors that should not block the
 * test suite. Returning false tells Cypress to ignore the exception.
 *
 * @param {Error}  err    - The uncaught error thrown by the application.
 * @param {Mocha.Runnable} runnable - The Mocha test or hook that was running.
 * @returns {boolean} false — instructs Cypress to not fail the test.
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for awareness but do not let it fail the running test
  cy.log(`Caught uncaught exception: ${err.message}`);

  // Returning false prevents Cypress from failing the current test
  return false;
});
