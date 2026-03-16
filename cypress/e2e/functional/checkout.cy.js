/**
 * @file        checkout.cy.js
 * @description End-to-end test suite for the Sauce Demo checkout flow.
 *              Covers the full purchase journey from adding an item through
 *              order confirmation, negative scenarios with empty fields,
 *              and order total verification.
 * @purpose     Validates the multi-step checkout process to ensure users
 *              can complete purchases successfully and receive appropriate
 *              error feedback when required information is missing.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const InventoryPage = require('../../pages/InventoryPage');
const CartPage = require('../../pages/CartPage');
const CheckoutPage = require('../../pages/CheckoutPage');

/**
 * @suite       Checkout Flow
 * @description Tests for the complete checkout process including happy path,
 *              error handling, and order summary verification.
 */
describe('Functional: Checkout Flow', () => {
  /**
   * Log in and add an item to the cart before each test.
   * This ensures every test starts with at least one item ready for checkout.
   */
  beforeEach(() => {
    // Authenticate with valid credentials
    cy.login('standard_user', 'secret_sauce');

    // Confirm we are on the inventory page
    InventoryPage.isOnInventoryPage();

    // Add a product to the cart so checkout has something to process
    InventoryPage.addProductToCart('Sauce Labs Backpack');
  });

  /**
   * @test        Full checkout flow from cart to confirmation
   * @given       User is logged in with one item in the cart
   * @when        User navigates to cart, proceeds to checkout, fills shipping info,
   *              reviews the summary, and clicks Finish
   * @then        The order confirmation page displays "Thank you for your order!"
   */
  it('should complete full checkout and display thank you message', () => {
    // Navigate to the cart page
    InventoryPage.goToCart();

    // Verify we are on the cart page
    CartPage.isOnCartPage();

    // Verify the cart contains at least one item
    CartPage.getItemCount().should('be.gte', 1);

    // Click Checkout to start the checkout flow
    CartPage.clickCheckout();

    // Verify we are on checkout step one (shipping info)
    CheckoutPage.isOnStepOne();

    // Fill in the shipping information with test data
    CheckoutPage.fillShippingInfo('John', 'Doe', '12345');

    // Click Continue to advance to the order summary
    CheckoutPage.clickContinue();

    // Verify we are on checkout step two (order summary)
    CheckoutPage.isOnStepTwo();

    // Click Finish to complete the purchase
    CheckoutPage.clickFinish();

    // Verify we are on the confirmation page
    CheckoutPage.isOnConfirmation();

    // Assert the thank you message is displayed
    CheckoutPage.getThankYouMessage().should(
      'contain',
      'Thank you for your order!'
    );
  });

  /**
   * @test        Checkout with missing first name shows error
   * @given       User is logged in with one item in the cart and on checkout step one
   * @when        User leaves the first name field empty and fills other fields,
   *              then clicks Continue
   * @then        An error message is displayed indicating "First Name is required"
   */
  it('should display error when first name is missing during checkout', () => {
    // Navigate to cart and start checkout
    InventoryPage.goToCart();
    CartPage.clickCheckout();

    // Verify we are on checkout step one
    CheckoutPage.isOnStepOne();

    // Fill only last name and postal code, leaving first name empty
    CheckoutPage.lastNameField.clear().type('Doe');
    CheckoutPage.postalCodeField.clear().type('12345');

    // Attempt to continue without a first name
    CheckoutPage.clickContinue();

    // Assert the error message indicates the first name is required
    CheckoutPage.errorMessage.should('be.visible');
    CheckoutPage.errorMessage.should('contain', 'First Name is required');
  });

  /**
   * @test        Checkout with missing last name shows error
   * @given       User is logged in with one item in the cart and on checkout step one
   * @when        User fills first name and postal code but leaves last name empty,
   *              then clicks Continue
   * @then        An error message is displayed indicating "Last Name is required"
   */
  it('should display error when last name is missing during checkout', () => {
    // Navigate to cart and start checkout
    InventoryPage.goToCart();
    CartPage.clickCheckout();

    // Verify we are on checkout step one
    CheckoutPage.isOnStepOne();

    // Fill only first name and postal code, leaving last name empty
    CheckoutPage.firstNameField.clear().type('John');
    CheckoutPage.postalCodeField.clear().type('12345');

    // Attempt to continue without a last name
    CheckoutPage.clickContinue();

    // Assert the error message indicates the last name is required
    CheckoutPage.errorMessage.should('be.visible');
    CheckoutPage.errorMessage.should('contain', 'Last Name is required');
  });

  /**
   * @test        Checkout with missing postal code shows error
   * @given       User is logged in with one item in the cart and on checkout step one
   * @when        User fills first name and last name but leaves postal code empty,
   *              then clicks Continue
   * @then        An error message is displayed indicating "Postal Code is required"
   */
  it('should display error when postal code is missing during checkout', () => {
    // Navigate to cart and start checkout
    InventoryPage.goToCart();
    CartPage.clickCheckout();

    // Verify we are on checkout step one
    CheckoutPage.isOnStepOne();

    // Fill only first and last name, leaving postal code empty
    CheckoutPage.firstNameField.clear().type('John');
    CheckoutPage.lastNameField.clear().type('Doe');

    // Attempt to continue without a postal code
    CheckoutPage.clickContinue();

    // Assert the error message indicates the postal code is required
    CheckoutPage.errorMessage.should('be.visible');
    CheckoutPage.errorMessage.should('contain', 'Postal Code is required');
  });

  /**
   * @test        Order total is displayed on the summary page
   * @given       User is logged in with one item in the cart
   * @when        User completes checkout step one and reaches the summary page
   * @then        The order total is displayed and contains a dollar sign indicating a price
   */
  it('should display order total on the checkout summary page', () => {
    // Navigate to cart and start checkout
    InventoryPage.goToCart();
    CartPage.clickCheckout();

    // Fill in shipping information
    CheckoutPage.fillShippingInfo('John', 'Doe', '12345');

    // Advance to the summary page
    CheckoutPage.clickContinue();

    // Verify we are on checkout step two
    CheckoutPage.isOnStepTwo();

    // Assert the summary total is visible and contains a dollar amount
    CheckoutPage.summaryTotal.should('be.visible');

    // Assert the total text includes a dollar sign indicating a monetary value
    CheckoutPage.getOrderTotal().should('contain', '$');
  });
});
