/**
 * @file        InventoryPage.js
 * @description Page Object for the Sauce Demo inventory (products) page.
 *              Encapsulates all selectors and actions related to browsing,
 *              sorting, and adding products to the cart.
 * @purpose     Keeps product-listing interactions in one place so that
 *              tests remain readable and maintainable when selectors change.
 * @url         https://www.saucedemo.com/inventory.html
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const BasePage = require('./BasePage');

/**
 * @page        InventoryPage
 * @description Represents the inventory listing page where all products
 *              are displayed in a grid/list with sorting and cart controls.
 */
class InventoryPage extends BasePage {
  // ─── ELEMENT GETTERS ───────────────────────────────────────────────

  /**
   * Getter for the container that holds all product cards.
   * Used as a parent scope to verify the product list has rendered.
   *
   * @returns {Cypress.Chainable} The inventory list container element.
   */
  get productList() {
    // The application wraps all product cards inside this container
    return cy.get('.inventory_list');
  }

  /**
   * Getter for the shopping cart badge that displays the item count.
   * The badge only appears when at least one item is in the cart.
   *
   * @returns {Cypress.Chainable} The cart badge span element.
   */
  get cartBadge() {
    // Badge is a <span> overlaid on the cart icon showing the current item count
    return cy.get('.shopping_cart_badge');
  }

  /**
   * Getter for the sort dropdown select element.
   * Allows users to reorder products by name or price.
   *
   * @returns {Cypress.Chainable} The product sort dropdown element.
   */
  get sortDropdown() {
    // The sort control is a native <select> element with this data-test attribute
    return cy.get('[data-test="product-sort-container"]');
  }

  /**
   * Getter for all individual product item cards on the page.
   * Each card contains the product name, description, price, and add-to-cart button.
   *
   * @returns {Cypress.Chainable} A Cypress chainable yielding all product item elements.
   */
  get productItems() {
    // Each product is rendered inside a div with the inventory_item class
    return cy.get('.inventory_item');
  }

  /**
   * Getter for the hamburger menu button in the top-left corner.
   * Opens the sidebar navigation drawer.
   *
   * @returns {Cypress.Chainable} The burger menu button element.
   */
  get burgerMenu() {
    // Hamburger icon button that toggles the sidebar navigation
    return cy.get('#react-burger-menu-btn');
  }

  /**
   * Getter for the shopping cart link in the header.
   * Navigates to the cart page when clicked.
   *
   * @returns {Cypress.Chainable} The shopping cart link element.
   */
  get cartLink() {
    // The cart icon in the top-right corner that links to the cart page
    return cy.get('.shopping_cart_link');
  }

  // ─── ACTION METHODS ────────────────────────────────────────────────

  /**
   * Returns the total number of product items currently displayed on the page.
   * Useful for asserting that the expected catalogue size is rendered.
   *
   * @returns {Cypress.Chainable<number>} A chainable yielding the product count.
   */
  getProductCount() {
    // Use .its('length') on the jQuery collection to get the count
    return this.productItems.its('length');
  }

  /**
   * Selects a sort option from the product sort dropdown.
   * Accepted values mirror the <option> values in the application:
   *   - 'az'    — Name (A to Z)
   *   - 'za'    — Name (Z to A)
   *   - 'lohi'  — Price (low to high)
   *   - 'hilo'  — Price (high to low)
   *
   * @param {string} option - The value attribute of the desired sort option.
   * @returns {void}
   */
  sortBy(option) {
    // cy.select triggers the native change event on the <select> element
    this.sortDropdown.select(option);
  }

  /**
   * Retrieves the name of the first product card in the current sort order.
   * Returns the text content of the first .inventory_item_name element.
   *
   * @returns {Cypress.Chainable<string>} A chainable yielding the first product name.
   */
  getFirstProductName() {
    // .first() narrows to the first matching element; .invoke('text') extracts its text
    return cy.get('.inventory_item_name').first().invoke('text');
  }

  /**
   * Clicks the "Add to cart" button for a product identified by its visible name.
   * The method locates the product card containing the given name and then
   * finds the add-to-cart button within that card.
   *
   * @param {string} productName - The exact display name of the product (e.g. "Sauce Labs Backpack").
   * @returns {void}
   */
  addProductToCart(productName) {
    // Find the inventory item whose name text matches, then locate its Add to Cart button
    cy.get('.inventory_item')
      .contains('.inventory_item_name', productName)
      .parents('.inventory_item')
      .find('button')
      .contains('Add to cart')
      .click();
  }

  /**
   * Reads the numeric value from the shopping cart badge.
   * Should only be called when at least one item is in the cart,
   * otherwise the badge element does not exist in the DOM.
   *
   * @returns {Cypress.Chainable<string>} A chainable yielding the badge text (e.g. "2").
   */
  getCartBadgeCount() {
    // The badge text is the string representation of the item count
    return this.cartBadge.invoke('text');
  }

  /**
   * Asserts that the browser is currently on the inventory page
   * by checking the URL contains '/inventory.html'.
   *
   * @returns {void}
   */
  isOnInventoryPage() {
    // Verify the URL path matches the inventory page
    this.getUrl().should('include', '/inventory.html');
  }

  /**
   * Navigates to the cart page by clicking the cart icon in the header.
   *
   * @returns {void}
   */
  goToCart() {
    // Click the cart link in the top-right header area
    this.cartLink.click();
  }
}

module.exports = new InventoryPage();
