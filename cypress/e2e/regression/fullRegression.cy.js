/**
 * @file        fullRegression.cy.js
 * @description Full regression test suite that exercises all critical paths
 *              of the Sauce Demo application in a single run. Covers login,
 *              product browsing, cart management, and checkout flows to
 *              ensure no regressions exist across the entire user journey.
 * @purpose     Provides a comprehensive regression gate that can be run
 *              before releases to validate end-to-end functionality across
 *              all major features of the application.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const LoginPage = require('../../pages/LoginPage');
const InventoryPage = require('../../pages/InventoryPage');
const CartPage = require('../../pages/CartPage');
const CheckoutPage = require('../../pages/CheckoutPage');

/**
 * @suite       Full Regression Suite
 * @description Master regression suite covering all critical user journeys:
 *
 *              1. Authentication
 *                 - Valid login
 *                 - Invalid credentials
 *                 - Locked user
 *                 - Empty field validation
 *
 *              2. Product Browsing
 *                 - Product list rendering
 *                 - All four sort options
 *                 - Product name verification
 *
 *              3. Cart Management
 *                 - Add and remove items
 *                 - Badge count accuracy
 *                 - Continue shopping navigation
 *
 *              4. Checkout Flow
 *                 - Complete purchase journey
 *                 - Shipping info validation
 *                 - Order total verification
 *
 *              5. End-to-End User Journey
 *                 - Full flow from login to order confirmation
 *                 - Multi-item purchase
 */
describe('Regression: Full Application Coverage', () => {
  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: AUTHENTICATION
  // ═══════════════════════════════════════════════════════════════════

  /**
   * @suite Authentication Regression
   * @description Validates all authentication scenarios including
   *              positive and negative login flows.
   */
  describe('Authentication', () => {
    beforeEach(() => {
      // WHY: With testIsolation:false, auth from test N persists into test N+1.
      // onBeforeLoad clears localStorage before React reads it, guaranteeing the
      // login form renders instead of a React Router redirect to /inventory.html.
      // cy.visit with onBeforeLoad avoids the DOMException / TypeError that
      // cy.window().then() throws after cy.session() leaves the browser in an
      // intermediate state (Cypress 12+).
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.clear();
        },
      });
      LoginPage.waitForPageLoad();
    });

    /**
     * @test        Valid login redirects to inventory
     * @given       User is on the login page
     * @when        User enters valid standard_user credentials
     * @then        Browser navigates to /inventory.html
     */
    it('should authenticate standard_user and redirect to inventory', () => {
      // Perform login with valid credentials
      LoginPage.enterUsername('standard_user');
      LoginPage.enterPassword('secret_sauce');
      LoginPage.clickLogin();

      // Assert successful navigation to inventory
      InventoryPage.isOnInventoryPage();
      InventoryPage.productList.should('be.visible');
    });

    /**
     * @test        Invalid credentials show error
     * @given       User is on the login page
     * @when        User enters a wrong password
     * @then        Error message about mismatched credentials is shown
     */
    it('should reject invalid credentials with appropriate error', () => {
      // Enter valid username with wrong password
      LoginPage.enterUsername('standard_user');
      LoginPage.enterPassword('invalid_pass');
      LoginPage.clickLogin();

      // Assert error message is displayed
      LoginPage.errorMessage.should('be.visible');
      LoginPage.getErrorMessage().should(
        'contain',
        'Username and password do not match'
      );
    });

    /**
     * @test        Locked user is denied access
     * @given       User is on the login page
     * @when        User enters locked_out_user credentials
     * @then        Error message about account lockout is shown
     */
    it('should deny access to locked_out_user with lockout error', () => {
      // Enter locked user credentials
      LoginPage.enterUsername('locked_out_user');
      LoginPage.enterPassword('secret_sauce');
      LoginPage.clickLogin();

      // Assert locked out error message
      LoginPage.errorMessage.should('be.visible');
      LoginPage.getErrorMessage().should('contain', 'locked out');
    });

    /**
     * @test        Empty username validation
     * @given       User is on the login page
     * @when        User submits with empty username
     * @then        "Username is required" error is displayed
     */
    it('should require username field', () => {
      // Only enter password
      LoginPage.enterPassword('secret_sauce');
      LoginPage.clickLogin();

      // Assert username required error
      LoginPage.getErrorMessage().should('contain', 'Username is required');
    });

    /**
     * @test        Empty password validation
     * @given       User is on the login page
     * @when        User submits with empty password
     * @then        "Password is required" error is displayed
     */
    it('should require password field', () => {
      // Only enter username
      LoginPage.enterUsername('standard_user');
      LoginPage.clickLogin();

      // Assert password required error
      LoginPage.getErrorMessage().should('contain', 'Password is required');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: PRODUCT BROWSING
  // ═══════════════════════════════════════════════════════════════════

  /**
   * @suite Product Browsing Regression
   * @description Validates product listing, sorting, and display.
   */
  describe('Product Browsing', () => {
    beforeEach(() => {
      // Log in and navigate to inventory for each product test
      cy.login('standard_user', 'secret_sauce');
      InventoryPage.isOnInventoryPage();
    });

    /**
     * @test        All 6 products are rendered
     * @given       User is logged in on the inventory page
     * @when        The page finishes loading
     * @then        Exactly 6 product items are displayed
     */
    it('should display all 6 products', () => {
      // Assert the product count matches the expected catalogue size
      InventoryPage.getProductCount().should('eq', 6);
    });

    /**
     * @test        Sort A-Z verification
     * @given       User is on the inventory page
     * @when        User selects "Name (A to Z)" sort option
     * @then        "Sauce Labs Backpack" is the first product
     */
    it('should sort products A to Z', () => {
      // Select alphabetical ascending sort
      InventoryPage.sortBy('az');
      // Assert first product is alphabetically first
      InventoryPage.getFirstProductName().should('eq', 'Sauce Labs Backpack');
    });

    /**
     * @test        Sort Z-A verification
     * @given       User is on the inventory page
     * @when        User selects "Name (Z to A)" sort option
     * @then        "Test.allTheThings() T-Shirt (Red)" is the first product
     */
    it('should sort products Z to A', () => {
      // Select alphabetical descending sort
      InventoryPage.sortBy('za');
      // Assert first product is alphabetically last
      InventoryPage.getFirstProductName().should(
        'eq',
        'Test.allTheThings() T-Shirt (Red)'
      );
    });

    /**
     * @test        Sort price low to high
     * @given       User is on the inventory page
     * @when        User selects "Price (low to high)" sort option
     * @then        "Sauce Labs Onesie" (cheapest) is the first product
     */
    it('should sort products by price ascending', () => {
      // Select price ascending sort
      InventoryPage.sortBy('lohi');
      // Assert cheapest product is first
      InventoryPage.getFirstProductName().should('eq', 'Sauce Labs Onesie');
    });

    /**
     * @test        Sort price high to low
     * @given       User is on the inventory page
     * @when        User selects "Price (high to low)" sort option
     * @then        "Sauce Labs Fleece Jacket" (most expensive) is the first product
     */
    it('should sort products by price descending', () => {
      // Select price descending sort
      InventoryPage.sortBy('hilo');
      // Assert most expensive product is first
      InventoryPage.getFirstProductName().should(
        'eq',
        'Sauce Labs Fleece Jacket'
      );
    });

    /**
     * @test        All product names are present
     * @given       User is on the inventory page
     * @when        The page renders all products
     * @then        Every expected product name is visible on the page
     */
    it('should display all expected product names', () => {
      // Load fixture and verify each product name
      cy.fixture('products').then((products) => {
        products.items.forEach((name) => {
          // Assert each product name is visible on the page
          cy.contains('.inventory_item_name', name).should('be.visible');
        });
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 3: CART MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  /**
   * @suite Cart Management Regression
   * @description Validates adding, removing, badge updates, and navigation.
   */
  describe('Cart Management', () => {
    beforeEach(() => {
      // Log in before each cart test
      cy.login('standard_user', 'secret_sauce');
      InventoryPage.isOnInventoryPage();
    });

    /**
     * @test        Add items updates badge count
     * @given       User is logged in with an empty cart
     * @when        User adds two products to the cart
     * @then        Cart badge displays "2"
     */
    it('should increment cart badge when adding items', () => {
      // Add two different products
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

      // Assert badge shows correct count
      InventoryPage.getCartBadgeCount().should('eq', '2');
    });

    /**
     * @test        Remove item decrements badge count
     * @given       User has 2 items in the cart
     * @when        User removes one item
     * @then        Cart badge displays "1"
     */
    it('should decrement cart badge when removing an item', () => {
      // Set up: add two items
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

      // Remove one item
      cy.removeFromCart('Sauce Labs Backpack');

      // Assert badge shows updated count
      InventoryPage.getCartBadgeCount().should('eq', '1');
    });

    /**
     * @test        Empty cart hides badge
     * @given       User has 1 item in the cart
     * @when        User removes the last item
     * @then        Cart badge is no longer visible
     */
    it('should hide cart badge when cart is empty', () => {
      // Add and then remove a single item
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      cy.removeFromCart('Sauce Labs Backpack');

      // Assert badge no longer exists in the DOM
      cy.get('.shopping_cart_badge').should('not.exist');
    });

    /**
     * @test        Cart page shows added items
     * @given       User has added items to the cart
     * @when        User navigates to the cart page
     * @then        The added items are visible in the cart
     */
    it('should display added items on the cart page', () => {
      // Add a product
      InventoryPage.addProductToCart('Sauce Labs Bike Light');

      // Navigate to cart
      InventoryPage.goToCart();
      CartPage.isOnCartPage();

      // Assert the item appears in the cart
      cy.contains('.inventory_item_name', 'Sauce Labs Bike Light').should(
        'be.visible'
      );
    });

    /**
     * @test        Continue shopping returns to inventory
     * @given       User is on the cart page
     * @when        User clicks Continue Shopping
     * @then        Browser navigates back to /inventory.html
     */
    it('should return to inventory via Continue Shopping', () => {
      // Navigate to cart page
      InventoryPage.goToCart();
      CartPage.isOnCartPage();

      // Click continue shopping
      CartPage.clickContinueShopping();

      // Assert we are back on inventory
      InventoryPage.isOnInventoryPage();
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 4: CHECKOUT FLOW
  // ═══════════════════════════════════════════════════════════════════

  /**
   * @suite Checkout Flow Regression
   * @description Validates the complete checkout process and error handling.
   */
  describe('Checkout Flow', () => {
    beforeEach(() => {
      // Log in and add an item before each checkout test
      cy.login('standard_user', 'secret_sauce');
      InventoryPage.addProductToCart('Sauce Labs Backpack');
    });

    /**
     * @test        Complete purchase journey
     * @given       User has an item in the cart
     * @when        User completes the full checkout flow
     * @then        Order confirmation page shows "Thank you for your order!"
     */
    it('should complete a full purchase from cart to confirmation', () => {
      // Navigate to cart
      InventoryPage.goToCart();
      CartPage.clickCheckout();

      // Fill shipping info and proceed
      CheckoutPage.fillShippingInfo('Jane', 'Smith', '90210');
      CheckoutPage.clickContinue();

      // Verify summary and finish
      CheckoutPage.isOnStepTwo();
      CheckoutPage.clickFinish();

      // Assert confirmation
      CheckoutPage.isOnConfirmation();
      CheckoutPage.getThankYouMessage().should(
        'contain',
        'Thank you for your order!'
      );
    });

    /**
     * @test        Missing first name validation
     * @given       User is on checkout step one
     * @when        User submits without first name
     * @then        "First Name is required" error is shown
     */
    it('should require first name on checkout', () => {
      // Navigate to checkout step one
      InventoryPage.goToCart();
      CartPage.clickCheckout();

      // Fill only last name and zip
      CheckoutPage.lastNameField.clear().type('Smith');
      CheckoutPage.postalCodeField.clear().type('90210');
      CheckoutPage.clickContinue();

      // Assert error
      CheckoutPage.errorMessage.should('contain', 'First Name is required');
    });

    /**
     * @test        Order total displayed on summary
     * @given       User has completed checkout step one
     * @when        User reaches the summary page
     * @then        The order total includes a dollar amount
     */
    it('should display monetary total on checkout summary', () => {
      // Navigate through checkout to summary
      InventoryPage.goToCart();
      CartPage.clickCheckout();
      CheckoutPage.fillShippingInfo('Jane', 'Smith', '90210');
      CheckoutPage.clickContinue();

      // Assert total is visible with dollar sign
      CheckoutPage.isOnStepTwo();
      CheckoutPage.getOrderTotal().should('contain', '$');
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 5: END-TO-END USER JOURNEY
  // ═══════════════════════════════════════════════════════════════════

  /**
   * @suite End-to-End Journey
   * @description Validates the complete user journey from login through
   *              multi-item purchase to order confirmation.
   */
  describe('End-to-End User Journey', () => {
    /**
     * @test        Multi-item purchase from login to confirmation
     * @given       User is on the login page
     * @when        User logs in, adds multiple items, sorts products, completes checkout
     * @then        The full journey completes with an order confirmation
     */
    it('should complete a multi-item purchase journey end-to-end', () => {
      // WHY: Auth from the preceding Checkout Flow describe block persists in
      // localStorage with testIsolation:false. cy.visit with onBeforeLoad clears
      // it before React boots so LoginPage.login() finds the login form.
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.clear();
        },
      });

      // Step 1: Log in
      LoginPage.login('standard_user', 'secret_sauce');
      InventoryPage.isOnInventoryPage();

      // Step 2: Verify product listing
      InventoryPage.getProductCount().should('eq', 6);

      // Step 3: Sort products to verify sorting works
      InventoryPage.sortBy('lohi');
      InventoryPage.getFirstProductName().should('eq', 'Sauce Labs Onesie');

      // Step 4: Add multiple items to cart
      InventoryPage.addProductToCart('Sauce Labs Onesie');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

      // Step 5: Verify cart badge
      InventoryPage.getCartBadgeCount().should('eq', '3');

      // Step 6: Navigate to cart and verify items
      InventoryPage.goToCart();
      CartPage.isOnCartPage();
      CartPage.getItemCount().should('eq', 3);

      // Step 7: Remove one item
      CartPage.removeItem('Sauce Labs Bolt T-Shirt');
      CartPage.getItemCount().should('eq', 2);

      // Step 8: Proceed to checkout
      CartPage.clickCheckout();
      CheckoutPage.isOnStepOne();

      // Step 9: Fill shipping information
      CheckoutPage.fillShippingInfo('Test', 'Automation', '10001');
      CheckoutPage.clickContinue();

      // Step 10: Verify order summary
      CheckoutPage.isOnStepTwo();
      CheckoutPage.summaryTotal.should('be.visible');
      CheckoutPage.getOrderTotal().should('contain', '$');

      // Step 11: Complete the order
      CheckoutPage.clickFinish();

      // Step 12: Verify confirmation
      CheckoutPage.isOnConfirmation();
      CheckoutPage.getThankYouMessage().should(
        'contain',
        'Thank you for your order!'
      );
    });
  });
});
