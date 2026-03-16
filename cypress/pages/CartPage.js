/**
 * @file        CartPage.js
 * @description Page Object for the Sauce Demo shopping cart page.
 *              Encapsulates all selectors and actions for viewing,
 *              removing items from the cart, and proceeding to checkout.
 * @purpose     Provides a clean interface for cart interactions so tests
 *              do not need to know the underlying DOM structure.
 * @url         https://www.saucedemo.com/cart.html
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const BasePage = require('./BasePage');

/**
 * @page        CartPage
 * @description Represents the shopping cart page where users review
 *              selected items before proceeding to checkout.
 */
class CartPage extends BasePage {
  // ─── ELEMENT GETTERS ───────────────────────────────────────────────

  /**
   * Getter for all cart item rows displayed on the cart page.
   * Each row shows the product name, description, price, and a remove button.
   *
   * @returns {Cypress.Chainable} A Cypress chainable yielding all cart item elements.
   */
  get cartItems() {
    // Each cart item is rendered inside a div with the cart_item class
    return cy.get('.cart_item');
  }

  /**
   * Getter for the Checkout button at the bottom of the cart page.
   * Navigates the user to the first step of the checkout flow.
   *
   * @returns {Cypress.Chainable} The checkout button element.
   */
  get checkoutButton() {
    // The checkout button uses a data-test attribute for reliable selection
    return cy.get('[data-test="checkout"]');
  }

  /**
   * Getter for the Continue Shopping button that returns the user
   * to the inventory page without losing cart contents.
   *
   * @returns {Cypress.Chainable} The continue shopping button element.
   */
  get continueShoppingButton() {
    // The continue shopping button is identified by its data-test attribute
    return cy.get('[data-test="continue-shopping"]');
  }

  /**
   * Getter for all Remove buttons visible on the cart page.
   * There is one remove button per cart item.
   *
   * @returns {Cypress.Chainable} A Cypress chainable yielding all remove button elements.
   */
  get removeButtons() {
    // Remove buttons share a common CSS class within each cart item row
    return cy.get('.cart_item button');
  }

  // ─── ACTION METHODS ────────────────────────────────────────────────

  /**
   * Returns the number of items currently displayed in the cart.
   * Counts the cart_item elements present in the DOM.
   *
   * @returns {Cypress.Chainable<number>} A chainable yielding the item count.
   */
  getItemCount() {
    // Use jQuery length property to count visible cart item elements
    return this.cartItems.its('length');
  }

  /**
   * Removes a specific item from the cart by matching its product name.
   * Locates the cart item row containing the given name, then clicks
   * the Remove button within that row.
   *
   * @param {string} productName - The exact display name of the product to remove.
   * @returns {void}
   */
  removeItem(productName) {
    // Find the cart item whose name matches, traverse up to the row, then click Remove
    cy.get('.cart_item')
      .contains('.inventory_item_name', productName)
      .parents('.cart_item')
      .find('button')
      .contains('Remove')
      .click();
  }

  /**
   * Clicks the Checkout button to navigate to the checkout step one page.
   *
   * @returns {void}
   */
  clickCheckout() {
    // Proceed to the checkout information step
    this.checkoutButton.click();
  }

  /**
   * Clicks the Continue Shopping button to navigate back to the inventory page.
   *
   * @returns {void}
   */
  clickContinueShopping() {
    // Return to the product listing without clearing the cart
    this.continueShoppingButton.click();
  }

  /**
   * Asserts that the browser is currently on the cart page by checking
   * the URL contains '/cart.html'.
   *
   * @returns {void}
   */
  isOnCartPage() {
    // Verify the URL path matches the cart page
    this.getUrl().should('include', '/cart.html');
  }
}

module.exports = new CartPage();
