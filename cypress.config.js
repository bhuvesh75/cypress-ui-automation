/**
 * @file        cypress.config.js
 * @description Central Cypress configuration file that defines global settings,
 *              viewport dimensions, reporter options, and environment variables.
 * @purpose     Provides a single source of truth for all Cypress runtime configuration
 *              so that every test run uses consistent settings.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    /**
     * Base URL for all cy.visit() calls.
     * Falls back to the Sauce Demo public site if the CYPRESS_BASE_URL
     * environment variable is not set.
     */
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.saucedemo.com',

    /**
     * Glob pattern that tells Cypress where to find spec files.
     * Covers smoke, functional, and regression sub-folders.
     */
    specPattern: 'cypress/e2e/**/*.cy.js',

    /**
     * Path to the support file that is loaded before every spec.
     */
    supportFile: 'cypress/support/e2e.js',

    /**
     * Viewport dimensions set to a standard desktop resolution
     * to ensure consistent rendering across CI and local runs.
     */
    viewportWidth: 1280,
    viewportHeight: 720,

    /**
     * Record a video of every test run so failures can be replayed
     * during debugging without re-running the suite.
     */
    video: true,

    /**
     * Automatically capture a screenshot when a test fails.
     * Screenshots are stored in cypress/screenshots/ and uploaded
     * as CI artifacts for post-mortem analysis.
     */
    screenshotOnRunFailure: true,

    /**
     * Mochawesome reporter configuration.
     * - reportDir:  where individual JSON report files are written
     * - overwrite:  false so parallel runs do not clobber each other
     * - html:       generate an HTML report alongside the JSON
     * - json:       generate a JSON report for merging
     */
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },

    /**
     * Default command timeout increased to 10 seconds to accommodate
     * network latency when running against the live Sauce Demo site.
     */
    defaultCommandTimeout: 10000,

    /**
     * Page load timeout set to 120 seconds to handle slower CI runners
     * and cold starts of the target application. WHY: saucedemo.com loads
     * in ~30-60s from GitHub Actions runners; 60s caused intermittent
     * timeouts when CI runners were under load. 120s provides a generous
     * buffer for cy.session() setup (which does a full login page visit)
     * across all 6 spec files.
     */
    pageLoadTimeout: 120000,

    /**
     * Retry failed tests up to 2 times in CI (runMode). WHY: saucedemo.com
     * is a public demo site that occasionally returns transient 404 or
     * network errors from GitHub Actions IPs. Two retries absorb these
     * one-off failures without masking real bugs — a genuine bug fails
     * all 3 attempts consistently.
     */
    retries: {
      runMode: 2,
      openMode: 0,
    },

    /**
     * Disable test isolation between tests within a spec. WHY: saucedemo.com's
     * CDN rate-limits consecutive page-load requests from GitHub Actions IPs.
     * With testIsolation:true (default), Cypress clears the browser HTTP cache
     * between every test, forcing every cy.visit('/') to hit the CDN — which
     * triggers rate limiting after the 2nd request within a short window.
     * With testIsolation:false, the browser HTTP cache persists between tests
     * within a spec. saucedemo.com serves '/' with Cache-Control: max-age=600
     * (10 minutes), so tests 2-N within a spec serve cy.visit('/') from the
     * browser cache with no CDN request — eliminating rate-limit timeouts.
     * Each spec's FIRST test still makes one cold CDN request (which resets
     * between specs due to natural inter-spec delays).
     * Cart/auth state contamination is prevented by cy.clearLocalStorage() in
     * cy.login() before each cy.session() call.
     */
    testIsolation: false,

    /**
     * setupNodeEvents hook — reserved for future plugin registration
     * such as code coverage, visual regression, or custom task commands.
     */
    setupNodeEvents(on, config) {
      // Future plugins can be registered here
      return config;
    },
  },

  /**
   * Environment variables available via Cypress.env() inside tests.
   * Values here serve as defaults; they can be overridden by CLI flags,
   * cypress.env.json, or OS-level CYPRESS_* environment variables.
   */
  env: {
    STANDARD_USER: 'standard_user',
    STANDARD_PASSWORD: 'secret_sauce',
    LOCKED_USER: 'locked_out_user',
    LOCKED_PASSWORD: 'secret_sauce',
  },
});
