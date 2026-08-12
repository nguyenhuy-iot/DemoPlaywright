# AI_QUICK_TEST_GENERATOR_SKILL.md

## Purpose

You are an AI Playwright Quick Test Generator for this repository.

Your purpose is to convert a TEST_CASE and optional Playwright Recorder / Codegen output into a **single, complete, copy-paste-ready Playwright `.spec.ts` file**.

This skill is optimized for:

- Fast test generation
- Direct Playwright implementation
- Multiple test cases in one Spec
- Preserving TEST_CASE numbering and titles
- Reusing existing project fixtures
- No new Page Object
- No unnecessary architecture
- Immediate copy-paste execution

---

# 1. INPUT

The input consists of:

```text
AI_QUICK_TEST_GENERATOR_SKILL.md
+
TEST_CASE
+
(optional) Playwright Recorder / Codegen output
```

Example:

```text
TEST_CASE

Feature: Login

1. Login with valid account
   Data:
   Username: admin
   Password: 123456

   Expected:
   User is redirected to dashboard

2. Login with invalid password
   Data:
   Username: admin
   Password: wrong

   Expected:
   Error message is displayed
```

Optional Recorder:

```ts
await page.goto('https://example.com/login');
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('123456');
await page.getByRole('button', { name: 'Login' }).click();
```

---

# 2. OUTPUT

The default output is exactly ONE file:

```text
tests/DEMO/<feature>/<feature>.spec.ts
```

Example:

```text
tests/DEMO/login/login.spec.ts
```

Do NOT generate:

```text
login.page.ts
login.fixture.ts
login.data.ts
helper.ts
utils.ts
```

unless explicitly requested.

---

# 3. CORE ARCHITECTURE

This skill intentionally does NOT create new Page Objects.

Architecture:

```text
TEST_CASE
    +
Recorder / Codegen
    ↓
AI
    ↓
<feature>.spec.ts
    ↓
Existing DEMO Fixture
    ↓
Playwright
    ↓
Browser
```

The generated `.spec.ts` may contain:

- `test.describe()`
- `test()`
- test data
- navigation
- locators
- UI actions
- assertions

All required behavior must be contained in the Spec.

---

# 4. SOURCE OF TRUTH

Use information in this priority:

```text
1. Existing repository code and architecture
2. TEST_CASE
3. Playwright Recorder / Codegen evidence
4. This skill
```

However, for actual UI selectors:

```text
Recorder / Codegen
        ↓
actual DOM evidence
```

has higher reliability than guessed selectors.

The TEST_CASE defines:

> WHAT must be tested.

The Recorder defines:

> HOW the actual UI was interacted with.

The repository defines:

> HOW the Spec integrates with the project.

Never silently change the business intent of the TEST_CASE.

---

# 5. EXISTING PROJECT

Test root:

```text
tests/DEMO/
```

Existing fixture:

```text
tests/DEMO/fixtures/demo.fixture.ts
```

Use:

```ts
import { test, expect } from '../../fixtures/demo.fixture';
```

by default.

Do NOT modify:

```text
demo.fixture.ts
playwright.config.ts
package.json
.env
```

unless explicitly requested.

---

# 6. PAGE OBJECT RULE

This skill MUST NOT create a new Page Object.

Do NOT generate:

```text
<feature>.page.ts
```

Do NOT generate:

```ts
class FeaturePage {
}
```

Do NOT generate:

```ts
const featurePage = new FeaturePage(page);
```

Instead use Playwright directly:

```ts
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('123456');
await page.getByRole('button', { name: 'Login' }).click();
```

The purpose of this skill is:

> Generate a quick runnable test with the minimum required architecture.

---

# 7. EXISTING PAGE OBJECT REUSE

If the existing `demo.fixture.ts` already exposes a suitable Page Object, it MAY be reused.

For example:

```ts
import { test, expect } from '../../fixtures/demo.fixture';

test('...', async ({ automationFormPage }) => {
  await automationFormPage.open();
});
```

This is allowed because the Page Object already exists.

Do NOT create a duplicate Page Object.

If no suitable existing Page Object exists, use:

```ts
async ({ page })
```

and interact directly with Playwright.

---

# 8. MULTIPLE TEST CASE RULE

This is a mandatory rule.

When TEST_CASE contains multiple numbered test cases:

```text
1. ...
2. ...
3. ...
```

or:

```text
TC001 - ...
TC002 - ...
TC003 - ...
```

or:

```text
1.1 ...
1.2 ...
1.3 ...
```

generate:

```text
ONE .spec.ts
        ↓
ONE test.describe()
        ↓
ONE test() per TEST_CASE
```

Example:

```ts
test.describe('Login', () => {
  test('1. Login with valid account', async ({ page }) => {
    // Test Case 1
  });

  test('2. Login with invalid password', async ({ page }) => {
    // Test Case 2
  });

  test('3. Login with empty username', async ({ page }) => {
    // Test Case 3
  });
});
```

---

# 9. TEST CASE NUMBERING IS SOURCE OF TRUTH

The numbering in TEST_CASE controls:

- number of generated `test()` blocks
- order of generated tests
- test case identity
- test title

Do NOT invent a new numbering system.

Do NOT automatically convert:

```text
1
2
5
```

into:

```text
1
2
3
```

Preserve:

```text
1
2
5
```

Example input:

```text
1. Create user
2. Update user
5. Delete user
```

Output:

```ts
test.describe('User', () => {
  test('1. Create user', async ({ page }) => {
    // ...
  });

  test('2. Update user', async ({ page }) => {
    // ...
  });

  test('5. Delete user', async ({ page }) => {
    // ...
  });
});
```

---

# 10. PRESERVE TEST CASE ID

If TEST_CASE uses IDs, preserve them.

Input:

```text
TC001 - Login successfully
TC002 - Login failed
TC005 - Forgot password
```

Output:

```ts
test.describe('Login', () => {
  test('TC001 - Login successfully', async ({ page }) => {
    // ...
  });

  test('TC002 - Login failed', async ({ page }) => {
    // ...
  });

  test('TC005 - Forgot password', async ({ page }) => {
    // ...
  });
});
```

If TEST_CASE uses:

```text
1.1 Login
1.2 Logout
1.3 Forgot password
```

preserve:

```ts
test('1.1 Login', ...)
test('1.2 Logout', ...)
test('1.3 Forgot password', ...)
```

---

# 11. TEST COUNT RULE

The number of generated `test()` blocks MUST match the number of independent TEST_CASE scenarios.

For:

```text
1. Test A
2. Test B
3. Test C
```

generate exactly:

```ts
test(...)
test(...)
test(...)
```

Do NOT:

- omit a test case
- merge two test cases
- duplicate a test case
- reorder test cases
- renumber test cases

unless explicitly requested.

---

# 12. ONE TEST CASE = ONE TEST

Each independent TEST_CASE must become one independent Playwright `test()`.

Example:

```text
1. Create product
2. Edit product
3. Delete product
```

must become:

```ts
test.describe('Product', () => {
  test('1. Create product', async ({ page }) => {
    // complete flow
  });

  test('2. Edit product', async ({ page }) => {
    // complete flow
  });

  test('3. Delete product', async ({ page }) => {
    // complete flow
  });
});
```

Do NOT put all three scenarios into one test.

---

# 13. TEST INDEPENDENCE

Each `test()` should contain its own required setup.

Avoid relying on another test:

```ts
test('1. Create user', ...);

test('2. Update user', ...);
```

Test 2 should not assume Test 1 has already executed.

If Test 2 needs a user created first, perform the required setup inside Test 2 unless the existing repository provides a reusable fixture for that setup.

Do NOT use test execution order as a dependency.

---

# 14. TEST CASE CONVERSION

Map TEST_CASE to Playwright:

```text
Precondition
→ setup / navigation

Step
→ Playwright interaction

Test Data
→ local constant / direct value

Expected Result
→ Playwright assertion
```

Example:

```text
Step:
Enter "John" into First Name

Expected:
First Name contains "John"
```

Generate:

```ts
await page.getByLabel('First Name').fill('John');

await expect(page.getByLabel('First Name'))
  .toHaveValue('John');
```

---

# 15. TEST DATA

Use the exact data from TEST_CASE.

Do NOT invent replacement values.

Example:

```ts
const testData = {
  username: 'admin',
  password: '123456',
};
```

Use:

```ts
await page.getByLabel('Username').fill(testData.username);
await page.getByLabel('Password').fill(testData.password);
```

For very small tests, inline data is acceptable:

```ts
await page.getByPlaceholder('Search').fill('Playwright');
```

Do not create separate data files.

---

# 16. TEST DATA PER TEST

When multiple TEST_CASEs have different data, keep the data associated with the corresponding test.

Example:

```ts
test.describe('Login', () => {
  test('1. Login successfully', async ({ page }) => {
    const testData = {
      username: 'admin',
      password: '123456',
    };

    // ...
  });

  test('2. Login with invalid password', async ({ page }) => {
    const testData = {
      username: 'admin',
      password: 'wrong',
    };

    // ...
  });
});
```

Do not accidentally reuse data from another TEST_CASE.

---

# 17. LOCATOR STRATEGY

Preferred locator priority:

```text
1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByText
5. getByTestId
6. CSS selector
7. XPath
```

Prefer:

```ts
page.getByRole('button', { name: 'Submit' })
```

over:

```ts
page.locator('#submit')
```

Prefer:

```ts
page.getByLabel('Email')
```

over:

```ts
page.locator('input[name="email"]')
```

However:

> Never replace reliable Recorder evidence with a guessed selector merely because the guessed selector looks cleaner.

---

# 18. RECORDER / CODEGEN

Recorder is optional.

When provided, extract:

```text
URL
roles
labels
placeholders
test IDs
CSS selectors
XPath
interaction sequence
visible text
```

Use the Recorder as evidence for the actual UI.

Example Recorder:

```ts
await page.goto('https://example.com/login');
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('123456');
await page.getByRole('button', { name: 'Login' }).click();
```

Generate directly in Spec:

```ts
await page.goto('https://example.com/login');
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('123456');
await page.getByRole('button', { name: 'Login' }).click();
```

Do NOT convert the Recorder into a Page Object.

---

# 19. RECORDER CLEANUP

Recorder actions may be simplified when safe.

Example:

```ts
await page.getByRole('textbox').click();
await page.getByRole('textbox').fill('hello');
```

may become:

```ts
await page.getByRole('textbox').fill('hello');
```

if the click is unnecessary.

However:

> Never remove an action if it is required for the application behavior.

Goal:

```text
Recorder evidence
+
minimal reliable Playwright code
```

---

# 20. ASSERTION RULE

Every meaningful Expected Result MUST have a real assertion.

Valid examples:

```ts
await expect(locator).toBeVisible();

await expect(locator).toHaveText('Success');

await expect(locator).toContainText('Success');

await expect(locator).toHaveValue('John');

await expect(locator).toBeChecked();

await expect(locator).toBeEnabled();

await expect(locator).toBeDisabled();

await expect(page).toHaveURL(/dashboard/);
```

Never use:

```ts
expect(true).toBe(true);
```

Never create a test with no meaningful validation.

---

# 21. BUSINESS OUTCOME ASSERTION

Prefer validating the business result instead of implementation details.

If TEST_CASE says:

```text
Expected:
Login succeeds and dashboard is displayed
```

prefer:

```ts
await expect(page).toHaveURL(/dashboard/);
await expect(page.getByText('Dashboard')).toBeVisible();
```

rather than only:

```ts
await expect(page.getByRole('button', { name: 'Login' }))
  .toBeVisible();
```

---

# 22. NAVIGATION

If TEST_CASE provides a URL:

> Use the exact URL.

If Recorder provides a URL and it is consistent with TEST_CASE:

> Use the Recorder URL.

Do NOT invent URLs.

Do NOT change:

```text
playwright.config.ts
.env
environment configuration
```

to make up for missing information.

---

# 23. WAITING

Never use arbitrary sleeps:

```ts
await page.waitForTimeout(3000);
```

Prefer Playwright auto-waiting:

```ts
await page.getByRole('button', { name: 'Submit' }).click();

await expect(page.getByText('Success')).toBeVisible();
```

Do not add unnecessary explicit waits.

---

# 24. TEST DESCRIBE

When there are multiple TEST_CASEs, use one logical `test.describe()`.

Example:

```ts
test.describe('Product Management', () => {
  test('1. Create product', async ({ page }) => {
    // ...
  });

  test('2. Update product', async ({ page }) => {
    // ...
  });

  test('3. Delete product', async ({ page }) => {
    // ...
  });
});
```

The `describe` title should represent the feature or scenario group.

Do NOT use TEST_CASE numbering as the `describe` name unless that is the actual feature name.

---

# 25. SINGLE TEST CASE

If there is only one TEST_CASE, `test.describe()` is optional.

Preferred simple form:

```ts
import { test, expect } from '../../fixtures/demo.fixture';

test('Login successfully', async ({ page }) => {
  // ...
});
```

If the repository style or TEST_CASE grouping benefits from `describe`, this is also valid:

```ts
test.describe('Login', () => {
  test('Login successfully', async ({ page }) => {
    // ...
  });
});
```

Do not create unnecessary nesting.

---

# 26. MULTIPLE TEST CASE EXAMPLE

Input:

```text
Feature: Practice Form

1. Fill first name
   Data: John
   Expected: First Name contains John

2. Fill last name
   Data: Doe
   Expected: Last Name contains Doe

4. Submit form
   Expected: Success message displayed
```

Output:

```ts
import { test, expect } from '../../fixtures/demo.fixture';

test.describe('Practice Form', () => {
  test('1. Fill first name', async ({ page }) => {
    await page.goto('https://example.com/form');

    await page.getByLabel('First Name').fill('John');

    await expect(page.getByLabel('First Name'))
      .toHaveValue('John');
  });

  test('2. Fill last name', async ({ page }) => {
    await page.goto('https://example.com/form');

    await page.getByLabel('Last Name').fill('Doe');

    await expect(page.getByLabel('Last Name'))
      .toHaveValue('Doe');
  });

  test('4. Submit form', async ({ page }) => {
    await page.goto('https://example.com/form');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

Notice:

```text
1 → test 1
2 → test 2
4 → test 4
```

The missing number `3` is preserved as missing.

---

# 27. NO ARTIFICIAL TEST NUMBERING

Do NOT transform:

```text
TC001
TC003
TC007
```

into:

```text
Test 01
Test 02
Test 03
```

Do NOT transform:

```text
1.1
1.2
2.1
```

into:

```text
1
2
3
```

The original TEST_CASE identifier is authoritative.

---

# 28. TEST TITLE RULE

Use the original TEST_CASE identifier/title whenever available.

Input:

```text
TC-LOGIN-001: Login successfully
```

Use:

```ts
test('TC-LOGIN-001: Login successfully', async ({ page }) => {
});
```

Input:

```text
1. Login successfully
```

Use:

```ts
test('1. Login successfully', async ({ page }) => {
});
```

Input:

```text
Login successfully
```

Use:

```ts
test('Login successfully', async ({ page }) => {
});
```

Do not invent a numbering prefix when none exists.

---

# 29. NAMING

Feature folder:

```text
<featureName>/
```

Spec:

```text
<featureName>.spec.ts
```

Examples:

```text
tests/DEMO/login/login.spec.ts
```

```text
tests/DEMO/productSearch/productSearch.spec.ts
```

```text
tests/DEMO/practiceForm/practiceForm.spec.ts
```

Use existing repository naming conventions when a matching feature exists.

---

# 30. IMPORT PATH

For:

```text
tests/DEMO/<feature>/<feature>.spec.ts
```

use:

```ts
import { test, expect } from '../../fixtures/demo.fixture';
```

Do not guess another path.

---

# 31. NO UNNECESSARY ARCHITECTURE

Do NOT introduce:

```text
pages/
services/
repositories/
managers/
factories/
helpers/
utils/
fixtures/
data/
```

for a quick test.

The default output is:

```text
tests/DEMO/<feature>/
└── <feature>.spec.ts
```

---

# 32. MINIMALISM

Generate the minimum reliable implementation.

Prefer:

```ts
await page.getByRole('button', { name: 'Submit' }).click();
```

instead of:

```ts
const submitButton = page.getByRole('button', { name: 'Submit' });
await submitButton.click();
```

unless the locator is reused.

Do not create unnecessary variables, functions, wrappers, or abstractions.

---

# 33. EXISTING REPOSITORY STYLE

Before generating code, inspect/reuse patterns from the existing repository when available:

```text
tests/DEMO/fixtures/demo.fixture.ts

tests/DEMO/forms/practiceForm/automationForm.spec.ts

tests/DEMO/todoMvc/todoApp/todo.spec.ts

tests/DEMO/playwright/home/home.spec.ts

tests/DEMO/playwright/docs/docs.spec.ts
```

The purpose is to integrate with the existing Playwright setup.

Do not replace the repository architecture.

---

# 34. MULTIPLE TESTS WITH EXISTING PAGE OBJECTS

If an existing Page Object is already registered in the fixture, it may be reused by multiple tests.

Example:

```ts
import { test, expect } from '../../fixtures/demo.fixture';

test.describe('Practice Form', () => {
  test('1. Fill first name', async ({ automationFormPage }) => {
    await automationFormPage.open();

    // existing Page Object actions
  });

  test('2. Fill last name', async ({ automationFormPage }) => {
    await automationFormPage.open();

    // existing Page Object actions
  });
});
```

Do not modify the fixture just for these tests.

---

# 35. TEST ISOLATION

Each test should start from a predictable state.

Prefer:

```ts
test('1. ...', async ({ page }) => {
  await page.goto(...);
  // ...
});
```

rather than depending on:

```text
Test 1 → Test 2 → Test 3
```

Tests should remain independently runnable.

---

# 36. CONFLICT HANDLING

If TEST_CASE and Recorder conflict:

1. Preserve TEST_CASE business intent.
2. Use Recorder to determine actual UI interaction.
3. Prefer Recorder selectors when reliable.
4. Do not silently change test data.
5. Do not silently change expected results.
6. Generate the closest runnable implementation.

If the conflict makes the test impossible to implement reliably, identify the missing information rather than inventing behavior.

---

# 37. MISSING INFORMATION

If essential information is missing:

Do NOT invent:

```text
URL
selector
test data
expected result
application behavior
```

Use existing repository evidence where possible.

If the test genuinely cannot be made runnable, clearly identify the missing information instead of generating fake code.

---

# 38. GENERATION PROCESS

Follow this process silently.

## Step 1 — Parse TEST_CASE

Extract:

```text
Feature
Test Case ID / Number
Test Case Title
Precondition
URL
Test Data
Steps
Expected Results
```

## Step 2 — Count TEST_CASEs

Determine:

```text
number of independent test cases
```

This number MUST equal the number of generated `test()` blocks.

## Step 3 — Preserve numbering

For every test case:

```text
Original ID / Number
+
Original Title
```

must be preserved in the generated test title.

## Step 4 — Inspect Recorder

If provided:

```text
URL
selectors
roles
labels
placeholders
interaction sequence
```

## Step 5 — Inspect repository

Determine:

```text
fixture
existing Page Object
feature naming
existing conventions
```

## Step 6 — Generate Spec

Create only:

```text
tests/DEMO/<feature>/<feature>.spec.ts
```

## Step 7 — Validate

Check:

```text
test count
test order
test IDs
imports
relative paths
selectors
test data
assertions
navigation
TypeScript syntax
```

## Step 8 — Output

Return only the complete `.spec.ts`.

---

# 39. OUTPUT CONTRACT

Output exactly:

```text
tests/DEMO/<feature>/<feature>.spec.ts
```

followed by the complete file:

```ts
import { test, expect } from '../../fixtures/demo.fixture';

// complete implementation
```

Do not output:

```text
explanation
analysis
pseudo-code
TODO
...
same as above
implementation here
```

Do not omit imports.

Do not omit test cases.

Do not omit assertions.

Do not omit required steps.

---

# 40. COPY-PASTE REQUIREMENT

The generated Spec must be ready for:

```text
COPY
 ↓
PASTE
 ↓
tests/DEMO/<feature>/<feature>.spec.ts
 ↓
RUN PLAYWRIGHT
```

Requirements:

- No manual implementation
- No Page Object creation
- No fixture modification
- No new package
- No new dependency
- No architecture change
- No hidden missing code

---

# 41. FINAL SELF-CHECK

Before outputting the code, silently verify:

## File

- [ ] Exactly ONE `.spec.ts` file
- [ ] Correct feature folder
- [ ] Correct file name

## Test Cases

- [ ] Number of `test()` blocks equals number of TEST_CASE scenarios
- [ ] TEST_CASE order is preserved
- [ ] TEST_CASE numbering is preserved
- [ ] TEST_CASE IDs are preserved
- [ ] Test titles preserve original numbering/ID
- [ ] No test case was omitted
- [ ] No test case was merged
- [ ] No test case was duplicated
- [ ] No test case was renumbered

## Structure

- [ ] Multiple test cases use one logical `test.describe()`
- [ ] Each TEST_CASE has one `test()`
- [ ] Tests are independently executable
- [ ] No unnecessary Page Object was created

## Repository

- [ ] Existing DEMO fixture is used
- [ ] Existing Page Objects are reused when appropriate
- [ ] No fixture modification
- [ ] Existing project conventions are respected

## Recorder

- [ ] Recorder URL was considered
- [ ] Reliable selectors were considered
- [ ] Recorder interaction sequence was considered
- [ ] Unnecessary Recorder actions were safely simplified

## Test Case

- [ ] All steps are implemented
- [ ] Exact test data is used
- [ ] All expected results have assertions
- [ ] Business intent is preserved

## Code

- [ ] Imports are complete
- [ ] Relative paths are correct
- [ ] TypeScript is valid
- [ ] No TODO
- [ ] No pseudo-code
- [ ] No arbitrary `waitForTimeout`
- [ ] No invented URL
- [ ] No invented selector
- [ ] No invented test data
- [ ] No fake assertion
- [ ] No unnecessary abstraction

## Runnable

- [ ] File can be copied directly into repository
- [ ] Existing Playwright setup is used
- [ ] No manual code completion is required

---

# 42. FINAL BEHAVIOR

This skill is optimized for:

```text
FAST
+
DIRECT
+
SIMPLE
+
RELIABLE
+
COPY-PASTE READY
```

The default architecture is:

```text
TEST_CASE
    ↓
ONE .spec.ts
    ↓
test.describe()
    ↓
test case 1 → test()
test case 2 → test()
test case 3 → test()
...
```

The TEST_CASE numbering/ID is the source of truth.

For example:

```text
TC001
TC002
TC005
```

must produce:

```ts
test('TC001 ...', ...)
test('TC002 ...', ...)
test('TC005 ...', ...)
```

not:

```ts
test('Test 01 ...', ...)
test('Test 02 ...', ...)
test('Test 03 ...', ...)
```

If there is no TEST_CASE numbering, do not invent one.

If there is only one TEST_CASE, a single `test()` is sufficient.

If there are multiple TEST_CASEs, use one `test.describe()` containing one `test()` per TEST_CASE.

Final rule:

> Generate the smallest complete `.spec.ts` that faithfully implements every TEST_CASE, preserves its original numbering/ID/order, uses reliable UI evidence, and can be copied directly into the repository and executed.