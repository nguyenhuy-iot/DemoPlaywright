# Data Model: Refactor POM & Fixtures

## Test Data Schema (`tests/test-data/users.json`)

| Field                 | Type     | Description                     |
| --------------------- | -------- | ------------------------------- |
| `validUser`           | `Object` | Data for DemoQA Form submission |
| `validUser.firstName` | `String` | First name (e.g., "John")       |
| `validUser.lastName`  | `String` | Last name (e.g., "Doe")         |
| `validUser.email`     | `String` | Email address                   |
| `validUser.mobile`    | `String` | 10-digit phone number           |
| `validUser.address`   | `String` | Current street address          |

## Page Object Hierarchy

### BasePage (`tests/pages/base.page.ts`)

- `page`: Playwright `Page` object
- `navigateTo(path)`: Go to a URL
- `waitForElement(locator)`: Wait for visibility

### DemoQAFormPage (`tests/pages/demoqa-form.page.ts`)

- `firstNameInput`: Locator
- `lastNameInput`: Locator
- `emailInput`: Locator
- `genderMaleRadio`: Locator
- `mobileInput`: Locator
- `hobbiesSportsCheckbox`: Locator
- `addressInput`: Locator
- `submitButton`: Locator
- `login(userData)`: Fill and submit form

### PlaywrightHomePage (`tests/pages/playwright-home.page.ts`)

- `getStartedLink`: Locator
- `clickGetStarted()`: Action

### TodoPage (`tests/pages/todo.page.ts`)

- `todoInput`: Locator
- `todoItems`: Locator
- `addTodo(text)`: Action
- `deleteTodo(index)`: Action

## Fixture Contract (`tests/fixtures/base.fixture.ts`)

| Fixture Name         | Type                 | Description                     |
| -------------------- | -------------------- | ------------------------------- |
| `demoQAFormPage`     | `DemoQAFormPage`     | Injected POM for DemoQA Form    |
| `playwrightHomePage` | `PlaywrightHomePage` | Injected POM for Playwright Dev |
| `todoPage`           | `TodoPage`           | Injected POM for TodoMVC        |
