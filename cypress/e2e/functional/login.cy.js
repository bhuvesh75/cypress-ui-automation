/**
 * @file        login.cy.js
 * @description Comprehensive test suite for the Sauce Demo login functionality.
 *              Covers valid credentials, invalid credentials, locked accounts,
 *              and empty field validation across all edge cases.
 * @purpose     Validates that the authentication gate works correctly for every
 *              user type and error condition, ensuring unauthorized users cannot
 *              access the application and valid users are not blocked.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const LoginPage = require('../../pages/LoginPage');
const InventoryPage = require('../../pages/InventoryPage');

/**
 * @suite       Login Functionality
 * @description Tests for the Sauce Demo login page covering positive and
 *              negative authentication scenarios.
 */
describe('Functional: Login Page', () => {
  /**
   * Navigate to the login page before each test to ensure a clean state.
   */
  beforeEach(() => {
    // WHY: Use cy.visit with onBeforeLoad to clear localStorage before React
    // boots up. onBeforeLoad runs synchronously before any page JavaScript,
    // so React sees no auth token and renders the login form (not an inventory
    // redirect). This avoids the DOMException / TypeError that cy.window().then()
    // and cy.clearLocalStorage() both throw when called after cy.session()
    // has left the browser in an about:blank-derived intermediate state under
    // testIsolation:false (Cypress 12+).
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    // Wait for the page to fully render before interacting with elements
    LoginPage.waitForPageLoad();
  });

  /**
   * @test        Valid login with standard_user credentials
   * @given       The user is on the Sauce Demo login page
   * @when        The user enters valid standard_user credentials and clicks Login
   * @then        The browser navigates to /inventory.html and the product list is visible
   */
  it('should log in successfully with valid credentials and land on inventory page', () => {
    // Load the valid user fixture to get the correct credentials
    cy.fixture('validUser').then((user) => {
      // Enter the username into the username field
      LoginPage.enterUsername(user.username);

      // Enter the password into the password field
      LoginPage.enterPassword(user.password);

      // Click the login button to submit the form
      LoginPage.clickLogin();
    });

    // Assert the URL has changed to the inventory page
    InventoryPage.isOnInventoryPage();

    // Assert the product list is rendered, confirming successful authentication
    InventoryPage.productList.should('be.visible');
  });

  /**
   * @test        Invalid login with wrong password
   * @given       The user is on the Sauce Demo login page
   * @when        The user enters a valid username but an incorrect password and clicks Login
   * @then        An error message is displayed indicating the credentials do not match
   */
  it('should display error message when password is incorrect', () => {
    // Enter a valid username
    LoginPage.enterUsername('standard_user');

    // Enter an incorrect password that does not match any account
    LoginPage.enterPassword('wrong_password');

    // Submit the login form
    LoginPage.clickLogin();

    // Assert the error message is visible
    LoginPage.errorMessage.should('be.visible');

    // Assert the error message text indicates a credential mismatch
    LoginPage.getErrorMessage().should(
      'contain',
      'Username and password do not match any user in this service'
    );
  });

  /**
   * @test        Locked out user receives appropriate error
   * @given       The user is on the Sauce Demo login page
   * @when        The user enters locked_out_user credentials and clicks Login
   * @then        An error message is displayed indicating the user is locked out
   */
  it('should display locked out error for locked_out_user', () => {
    // Load the locked user fixture
    cy.fixture('lockedUser').then((user) => {
      // Enter the locked user's username
      LoginPage.enterUsername(user.username);

      // Enter the locked user's password
      LoginPage.enterPassword(user.password);

      // Submit the login form
      LoginPage.clickLogin();
    });

    // Assert the error message is visible
    LoginPage.errorMessage.should('be.visible');

    // Assert the error message specifically mentions being locked out
    LoginPage.getErrorMessage().should('contain', 'locked out');
  });

  /**
   * @test        Empty username shows validation error
   * @given       The user is on the Sauce Demo login page
   * @when        The user leaves the username field empty, enters a password,
   *              and clicks Login
   * @then        An error message is displayed stating "Username is required"
   */
  it('should display error when username is empty', () => {
    // Enter only a password, leaving the username field empty
    LoginPage.enterPassword('secret_sauce');

    // Submit the form without a username
    LoginPage.clickLogin();

    // Assert the error message is visible
    LoginPage.errorMessage.should('be.visible');

    // Assert the error text specifies that the username is required
    LoginPage.getErrorMessage().should('contain', 'Username is required');
  });

  /**
   * @test        Empty password shows validation error
   * @given       The user is on the Sauce Demo login page
   * @when        The user enters a username but leaves the password field empty
   *              and clicks Login
   * @then        An error message is displayed stating "Password is required"
   */
  it('should display error when password is empty', () => {
    // Enter only a username, leaving the password field empty
    LoginPage.enterUsername('standard_user');

    // Submit the form without a password
    LoginPage.clickLogin();

    // Assert the error message is visible
    LoginPage.errorMessage.should('be.visible');

    // Assert the error text specifies that the password is required
    LoginPage.getErrorMessage().should('contain', 'Password is required');
  });
});
