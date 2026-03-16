/**
 * @file        BasePage.js
 * @description Abstract base class for all Page Objects. Provides common navigation,
 *              waiting, and element-inspection methods that every page inherits.
 * @purpose     Eliminates duplication by centralising shared page interactions in one
 *              place so that child pages only need to define their unique selectors
 *              and domain-specific actions.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

class BasePage {
  /**
   * Navigates the browser to the given path relative to the configured baseUrl.
   * If no path is supplied the browser navigates to the root of the application.
   *
   * @param {string} [path='/'] - The URL path to visit (e.g. '/inventory.html').
   * @returns {void}
   */
  visit(path = '/') {
    // cy.visit automatically prepends the baseUrl defined in cypress.config.js
    cy.visit(path);
  }

  /**
   * Returns the document title of the current page.
   * Useful for asserting that the correct page has loaded.
   *
   * @returns {Cypress.Chainable<string>} A chainable that yields the page title.
   */
  getTitle() {
    // cy.title() queries the <title> element of the active document
    return cy.title();
  }

  /**
   * Returns the full URL of the current page.
   * Can be used in assertions to verify navigation outcomes.
   *
   * @returns {Cypress.Chainable<string>} A chainable that yields the current URL.
   */
  getUrl() {
    // cy.url() retrieves the href of the current location object
    return cy.url();
  }

  /**
   * Waits until the document.readyState equals 'complete', indicating
   * that all sub-resources (images, stylesheets, scripts) have finished loading.
   * Uses a 10-second timeout to account for slower network conditions.
   *
   * @returns {void}
   */
  waitForPageLoad() {
    // Poll the document's readyState property until it reports 'complete'
    cy.document().its('readyState').should('eq', 'complete');
  }

  /**
   * Asserts that an element matching the given CSS selector is visible
   * in the viewport. This is a convenience wrapper around Cypress's
   * built-in visibility assertion.
   *
   * @param {string} selector - A CSS selector string (e.g. '#login-button').
   * @returns {Cypress.Chainable} The Cypress chainable for further assertions.
   */
  isElementVisible(selector) {
    // cy.get locates the element; .should('be.visible') asserts it is rendered and not hidden
    return cy.get(selector).should('be.visible');
  }

  /**
   * Checks whether a DOM element exists on the page without asserting visibility.
   * Returns a chainable whose length can be inspected.
   *
   * @param {string} selector - A CSS selector string.
   * @returns {Cypress.Chainable} The Cypress chainable for further assertions.
   */
  doesElementExist(selector) {
    // Using jQuery-style length check to verify DOM presence without visibility requirement
    return cy.get('body').then(($body) => {
      return $body.find(selector).length > 0;
    });
  }

  /**
   * Clicks a DOM element identified by the given CSS selector.
   * Waits for the element to be actionable before clicking.
   *
   * @param {string} selector - A CSS selector string for the target element.
   * @returns {void}
   */
  click(selector) {
    // Cypress automatically waits for the element to be actionable before clicking
    cy.get(selector).click();
  }

  /**
   * Types text into an input field identified by the given CSS selector.
   * Clears the field first to avoid appending to existing content.
   *
   * @param {string} selector - A CSS selector string for the input element.
   * @param {string} text     - The text to type into the field.
   * @returns {void}
   */
  type(selector, text) {
    // Clear existing value then type the new text character by character
    cy.get(selector).clear().type(text);
  }
}

module.exports = BasePage;
