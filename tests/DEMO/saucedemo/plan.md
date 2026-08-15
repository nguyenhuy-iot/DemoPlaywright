# SauceDemo Test Suite Implementation Plan

This document outlines the step-by-step implementation of the SauceDemo test module (Phase 1) under `tests/DEMO/saucedemo/`, ensuring compliance with project standards, TypeScript types, and architectural boundaries.

---

## Progress Checklist

- [x] **Phase 1: Setup & Directory Structure**
  - [x] Create directory structure for SauceDemo test module.
  - [x] Create test data file: `tests/DEMO/saucedemo/data/users.ts`.

- [x] **Phase 2: Login Page Object & Specs**
  - [x] Implement `tests/DEMO/saucedemo/login/login.page.ts` extending `BasePage`.
  - [x] Implement `tests/DEMO/saucedemo/login/login.spec.ts` (successful login cases).
  - [x] Implement `tests/DEMO/saucedemo/login/login.error.spec.ts` (error login cases).

- [x] **Phase 3: Inventory Page Object & Specs**
  - [x] Implement `tests/DEMO/saucedemo/inventory/inventory.page.ts` extending `BasePage`.
  - [x] Implement `tests/DEMO/saucedemo/inventory/inventory.spec.ts` using `beforeEach` to login.

- [ ] **Phase 4: Validation & Quality Control**
  - [ ] Run TypeScript type check (`npx tsc --noEmit`).
  - [ ] Run ESLint check (`npx eslint .`).
  - [ ] Run Prettier formatting check (`npx prettier --check .`).
  - [ ] Run SauceDemo tests specifically to ensure all pass.
  - [ ] Update documentation / Troubleshooting (if any errors encountered).

---

## Detailed Implementation Strategy

### 1. File & Directory Structure
We will create the following directories and files:
```text
tests/DEMO/saucedemo/
├── plan.md (This file)
├── data/
│   └── users.ts
├── login/
│   ├── login.page.ts
│   ├── login.spec.ts
│   └── login.error.spec.ts
└── inventory/
    ├── inventory.page.ts
    └── inventory.spec.ts
```

### 2. Test Data (`data/users.ts`)
- Target: Contains username/password mapping for SauceDemo users.
- Users:
  - `standard_user`
  - `locked_out_user`
  - `problem_user`
  - `performance_glitch_user`
- Password: `secret_sauce`
- Strictly avoid hardcoding credentials in the spec files.

### 3. Login Components
- **`login.page.ts`**:
  - Class `SauceDemoLoginPage` extends `BasePage`.
  - Locators:
    - Username input: `[data-test="username"]`
    - Password input: `[data-test="password"]`
    - Login button: `[data-test="login-button"]`
    - Error container: `[data-test="error"]`
  - Methods:
    - `navigate()`: Navigates to `https://www.saucedemo.com/` (since `baseURL` in config is for playwright.dev).
    - `login(username, password)`: Fills fields and clicks login.
    - `getErrorMessage()`: Returns error message text.
- **`login.spec.ts`**:
  - Positive scenarios using `standard_user`, `problem_user`, and `performance_glitch_user`.
  - Verifies successful navigation to inventory page.
- **`login.error.spec.ts`**:
  - Negative scenario using `locked_out_user`.
  - Verifies error message displayed: "Epic sadface: Sorry, this user has been locked out."

### 4. Inventory Components
- **`inventory.page.ts`**:
  - Class `SauceDemoInventoryPage` extends `BasePage`.
  - Locators:
    - Inventory container / title: `.title` (contains text "Products") or similar.
    - Product items: `.inventory_item`
    - Add-to-cart button (first product or specific product): `[data-test^="add-to-cart"]`
    - Cart badge: `.shopping_cart_badge`
  - Methods:
    - `getProductsCount()`: Returns the number of product items on the page.
    - `addProductToCart(indexOrName)`: Clicks "Add to cart" for a product.
    - `getCartBadgeCount()`: Returns text of the cart badge.
    - `getTitleText()`: Returns the page/header title.
- **`inventory.spec.ts`**:
  - `beforeEach` block: Navigates to the page and logs in with `standard_user`.
  - Test 1: Page displays correctly (title, product listing visible, products count > 0).
  - Test 2: Adding a product to cart updates the cart badge.

### 5. Verification Command Plan
Commands to execute for validating code correctness:
1. `npx tsc --noEmit` - Type checking
2. `npx eslint tests/DEMO/saucedemo/` - Linting SauceDemo files specifically or the whole project.
3. `npx prettier --check tests/DEMO/saucedemo/` - Checking code formatting.
4. `npx playwright test tests/DEMO/saucedemo/` - Run the newly implemented tests.
