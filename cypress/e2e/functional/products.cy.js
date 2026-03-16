/**
 * @file        products.cy.js
 * @description Comprehensive test suite for the Sauce Demo product inventory page.
 *              Validates product listing, sorting by name and price, product count,
 *              and API interception with fixture-based mocking.
 * @purpose     Ensures the product catalogue renders correctly, sort controls
 *              reorder items as expected, and the UI gracefully handles
 *              mocked API responses.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

const InventoryPage = require('../../pages/InventoryPage');

/**
 * @suite       Product Inventory
 * @description Tests for the product listing page covering display,
 *              sorting, and data integrity.
 */
describe('Functional: Product Inventory Page', () => {
  /**
   * Log in with valid credentials before each test to land on the inventory page.
   * Uses cy.login custom command for brevity.
   */
  beforeEach(() => {
    // Authenticate and navigate to the inventory page
    cy.login('standard_user', 'secret_sauce');

    // Confirm we are on the inventory page before running assertions
    InventoryPage.isOnInventoryPage();
  });

  /**
   * @test        Product list is visible and contains 6 items
   * @given       User is logged in and on the inventory page
   * @when        The inventory page loads completely
   * @then        The product list is visible and displays exactly 6 product items
   */
  it('should display the product list with 6 items', () => {
    // Load the products fixture for the expected count
    cy.fixture('products').then((products) => {
      // Assert the product list container is visible
      InventoryPage.productList.should('be.visible');

      // Assert the exact number of product items matches the expected count
      InventoryPage.getProductCount().should('eq', products.expectedCount);
    });
  });

  /**
   * @test        Sort A to Z places "Sauce Labs Backpack" first
   * @given       User is logged in and on the inventory page
   * @when        User selects the "Name (A to Z)" sort option
   * @then        The first product displayed is "Sauce Labs Backpack"
   */
  it('should sort products A to Z correctly', () => {
    // Select the A-to-Z sort option from the dropdown
    InventoryPage.sortBy('az');

    // Load the fixture to get the expected first alphabetical product
    cy.fixture('products').then((products) => {
      // Assert the first product name matches the alphabetically first product
      InventoryPage.getFirstProductName().should(
        'eq',
        products.firstAlphabetically
      );
    });
  });

  /**
   * @test        Sort Z to A places "Test.allTheThings() T-Shirt (Red)" first
   * @given       User is logged in and on the inventory page
   * @when        User selects the "Name (Z to A)" sort option
   * @then        The first product displayed is "Test.allTheThings() T-Shirt (Red)"
   */
  it('should sort products Z to A correctly', () => {
    // Select the Z-to-A sort option from the dropdown
    InventoryPage.sortBy('za');

    // Load the fixture to get the expected last alphabetical product
    cy.fixture('products').then((products) => {
      // Assert the first product name matches the alphabetically last product
      InventoryPage.getFirstProductName().should(
        'eq',
        products.lastAlphabetically
      );
    });
  });

  /**
   * @test        Sort Price low to high places cheapest item first
   * @given       User is logged in and on the inventory page
   * @when        User selects the "Price (low to high)" sort option
   * @then        The first product displayed is "Sauce Labs Onesie" (cheapest)
   */
  it('should sort products by price low to high correctly', () => {
    // Select the low-to-high price sort option
    InventoryPage.sortBy('lohi');

    // Load the fixture to get the expected cheapest product
    cy.fixture('products').then((products) => {
      // Assert the first product name matches the cheapest product
      InventoryPage.getFirstProductName().should('eq', products.cheapest);
    });
  });

  /**
   * @test        Sort Price high to low places most expensive item first
   * @given       User is logged in and on the inventory page
   * @when        User selects the "Price (high to low)" sort option
   * @then        The first product displayed is "Sauce Labs Fleece Jacket" (most expensive)
   */
  it('should sort products by price high to low correctly', () => {
    // Select the high-to-low price sort option
    InventoryPage.sortBy('hilo');

    // Load the fixture to get the expected most expensive product
    cy.fixture('products').then((products) => {
      // Assert the first product name matches the most expensive product
      InventoryPage.getFirstProductName().should(
        'eq',
        products.mostExpensive
      );
    });
  });

  /**
   * @test        Intercept inventory API and verify UI renders product names
   * @given       User is about to navigate to the inventory page
   * @when        The page loads and the product data renders
   * @then        Each product name from the fixture is visible on the page
   */
  it('should display all expected product names on the page', () => {
    // Load the products fixture to get the list of expected product names
    cy.fixture('products').then((products) => {
      // Iterate through each expected product name and verify it exists on the page
      products.items.forEach((productName) => {
        // Assert each product name text is present somewhere in the DOM
        cy.contains('.inventory_item_name', productName).should('be.visible');
      });
    });
  });
});
