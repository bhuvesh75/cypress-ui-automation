# cypress-ui-automation

![Cypress UI Tests](https://github.com/bhuvesh75/cypress-ui-automation/actions/workflows/cypress-ui.yml/badge.svg)

A production-grade end-to-end UI automation framework built with Cypress 13 and the Page Object Model design pattern. This framework targets the [Sauce Demo](https://www.saucedemo.com) web application and provides comprehensive test coverage for authentication, product browsing, cart management, and checkout flows. Test results are reported via Mochawesome with HTML and JSON output, and the full suite runs automatically in GitHub Actions CI/CD.

---

## Tech Stack

| Tool                       | Version | Purpose                            |
| -------------------------- | ------- | ---------------------------------- |
| Cypress                    | 13.10.0 | E2E test runner and assertion library |
| JavaScript (ES6+)         | —       | Test and framework language        |
| Page Object Model          | —       | Design pattern for maintainability |
| Mochawesome                | 7.1.3   | HTML and JSON test reporting       |
| Mochawesome Merge          | 4.3.0   | Combine multiple report JSON files |
| Mochawesome Report Generator | 6.2.0 | Generate HTML from merged JSON     |
| GitHub Actions             | —       | CI/CD pipeline                     |
| Node.js                    | 20+     | Runtime environment                |

---

## Folder Structure

```
cypress-ui-automation/
├── .github/
│   └── workflows/
│       └── cypress-ui.yml          # GitHub Actions CI pipeline
├── cypress/
│   ├── e2e/
│   │   ├── smoke/
│   │   │   └── smoke.cy.js         # Quick sanity checks
│   │   ├── functional/
│   │   │   ├── login.cy.js          # Login page test suite
│   │   │   ├── products.cy.js       # Product inventory test suite
│   │   │   ├── cart.cy.js           # Shopping cart test suite
│   │   │   └── checkout.cy.js       # Checkout flow test suite
│   │   └── regression/
│   │       └── fullRegression.cy.js # Full regression coverage
│   ├── fixtures/
│   │   ├── validUser.json           # Standard user credentials
│   │   ├── lockedUser.json          # Locked user credentials
│   │   └── products.json            # Product catalogue data
│   ├── pages/
│   │   ├── BasePage.js              # Abstract base page object
│   │   ├── LoginPage.js             # Login page selectors and actions
│   │   ├── InventoryPage.js         # Inventory page selectors and actions
│   │   ├── CartPage.js              # Cart page selectors and actions
│   │   └── CheckoutPage.js          # Checkout flow selectors and actions
│   ├── support/
│   │   ├── commands.js              # Custom Cypress commands
│   │   └── e2e.js                   # Global hooks and error handling
│   ├── utils/
│   │   └── helpers.js               # Utility functions
│   └── reports/                     # Generated test reports (gitignored)
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── CONTRIBUTING.md                  # Contribution guidelines
├── README.md                        # This file
├── cypress.config.js                # Cypress configuration
└── package.json                     # Project dependencies and scripts
```

---

## Prerequisites

- **Node.js** 20 or later
- **npm** 9 or later (ships with Node.js 20)
- A modern web browser (Chrome, Firefox, or Edge) for headed mode

---

## Setup Guide

1. **Clone the repository**

   ```bash
   git clone https://github.com/bhuvesh75/cypress-ui-automation.git
   cd cypress-ui-automation
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Configure environment variables** (optional)

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if you need to override the default base URL or credentials.

4. **Verify the installation**

   ```bash
   npx cypress verify
   ```

---

## Run Commands

| Command              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `npm run cy:open`    | Opens the Cypress Test Runner in interactive/headed mode            |
| `npm run cy:run`     | Runs all test suites in headless mode                              |
| `npm run cy:smoke`   | Runs only the smoke test suite (`cypress/e2e/smoke/`)              |
| `npm run cy:functional` | Runs only the functional test suites (`cypress/e2e/functional/`) |
| `npm run cy:regression` | Runs only the regression suite (`cypress/e2e/regression/`)      |
| `npm run cy:report`  | Merges Mochawesome JSON reports and generates an HTML report       |

### Running a single spec file

```bash
npx cypress run --spec 'cypress/e2e/functional/login.cy.js'
```

### Running with a specific browser

```bash
npx cypress run --browser chrome
```

---

## Test Coverage

### Smoke Tests (4 tests)
- Login page renders with all form elements
- Successful login navigates to inventory page
- Product catalogue displays expected item count
- Shopping cart icon is accessible

### Login Tests (5 tests)
- Valid login with standard_user credentials
- Invalid password shows error message
- Locked out user receives lockout error
- Empty username shows "Username is required" error
- Empty password shows "Password is required" error

### Product Tests (6 tests)
- Product list is visible with 6 items
- Sort A to Z places "Sauce Labs Backpack" first
- Sort Z to A places "Test.allTheThings() T-Shirt (Red)" first
- Sort price low to high places cheapest item first
- Sort price high to low places most expensive item first
- All expected product names are displayed

### Cart Tests (4 tests)
- Adding 2 items updates cart badge to "2"
- Removing 1 item decrements badge to "1"
- Removing all items hides the badge
- Continue Shopping returns to inventory page

### Checkout Tests (5 tests)
- Full checkout flow from cart to order confirmation
- Missing first name shows validation error
- Missing last name shows validation error
- Missing postal code shows validation error
- Order total is displayed on the summary page

### Regression Tests (18 tests)
- Authentication: 5 scenarios
- Product browsing: 6 scenarios
- Cart management: 5 scenarios
- Checkout flow: 3 scenarios
- End-to-end multi-item purchase journey: 1 scenario

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/cypress-ui.yml`) runs automatically on:

- **Push** to the `main` branch
- **Pull requests** targeting the `main` branch

### Pipeline steps:

1. Checkout the repository
2. Set up Node.js 20 with npm caching
3. Install dependencies with `npm ci`
4. Run all Cypress tests in headless mode
5. Generate the Mochawesome HTML report
6. Upload the HTML report as a build artifact
7. Upload test videos as a build artifact
8. Upload screenshots on failure as a build artifact

### Viewing reports:

After a workflow run completes, download the `mochawesome-report` artifact from the Actions tab to view the detailed HTML test report.

---

## Author

**Bhuvesh Yadav** — QA Lead | Lead SDET | Test Automation Architect

- GitHub: [https://github.com/bhuvesh75](https://github.com/bhuvesh75)
- Certifications: ISTQB CTAL-TA, ISTQB CTFL, Certified Scrum Master
- 8+ years of experience in Quality Assurance and Automation.

---

## License

This project is licensed under the MIT License. See the `package.json` for details.
