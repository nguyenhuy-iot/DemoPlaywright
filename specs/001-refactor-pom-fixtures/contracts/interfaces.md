# Interface Contract: Test Fixtures

## Overview

This contract defines the interface between the Playwright Spec files and the Custom Fixtures. Spec files MUST import `test` and `expect` from `tests/fixtures` to access these pre-initialized Page Objects.

## Fixture Interface (`ProjectFixtures`)

```typescript
export type ProjectFixtures = {
  demoQAFormPage: DemoQAFormPage;
  playwrightHomePage: PlaywrightHomePage;
  todoPage: TodoPage;
};
```

## Usage Pattern

### Spec File Requirements

1. **Import**: `import { test, expect } from '../fixtures';`
2. **Access**: Destructure the required fixture in the test callback.
   ```typescript
   test('description', async ({ demoQAFormPage }) => {
     // use demoQAFormPage here
   });
   ```

### Page Object Requirements

1. **Methods**: Must be `async` and return `Promise<void>` or a specific data type.
2. **Encapsulation**: Private locators should be used where possible, though Playwright style often keeps them public for easy visibility checks in specs.
3. **Chaining**: Methods may return `this` to allow for a fluent interface (optional).
