/**
 * @file        LoginPage.js
 * @description Page Object for the Sauce Demo login screen.
 *              Centralises all selectors and actions for login flows
 *              so tests never reference raw CSS selectors directly.
 * @purpose     Encapsulates the login page's DOM structure behind a clean API,
 *              making tests resilient to UI changes — only this file needs
 *              updating when selectors change.
 * @url         https://www.saucedemo.com
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const BasePage = require('./BasePage');

/**
 * @page        LoginPage
 * @description Page Object for the Sauce Demo login screen.
 *              Centralises all selectors and actions for login flows
 *              so tests never reference raw CSS selectors directly.
 * @url         https://www.saucedemo.com
 */
class LoginPage extends BasePage {
  // ─── ELEMENT GETTERS ───────────────────────────────────────────────

  /**
   * Getter for the username input field.
   * The application renders this as <input id="user-name">.
   *
   * @returns {Cypress.Chainable} The username input element.
   */
  get usernameField() {
    // Input field ID defined in the application's HTML
    return cy.get('#user-name');
  }

  /**
   * Getter for the password input field.
   * The application renders this as <input id="password">.
   *
   * @returns {Cypress.Chainable} The password input element.
   */
  get passwordField() {
    // Password field uses a standard ID assigned by the application
    return cy.get('#password');
  }

  /**
   * Getter for the Login button.
   * The application renders this as <input id="login-button" type="submit">.
   *
   * @returns {Cypress.Chainable} The login submit button element.
   */
  get loginButton() {
    // Login button is an input of type submit with this ID
    return cy.get('#login-button');
  }

  /**
   * Getter for the error message container that appears after a failed login.
   * The application wraps error text inside an <h3> within the error container.
   *
   * @returns {Cypress.Chainable} The error message element.
   */
  get errorMessage() {
    // Error messages are rendered inside an h3 within the error-message-container
    return cy.get('[data-test="error"]');
  }

  // ─── ACTION METHODS ────────────────────────────────────────────────

  /**
   * Types the given username into the username input field.
   * Clears any pre-existing text before typing.
   *
   * @param {string} username - The username to enter.
   * @returns {void}
   */
  enterUsername(username) {
    // Clear existing value to prevent concatenation, then type the new username
    this.usernameField.clear().type(username);
  }

  /**
   * Types the given password into the password input field.
   * Clears any pre-existing text before typing.
   *
   * @param {string} password - The password to enter.
   * @returns {void}
   */
  enterPassword(password) {
    // Clear existing value to prevent concatenation, then type the new password
    this.passwordField.clear().type(password);
  }

  /**
   * Clicks the Login button to submit the login form.
   *
   * @returns {void}
   */
  clickLogin() {
    // Trigger form submission by clicking the login button
    this.loginButton.click();
  }

  /**
   * Convenience method that performs a full login sequence:
   * enters the username, enters the password, and clicks Login.
   *
   * @param {string} username - The username to log in with.
   * @param {string} password - The password to log in with.
   * @returns {void}
   */
  login(username, password) {
    // Navigate to the login page before entering credentials
    this.visit('/');
    // Fill in credentials and submit the form
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  /**
   * Retrieves the text content of the error message displayed after a
   * failed login attempt. The caller can chain standard Cypress assertions
   * (e.g. .should('contain', 'locked out')).
   *
   * @returns {Cypress.Chainable<string>} A chainable yielding the error text.
   */
  getErrorMessage() {
    // Return the visible text inside the error banner for assertion chaining
    return this.errorMessage.invoke('text');
  }

  /**
   * Asserts that the browser is currently on the login page by checking
   * the URL does not contain '/inventory' and the username field is visible.
   *
   * @returns {void}
   */
  isOnLoginPage() {
    // Verify URL is at the root and the login form is rendered
    this.getUrl().should('not.include', '/inventory');
    this.usernameField.should('be.visible');
  }
}

module.exports = new LoginPage();
