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
  // browser state once per run. Without it, every test does a fresh login
  // by visiting saucedemo.com, and saucedemo.com's CDN rate-limits consecutive
  // requests from GitHub Actions IPs — causing 120s timeouts.
  cy.session([username, password], () => {
    // Full login flow — runs once per run, then cached
    cy.visit('/');
    cy.get('#user-name').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.get('#login-button').click();
    // Wait for navigation to confirm login succeeded before caching session
    cy.url().should('include', '/inventory.html');
  }, {
    cacheAcrossSpecs: true,
    validate() {
      // WHY: validate() replaces the outer cy.visit('/') that previously sat
      // after cy.session(). The old design caused two back-to-back CDN requests
      // on session CREATION: one inside the setup function, and one immediately
      // after cy.session() returned — triggering saucedemo.com's CDN rate limit
      // from GitHub Actions IPs and causing 120s pageLoadTimeout failures.
      // Moving the navigation here fixes it: during session creation the setup's
      // cy.visit('/') populates the browser cache (Cache-Control: max-age=600);
      // validate then runs cy.visit('/') against that same cache — a cache hit,
      // no second CDN request. On subsequent session restores the cache is still
      // warm (within the same spec, testIsolation:false preserves it), so
      // validate also hits the cache. After validate succeeds, Cypress leaves
      // the browser on /inventory.html, so no outer cy.visit() is needed at all.
      cy.visit('/');
      cy.url().should('include', '/inventory.html');
    },
  });
  // WHY: No cy.visit('/') here — validate() handles navigation to inventory
  // and the browser is already on /inventory.html when cy.session() returns.
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
