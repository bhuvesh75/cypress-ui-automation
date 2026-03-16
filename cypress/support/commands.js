/**
 * @file        commands.js
 * @description Custom Cypress commands that extend the cy object with
 *              reusable, application-specific actions such as login,
 *              cart manipulation, and checkout completion.
 * @purpose     Reduces boilerplate in test files by providing high-level
 *              commands that encapsulate multi-step user interactions.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

/**
 * @command     cy.login
 * @description Logs into the Sauce Demo application by visiting the home page,
 *              entering credentials into the login form, and submitting it.
 *              Waits for the inventory page to confirm a successful login.
 * @param       {string} username - The username to log in with.
 * @param       {string} password - The password to log in with.
 * @example     cy.login('standard_user', 'secret_sauce')
 */
Cypress.Commands.add('login', (username, password) => {
  // WHY: cy.session() with cacheAcrossSpecs: true caches the authenticated
  // browser state ONCE per entire cypress run. On every subsequent call in
  // the same run, Cypress restores the saved localStorage/cookies without
  // re-running the setup function — so saucedemo.com is visited only ONCE
  // to create the session, not once per test.
  cy.session([username, password], () => {
    // Full login flow — runs ONCE per cypress run, then the session state
    // (localStorage containing 'session-username') is cached to disk.
    cy.visit('/');
    cy.get('#user-name').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.get('#login-button').click();
    // Confirm the login succeeded before caching the session state.
    cy.url().should('include', '/inventory.html');
  }, {
    cacheAcrossSpecs: true,
    // WHY: No validate() callback. The previous design called cy.visit('/')
    // inside validate(), which runs on EVERY cy.session() call after restoring
    // the cached session. With 6 spec files and multiple beforeEach calls per
    // spec, validate() triggered many rapid cy.visit('/') requests to
    // saucedemo.com. saucedemo.com's CDN rate-limits consecutive page-load
    // requests from GitHub Actions IPs and returns 404 / connection refused
    // within the rate-limit window, causing 120s pageLoadTimeout failures.
    // When validate() timed out, Cypress invalidated the cached session and
    // re-ran setup(), causing ANOTHER cy.visit('/') — doubling the CDN hits
    // and compounding the rate-limit cascade. Removing validate() means
    // Cypress trusts the restored localStorage state without any additional
    // CDN requests. The cy.visit('/inventory.html') below then handles the
    // single navigation needed to land the test on the correct page.
  });
  // WHY: Navigate to the inventory page after session setup or restore.
  // With testIsolation:false, the browser's HTTP cache persists between tests
  // within the same spec (saucedemo.com serves with Cache-Control: max-age=600).
  // Only the FIRST test per spec file makes a live CDN request for
  // /inventory.html; all subsequent tests in the same spec hit the cache.
  // This gives at most 1 CDN request per spec file — well within the rate limit.
  cy.visit('/inventory.html');
});

/**
 * @command     cy.addToCart
 * @description Adds a product to the shopping cart by locating the inventory item
 *              with the matching name and clicking its "Add to cart" button.
 * @param       {string} productName - The exact display name of the product
 *                                     (e.g. "Sauce Labs Backpack").
 * @example     cy.addToCart('Sauce Labs Backpack')
 */
Cypress.Commands.add('addToCart', (productName) => {
  // Locate the product card that contains the target product name
  cy.get('.inventory_item')
    .contains('.inventory_item_name', productName)
    // Traverse up to the parent inventory_item container
    .parents('.inventory_item')
    // Find the Add to Cart button within this specific product card
    .find('button')
    .contains('Add to cart')
    // Click the button to add the product to the cart
    .click();
});

/**
 * @command     cy.removeFromCart
 * @description Removes a product from the shopping cart by locating the inventory
 *              item with the matching name and clicking its "Remove" button.
 *              Works on both the inventory page and the cart page.
 * @param       {string} productName - The exact display name of the product to remove.
 * @example     cy.removeFromCart('Sauce Labs Backpack')
 */
Cypress.Commands.add('removeFromCart', (productName) => {
  // Locate the item container that holds the target product name
  cy.contains('.inventory_item_name', productName)
    // Traverse up to the nearest parent that contains the Remove button
    .parents('.inventory_item, .cart_item')
    // Find and click the Remove button within that container
    .find('button')
    .contains('Remove')
    .click();
});

/**
 * @command     cy.completeCheckout
 * @description Performs the full checkout flow starting from the cart page:
 *              clicks Checkout, fills in shipping information, clicks Continue
 *              to reach the summary, and clicks Finish to place the order.
 *              After execution the browser should be on the confirmation page.
 * @param       {string} firstName - The buyer's first name for shipping info.
 * @param       {string} lastName  - The buyer's last name for shipping info.
 * @param       {string} zip       - The buyer's postal/ZIP code for shipping info.
 * @example     cy.completeCheckout('John', 'Doe', '12345')
 */
Cypress.Commands.add('completeCheckout', (firstName, lastName, zip) => {
  // Navigate to the cart page by clicking the cart icon
  cy.get('.shopping_cart_link').click();

  // Verify we landed on the cart page before proceeding
  cy.url().should('include', '/cart.html');

  // Click the Checkout button to begin the checkout flow
  cy.get('[data-test="checkout"]').click();

  // Verify we are on checkout step one (shipping information)
  cy.url().should('include', '/checkout-step-one.html');

  // Fill in the first name field
  cy.get('[data-test="firstName"]').clear().type(firstName);

  // Fill in the last name field
  cy.get('[data-test="lastName"]').clear().type(lastName);

  // Fill in the postal code field
  cy.get('[data-test="postalCode"]').clear().type(zip);

  // Click Continue to advance to the order summary page
  cy.get('[data-test="continue"]').click();

  // Verify we are on checkout step two (order summary)
  cy.url().should('include', '/checkout-step-two.html');

  // Click Finish to complete the purchase
  cy.get('[data-test="finish"]').click();

  // Verify we landed on the order confirmation page
  cy.url().should('include', '/checkout-complete.html');
});

/**
 * @command     cy.verifyProductCount
 * @description Asserts that the inventory page displays the expected number
 *              of product items. Useful for smoke tests and data integrity checks.
 * @param       {number} expectedCount - The expected number of product items.
 * @example     cy.verifyProductCount(6)
 */
Cypress.Commands.add('verifyProductCount', (expectedCount) => {
  // Count all inventory_item elements and assert against the expected value
  cy.get('.inventory_item').should('have.length', expectedCount);
});
