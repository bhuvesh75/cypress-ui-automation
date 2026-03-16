# Contributing to cypress-ui-automation

Thank you for your interest in contributing to this project. This document outlines the conventions, workflow, and quality standards for contributions.

---

## Branch Naming Convention

All work must be done on a dedicated branch. Never commit directly to `main`.

| Type        | Pattern                        | Example                            |
| ----------- | ------------------------------ | ---------------------------------- |
| Feature     | `feat/<short-description>`     | `feat/add-product-detail-tests`    |
| Bug fix     | `fix/<short-description>`      | `fix/cart-badge-count-assertion`   |
| Refactor    | `refactor/<short-description>` | `refactor/page-object-selectors`   |
| Test        | `test/<short-description>`     | `test/add-accessibility-checks`    |
| Documentation | `docs/<short-description>`   | `docs/update-run-commands`         |
| Chore       | `chore/<short-description>`    | `chore/upgrade-cypress-version`    |

---

## Commit Message Format

Follow the conventional commits format:

```
type(scope): Brief summary (under 72 characters)

Problem: What issue or need prompted this change
Solution: How this commit addresses it
```

### Types

- `feat` — A new feature or test suite
- `fix` — A bug fix in tests or framework code
- `refactor` — Code restructuring without behaviour change
- `docs` — Documentation-only changes
- `test` — Adding or updating tests
- `chore` — Tooling, dependency updates, CI changes

### Scope

Use the relevant area: `login`, `cart`, `checkout`, `products`, `ci`, `pages`, `commands`, `config`.

### Examples

```
feat(checkout): Add negative test for empty postal code

Problem: Checkout step one did not have test coverage for the missing
postal code validation scenario.
Solution: Added a test that submits the form without a postal code and
asserts the appropriate error message is displayed.
```

```
fix(cart): Correct cart badge selector after DOM change

Problem: The cart badge selector stopped matching after the application
updated its CSS class from .cart_badge to .shopping_cart_badge.
Solution: Updated the selector in InventoryPage.js and CartPage.js to
use the new .shopping_cart_badge class.
```

---

## Pull Request Checklist

Before opening a pull request, verify the following:

- [ ] All existing tests pass locally (`npm run cy:run`)
- [ ] New tests follow the Given/When/Then JSDoc pattern
- [ ] New page methods have full JSDoc documentation
- [ ] Every JS file has the standard file header comment
- [ ] No hardcoded selectors appear in test files (use Page Objects)
- [ ] No hardcoded credentials appear in test files (use fixtures or env vars)
- [ ] Custom commands have full JSDoc with `@command`, `@description`, `@param`, and `@example`
- [ ] The PR description explains what changed and why
- [ ] Screenshots or logs are attached for UI-related changes

---

## Adding a New Test Suite

1. Create the spec file in the appropriate directory:
   - `cypress/e2e/smoke/` for quick sanity checks
   - `cypress/e2e/functional/` for feature-specific tests
   - `cypress/e2e/regression/` for comprehensive coverage

2. Add the standard file header to the top of the file.

3. Follow the Given/When/Then JSDoc pattern for every test:

   ```javascript
   /**
    * @test        Descriptive test name
    * @given       Precondition or starting state
    * @when        Action the user takes
    * @then        Expected outcome
    */
   it('should do the expected thing', () => {
     // test implementation
   });
   ```

4. If new page interactions are needed, add them to the relevant Page Object in `cypress/pages/`.

5. If the interaction is reusable across suites, consider adding a custom command in `cypress/support/commands.js`.

6. Run the full suite to verify nothing is broken: `npm run cy:run`.

---

## Adding a New Page Object

1. Create the file in `cypress/pages/`.
2. Extend `BasePage` to inherit common methods.
3. Add the standard file header comment.
4. Define element getters using Cypress `cy.get()` calls.
5. Define action methods that interact with those elements.
6. Add full JSDoc to every getter and method.
7. Export a singleton instance: `module.exports = new MyPage();`.

---

## Code Style

- Use `const` and `let` instead of `var`
- Use single quotes for strings
- Use semicolons at the end of statements
- Keep functions small and single-purpose
- Comment every non-trivial line of code
- Use descriptive variable and method names

---

## Questions

If you have questions about the contribution process, open an issue on the repository or reach out to the maintainer.
