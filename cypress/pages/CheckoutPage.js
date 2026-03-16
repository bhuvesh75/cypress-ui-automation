/**
 * @file        CheckoutPage.js
 * @description Page Object for the Sauce Demo multi-step checkout flow.
 *              Covers Step One (shipping info), Step Two (order summary),
 *              and the final confirmation page.
 * @purpose     Provides a unified interface for the entire checkout process
 *              so tests can drive multi-step purchases through simple method calls.
 * @url         https://www.saucedemo.com/checkout-step-one.html
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const BasePage = require('./BasePage');

/**
 * @page        CheckoutPage
 * @description Represents the three-step checkout flow: shipping information
 *              entry, order summary review, and order confirmation.
 */
class CheckoutPage extends BasePage {
  // ─── ELEMENT GETTERS ───────────────────────────────────────────────

  /**
   * Getter for the First Name input field on checkout step one.
   *
   * @returns {Cypress.Chainable} The first name input element.
   */
  get firstNameField() {
    // First name field identified by its data-test attribute
    return cy.get('[data-test="firstName"]');
  }

  /**
   * Getter for the Last Name input field on checkout step one.
   *
   * @returns {Cypress.Chainable} The last name input element.
   */
  get lastNameField() {
    // Last name field identified by its data-test attribute
    return cy.get('[data-test="lastName"]');
  }

  /**
   * Getter for the Postal Code input field on checkout step one.
   *
   * @returns {Cypress.Chainable} The postal code input element.
   */
  get postalCodeField() {
    // Postal/zip code field identified by its data-test attribute
    return cy.get('[data-test="postalCode"]');
  }

  /**
   * Getter for the Continue button that advances from step one to step two.
   *
   * @returns {Cypress.Chainable} The continue button element.
   */
  get continueButton() {
    // Continue button advances the checkout flow to the summary page
    return cy.get('[data-test="continue"]');
  }

  /**
   * Getter for the Finish button on checkout step two that completes the order.
   *
   * @returns {Cypress.Chainable} The finish button element.
   */
  get finishButton() {
    // Finish button submits the order and navigates to the confirmation page
    return cy.get('[data-test="finish"]');
  }

  /**
   * Getter for the summary total label on checkout step two.
   * Displays the total price including tax.
   *
   * @returns {Cypress.Chainable} The summary total element.
   */
  get summaryTotal() {
    // The total line at the bottom of the order summary including tax
    return cy.get('.summary_total_label');
  }

  /**
   * Getter for the "Thank you for your order" header on the confirmation page.
   *
   * @returns {Cypress.Chainable} The thank-you header element.
   */
  get thankYouHeader() {
    // The confirmation header displayed after a successful order
    return cy.get('.complete-header');
  }

  /**
   * Getter for the error message container on checkout step one.
   * Displayed when required fields are left empty.
   *
   * @returns {Cypress.Chainable} The error message element.
   */
  get errorMessage() {
    // Error messages use the same data-test attribute as the login page errors
    return cy.get('[data-test="error"]');
  }

  /**
   * Getter for the Cancel button on checkout pages.
   * Returns the user to the previous step or the cart.
   *
   * @returns {Cypress.Chainable} The cancel button element.
   */
  get cancelButton() {
    // Cancel button identified by its data-test attribute
    return cy.get('[data-test="cancel"]');
  }

  // ─── ACTION METHODS ────────────────────────────────────────────────

  /**
   * Fills in all three shipping information fields on checkout step one.
   * Clears each field before typing to prevent value concatenation.
   *
   * @param {string} firstName - The buyer's first name.
   * @param {string} lastName  - The buyer's last name.
   * @param {string} zip       - The buyer's postal/ZIP code.
   * @returns {void}
   */
  fillShippingInfo(firstName, lastName, zip) {
    // Clear and fill the first name field
    this.firstNameField.clear().type(firstName);
    // Clear and fill the last name field
    this.lastNameField.clear().type(lastName);
    // Clear and fill the postal code field
    this.postalCodeField.clear().type(zip);
  }

  /**
   * Clicks the Continue button to advance from checkout step one
   * (shipping info) to checkout step two (order summary).
   *
   * @returns {void}
   */
  clickContinue() {
    // Submit the shipping information form
    this.continueButton.click();
  }

  /**
   * Clicks the Finish button to complete the purchase on checkout step two.
   * After clicking, the user should be redirected to the confirmation page.
   *
   * @returns {void}
   */
  clickFinish() {
    // Finalize the order and trigger the confirmation flow
    this.finishButton.click();
  }

  /**
   * Retrieves the order total text from the summary page (step two).
   * The text typically includes a "Total: $XX.XX" format with tax.
   *
   * @returns {Cypress.Chainable<string>} A chainable yielding the total text.
   */
  getOrderTotal() {
    // Extract the visible text from the summary total label
    return this.summaryTotal.invoke('text');
  }

  /**
   * Asserts that the browser is on checkout step one (shipping info)
   * by checking the URL.
   *
   * @returns {void}
   */
  isOnStepOne() {
    // Verify the URL path matches checkout step one
    this.getUrl().should('include', '/checkout-step-one.html');
  }

  /**
   * Asserts that the browser is on checkout step two (order summary)
   * by checking the URL.
   *
   * @returns {void}
   */
  isOnStepTwo() {
    // Verify the URL path matches checkout step two
    this.getUrl().should('include', '/checkout-step-two.html');
  }

  /**
   * Asserts that the browser is on the order confirmation page
   * by checking the URL.
   *
   * @returns {void}
   */
  isOnConfirmation() {
    // Verify the URL path matches the checkout complete page
    this.getUrl().should('include', '/checkout-complete.html');
  }

  /**
   * Retrieves the thank-you message text from the confirmation page.
   * Used to assert that the order was placed successfully.
   *
   * @returns {Cypress.Chainable<string>} A chainable yielding the header text.
   */
  getThankYouMessage() {
    // Extract the text content of the confirmation header
    return this.thankYouHeader.invoke('text');
  }
}

module.exports = new CheckoutPage();
