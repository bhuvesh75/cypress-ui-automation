/**
 * @file        cart.cy.js
 * @description Comprehensive test suite for the Sauce Demo shopping cart.
 *              Validates adding items, removing items, badge count updates,
 *              and navigation between cart and inventory pages.
 * @purpose     Ensures the shopping cart correctly tracks item additions
 *              and removals, updates the badge count in real time, and
 *              supports navigation back to the product listing.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const InventoryPage = require('../../pages/InventoryPage');
const CartPage = require('../../pages/CartPage');

/**
 * @suite       Shopping Cart
 * @description Tests for cart item management including add, remove,
 *              badge count, and continue shopping navigation.
 */
describe('Functional: Shopping Cart', () => {
  /**
   * Log in with valid credentials before each test.
   * Each test starts from the inventory page with an empty cart.
   */
  beforeEach(() => {
    // Authenticate and land on the inventory page
    cy.login('standard_user', 'secret_sauce');

    // Confirm we are on the inventory page
    InventoryPage.isOnInventoryPage();
  });

  /**
   * @test        Add 2 items and cart badge shows "2"
   * @given       User is logged in and on the inventory page with an empty cart
   * @when        User adds "Sauce Labs Backpack" and "Sauce Labs Bike Light" to the cart
   * @then        The cart badge displays "2" indicating two items in the cart
   */
  it('should show cart badge count of 2 after adding two items', () => {
    // Add the first product to the cart
    InventoryPage.addProductToCart('Sauce Labs Backpack');

    // Add the second product to the cart
    InventoryPage.addProductToCart('Sauce Labs Bike Light');

    // Assert the cart badge displays "2"
    InventoryPage.getCartBadgeCount().should('eq', '2');
  });

  /**
   * @test        Remove 1 of 2 items and badge shows "1"
   * @given       User is logged in and has added 2 items to the cart
   * @when        User removes "Sauce Labs Backpack" from the cart
   * @then        The cart badge displays "1" indicating one remaining item
   */
  it('should update cart badge to 1 after removing one of two items', () => {
    // Add two products to set up the precondition
    InventoryPage.addProductToCart('Sauce Labs Backpack');
    InventoryPage.addProductToCart('Sauce Labs Bike Light');

    // Verify badge shows 2 before removal
    InventoryPage.getCartBadgeCount().should('eq', '2');

    // Remove the first product using the custom command
    cy.removeFromCart('Sauce Labs Backpack');

    // Assert the cart badge now displays "1"
    InventoryPage.getCartBadgeCount().should('eq', '1');
  });

  /**
   * @test        Remove all items and badge disappears
   * @given       User is logged in and has added 1 item to the cart
   * @when        User removes the only item from the cart
   * @then        The cart badge is no longer visible (no items in cart)
   */
  it('should hide cart badge after removing all items', () => {
    // Add a single product to the cart
    InventoryPage.addProductToCart('Sauce Labs Backpack');

    // Verify the badge is present with count "1"
    InventoryPage.getCartBadgeCount().should('eq', '1');

    // Remove the only item from the cart
    cy.removeFromCart('Sauce Labs Backpack');

    // Assert the cart badge no longer exists in the DOM
    // When the cart is empty, the badge element is not rendered
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  /**
   * @test        Continue shopping from cart returns to inventory
   * @given       User is logged in and has navigated to the cart page
   * @when        User clicks the "Continue Shopping" button
   * @then        The browser navigates back to /inventory.html
   */
  it('should navigate back to inventory when clicking Continue Shopping', () => {
    // Add an item so the cart is not empty
    InventoryPage.addProductToCart('Sauce Labs Backpack');

    // Navigate to the cart page by clicking the cart icon
    InventoryPage.goToCart();

    // Verify we are on the cart page
    CartPage.isOnCartPage();

    // Click the Continue Shopping button
    CartPage.clickContinueShopping();

    // Assert the browser navigated back to the inventory page
    InventoryPage.isOnInventoryPage();

    // Assert the product list is visible again
    InventoryPage.productList.should('be.visible');
  });
});
