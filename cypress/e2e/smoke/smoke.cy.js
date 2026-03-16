/**
 * @file        smoke.cy.js
 * @description Quick sanity checks to verify the Sauce Demo application is
 *              accessible and core functionality (login, inventory) works.
 *              These tests are designed to run fast and catch catastrophic
 *              failures before the full regression suite executes.
 * @purpose     Provides a lightweight gate that confirms the application is
 *              up and the critical happy path is functional, suitable for
 *              post-deployment verification and CI pipeline fast-feedback loops.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const LoginPage = require('../../pages/LoginPage');
const InventoryPage = require('../../pages/InventoryPage');

/**
 * @suite       Smoke Tests
 * @description Quick sanity checks to verify the application is up
 *              and core functionality is accessible.
 */
describe('Smoke: Application Sanity Checks', () => {
  /**
   * WHY: With testIsolation:false, auth from cy.login() in test N persists
   * into test N+1. cy.visit with onBeforeLoad clears localStorage before React
   * reads it, so the login page renders for tests that need it. This avoids
   * the DOMException / TypeError that cy.window().then() throws after
   * cy.session() leaves the browser in an intermediate state (Cypress 12+).
   */
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  /**
   * @test        Login page renders correctly
   * @given       The Sauce Demo application is deployed and accessible
   * @when        User navigates to the base URL
   * @then        Login form is visible with username field, password field,
   *              and login button
   */
  it('should render the login page with all form elements', () => {
    // Navigate to the application root
    LoginPage.visit('/');

    // Verify the page has fully loaded
    LoginPage.waitForPageLoad();

    // Assert the username input field is visible and ready for input
    LoginPage.usernameField.should('be.visible');

    // Assert the password input field is visible and ready for input
    LoginPage.passwordField.should('be.visible');

    // Assert the login button is visible and clickable
    LoginPage.loginButton.should('be.visible');
  });

  /**
   * @test        Successful login lands on inventory page
   * @given       The Sauce Demo application is deployed and accessible
   * @when        User logs in with valid standard_user credentials
   * @then        Browser navigates to /inventory.html and the product list is visible
   */
  it('should navigate to inventory page after successful login', () => {
    // Load valid user credentials from the fixture file
    cy.fixture('validUser').then((user) => {
      // Perform login with fixture-provided credentials
      LoginPage.login(user.username, user.password);
    });

    // Assert the URL has changed to the inventory page
    InventoryPage.isOnInventoryPage();

    // Assert the product list container is rendered and visible
    InventoryPage.productList.should('be.visible');
  });

  /**
   * @test        Product catalogue displays expected number of items
   * @given       User is logged in and on the inventory page
   * @when        The inventory page finishes loading
   * @then        Exactly 6 product items are displayed
   */
  it('should display the correct number of products on inventory page', () => {
    // Log in with valid credentials to reach the inventory page
    cy.fixture('validUser').then((user) => {
      LoginPage.login(user.username, user.password);
    });

    // Load the products fixture for the expected count
    cy.fixture('products').then((products) => {
      // Assert the number of displayed products matches the expected count
      InventoryPage.getProductCount().should('eq', products.expectedCount);
    });
  });

  /**
   * @test        Shopping cart icon is accessible from inventory page
   * @given       User is logged in and on the inventory page
   * @when        The inventory page has loaded
   * @then        The shopping cart link is visible in the header
   */
  it('should display the shopping cart icon on inventory page', () => {
    // Log in to reach the inventory page
    cy.fixture('validUser').then((user) => {
      LoginPage.login(user.username, user.password);
    });

    // Assert the cart link/icon is visible in the top navigation
    InventoryPage.cartLink.should('be.visible');
  });
});
