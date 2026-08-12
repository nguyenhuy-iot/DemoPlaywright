# AI_TEST_GENERATOR_SKILL.md

## Purpose

You are an AI Playwright Test Generator for this repository.

Input:

```text
AI_TEST_GENERATOR_SKILL.md
+
TEST_CASE
+
(optional) Playwright Recorder / Codegen output
```

Output:

```text
tests/DEMO/<feature>/<feature>.page.ts
tests/DEMO/<feature>/<feature>.spec.ts
```

The generated code must be complete, copy-paste ready, and follow the existing project architecture.

Primary goal:

> Generate Playwright tests that can be copied into this repository and run without manual code changes.

---

# 1. SOURCE OF TRUTH

Use the inputs in this priority:

1. Existing repository code and architecture
2. Playwright Recorder / Codegen output, when provided
3. TEST_CASE
4. This skill's rules

Do not invent project conventions when an existing example establishes the convention.

The TEST_CASE defines WHAT must be tested.

The Recorder / Codegen defines reliable UI interaction evidence: URL, selectors, roles, labels, text, and action sequence.

The existing repository defines HOW the test must be structured.

---

# 2. EXISTING PROJECT ARCHITECTURE

Test root:

```text
tests/DEMO/
```

Current structure:

```text
tests/DEMO/
├── fixtures/
│   └── demo.fixture.ts
│
├── forms/
│   └── practiceForm/
│       ├── automationForm.page.ts
│       └── automationForm.spec.ts
│
├── playwright/
│   ├── home/
│   │   ├── home.page.ts
│   │   └── home.spec.ts
│   └── docs/
│       ├── docs.page.ts
│       └── docs.spec.ts
│
└── todoMvc/
    └── todoApp/
        ├── todo.page.ts
        └── todo.spec.ts
```

New feature:

```text
tests/DEMO/<feature>/
├── <feature>.page.ts
└── <feature>.spec.ts
```

The normal output is exactly TWO files.

Do not create additional files unless explicitly required.

---

# 3. ARCHITECTURE RULE

Use this architecture:

```text
TEST_CASE
    +
RECORDER / CODEGEN
    ↓
AI
    ↓
.spec.ts
    ↓
Page Object
    ↓
BasePage / Playwright
    ↓
Browser
```

Responsibilities:

### `.spec.ts`

Contains:

- test scenario
- business flow
- test data
- assertions
- calls to Page Object methods

### `.page.ts`

Contains:

- locators
- UI interaction
- navigation
- reusable page-level actions
- page-level assertions when appropriate

The Spec describes WHAT the user is doing.

The Page Object describes HOW the browser performs it.

---

# 4. PAGE OBJECT RULES

New Page Objects must follow the existing project pattern.

Existing Page Objects use:

```ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../shared/pages/base.page';
```

and:

```ts
export class ExamplePage extends BasePage {
  readonly exampleInput: Locator;

  constructor(page: Page) {
    super(page);

    this.exampleInput = page.getByPlaceholder('Example');
  }
}
```

Rules:

- Extend the existing `BasePage`.
- Declare important locators as `readonly`.
- Initialize locators in the constructor.
- Use Playwright Locator objects.
- Put UI actions in the Page Object.
- Prefer meaningful business-level methods.
- Keep methods small and reusable.
- Do not create unnecessary abstractions.
- Do not create another Page Object framework.

Example:

```ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../shared/pages/base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open() {
    await this.page.goto('https://example.com/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginSuccess() {
    await expect(this.page.getByText('Welcome')).toBeVisible();
  }
}
```

---

# 5. SPEC RULES

Use the existing DEMO fixture:

```ts
import { test, expect } from '../../fixtures/demo.fixture';
```

The existing fixture extends Playwright's `test` and re-exports `expect`.

Use it by default.

Example:

```ts
import { test, expect } from '../../fixtures/demo.fixture';

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    // test flow
  });
});
```

When a Page Object is created but is not registered in the fixture, it is acceptable to instantiate it from the existing `page` fixture:

```ts
import { test } from '../../fixtures/demo.fixture';
import { LoginPage } from './login.page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('user', 'password');
  await loginPage.expectLoginSuccess();
});
```

This allows a new feature to be added using only:

```text
<feature>.page.ts
<feature>.spec.ts
```

Do NOT modify `demo.fixture.ts` unless the task explicitly requires fixture injection or an existing project pattern clearly requires it.

---

# 6. FIXTURE REUSE

Existing `demo.fixture.ts` provides project Page Objects and `evidence`.

Current registered Page Objects include:

```text
todoMvcPage
playwrightDocsPage
playwrightHomePage
automationFormPage
evidence
```

If the TEST_CASE targets one of these existing features:

- reuse the existing fixture
- do not create a duplicate Page Object
- do not create a duplicate fixture

If a new feature is required, prefer:

```ts
const featurePage = new FeaturePage(page);
```

instead of modifying the shared fixture.

---

# 7. LOCATOR STRATEGY

When Recorder / Codegen is provided, use it as the primary evidence for locators.

Do not blindly copy Recorder code into the Spec.

Convert Recorder interactions into Page Object locators and methods.

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

> Do not replace a reliable Recorder selector with a guessed selector merely because the guessed selector looks cleaner.

The actual application DOM has priority.

---

# 8. PLAYWRIGHT RECORDER / CODEGEN

Recorder input is OPTIONAL.

When provided, treat it as browser evidence.

Example Recorder:

```ts
await page.goto('https://example.com/login');
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('123456');
await page.getByRole('button', { name: 'Login' }).click();
```

Convert it into:

### Page Object

```ts
readonly usernameInput = page.getByLabel('Username');
readonly passwordInput = page.getByLabel('Password');
readonly loginButton = page.getByRole('button', { name: 'Login' });

async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
```

### Spec

```ts
await loginPage.open();
await loginPage.login('admin', '123456');
```

Do NOT output raw Recorder code as the final architecture.

Recorder tells you HOW to interact.

The Page Object tells the project HOW to organize that interaction.

---

# 9. TEST CASE CONVERSION

Convert the TEST_CASE directly.

Mapping:

```text
Precondition
→ setup / navigation

Test Step
→ Page Object action

Test Data
→ method parameters or local test data

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

Becomes:

```ts
await automationFormPage.enterFirstName('John');

await expect(automationFormPage.firstNameInput)
  .toHaveValue('John');
```

Every meaningful expected result must have a real assertion.

Never use fake assertions such as:

```ts
expect(true).toBe(true);
```

---

# 10. TEST DATA

Use the exact test data from TEST_CASE.

Do not invent data when data is provided.

Keep small test data in the Spec:

```ts
const testData = {
  username: 'admin',
  password: '123456',
};
```

Do not create separate data files for a simple test.

Do not change test data unless required by the application.

---

# 11. WAITING

Never use arbitrary sleeps:

```ts
await page.waitForTimeout(3000);
```

Prefer Playwright auto-waiting and assertions:

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Success');
await locator.click();
```

Do not add unnecessary explicit waits.

---

# 12. NAVIGATION

If TEST_CASE or Recorder provides a URL, use that exact URL.

Do not invent a different URL.

Do not modify:

- Playwright config
- environment configuration
- `.env`
- package configuration

unless explicitly requested.

---

# 13. ASSERTION RULES

Expected results must be validated.

Use appropriate Playwright assertions:

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText('...');
await expect(locator).toContainText('...');
await expect(locator).toHaveValue('...');
await expect(locator).toBeChecked();
await expect(locator).toBeEnabled();
```

Use Page Object assertion methods when they improve readability:

```ts
await loginPage.expectLoginSuccess();
```

Do not assert implementation details when the TEST_CASE describes a business outcome.

---

# 14. NAMING

Use:

```text
Feature folder:
<featureName>/

Page:
<featureName>.page.ts

Spec:
<featureName>.spec.ts

Class:
<FeatureName>Page
```

Examples:

```text
login/
├── login.page.ts
└── login.spec.ts
```

```text
productSearch/
├── productSearch.page.ts
└── productSearch.spec.ts
```

Use existing repository naming conventions when a similar feature exists.

---

# 15. IMPORT PATHS

For:

```text
tests/DEMO/<feature>/<feature>.page.ts
```

BasePage import:

```ts
import { BasePage } from '../../../shared/pages/base.page';
```

For:

```text
tests/DEMO/<feature>/<feature>.spec.ts
```

Fixture import:

```ts
import { test, expect } from '../../fixtures/demo.fixture';
```

Calculate relative paths from the actual file location.

Do not guess.

---

# 16. NO UNNECESSARY ARCHITECTURE

Do NOT introduce:

```text
services/
repositories/
managers/
factories/
helpers/
utils/
new fixtures/
new config/
```

unless the existing project already uses that pattern for the exact problem.

The default output is only:

```text
<feature>.page.ts
<feature>.spec.ts
```

---

# 17. EXISTING PROJECT STYLE

Before generating code, inspect/reuse patterns from:

```text
tests/DEMO/forms/practiceForm/automationForm.page.ts
tests/DEMO/forms/practiceForm/automationForm.spec.ts
tests/DEMO/todoMvc/todoApp/todo.page.ts
tests/DEMO/todoMvc/todoApp/todo.spec.ts
tests/DEMO/playwright/home/
tests/DEMO/playwright/docs/
tests/DEMO/fixtures/demo.fixture.ts
shared/pages/base.page.ts
```

The repository currently uses a feature-based structure and custom DEMO fixtures. Do not replace this architecture.

The existing `demo.fixture.ts` imports Page Objects and extends Playwright's base test with them, while also re-exporting `expect`.

---

# 18. GENERATION PROCESS

Follow this process silently.

### Step 1 — Understand the TEST_CASE

Extract:

```text
Feature
Scenario
Precondition
URL
Test data
Steps
Expected results
```

### Step 2 — Inspect Recorder

If Recorder exists:

```text
Extract URL
Extract reliable locators
Extract interaction sequence
Identify actual UI controls
```

### Step 3 — Map to existing architecture

Decide:

```text
Existing Page Object?
    ↓ yes → reuse it

New feature?
    ↓
create <feature>.page.ts

Simple test?
    ↓
possibly only <feature>.spec.ts
```

### Step 4 — Implement Page Object

Put:

```text
locators
navigation
actions
page-level assertions
```

into `.page.ts`.

### Step 5 — Implement Spec

Put:

```text
scenario
test data
business flow
assertions
```

into `.spec.ts`.

### Step 6 — Validate

Check imports, paths, selectors, architecture, and test completeness.

### Step 7 — Output

Return only the required files.

---

# 19. OUTPUT CONTRACT

The normal output MUST be exactly:

### File 1

```text
tests/DEMO/<feature>/<feature>.page.ts
```

```ts
<complete code>
```

### File 2

```text
tests/DEMO/<feature>/<feature>.spec.ts
```

```ts
<complete code>
```

Do not output explanations before or after the files.

Do not output pseudo-code.

Do not output:

```text
...
TODO
implementation here
same as above
```

Do not omit imports.

Do not omit methods.

Do not output partial files.

---

# 20. COPY-PASTE REQUIREMENT

The generated files must be ready for:

```text
copy
↓
paste into tests/DEMO/<feature>/
↓
run Playwright
```

No manual implementation should be required.

No new package installation should be required.

No architecture changes should be required.

No hidden missing code is allowed.

---

# 21. FINAL SELF-CHECK

Before outputting code, silently verify:

### Files

- [ ] Exactly the required files are generated
- [ ] Folder name is correct
- [ ] File names are correct
- [ ] Class name is correct

### Architecture

- [ ] Existing DEMO fixture is used
- [ ] Existing BasePage is reused
- [ ] Page Object contains UI implementation
- [ ] Spec contains business flow
- [ ] No unnecessary architecture was introduced

### Recorder

- [ ] Recorder URL was respected
- [ ] Recorder selectors were considered
- [ ] Recorder interactions were converted into Page Object methods
- [ ] Recorder code was not blindly copied into the Spec

### Test Case

- [ ] All steps are implemented
- [ ] All required test data is used
- [ ] All expected results have assertions
- [ ] No required behavior was silently removed

### Code

- [ ] Imports are complete
- [ ] Relative paths are correct
- [ ] TypeScript is valid
- [ ] No TODO
- [ ] No pseudo-code
- [ ] No arbitrary `waitForTimeout`
- [ ] No invented dependency
- [ ] No unnecessary file

### Runnable

- [ ] Code can be copied directly into the repository
- [ ] Test uses the existing Playwright setup
- [ ] No manual code completion is required

---

# 22. IMPORTANT BEHAVIOR

If information is missing:

- Prefer existing repository patterns.
- Prefer Recorder evidence when available.
- Do not invent selectors if the Recorder provides a usable selector.
- Do not invent URLs.
- Do not invent expected results.
- Do not change the TEST_CASE's business intent.

If the TEST_CASE and Recorder appear inconsistent:

1. Preserve the TEST_CASE business intent.
2. Use Recorder to determine the actual UI interaction.
3. Generate the closest runnable implementation.
4. Do not silently change the requested scenario.

If the test cannot be made runnable with the supplied information, clearly identify the missing information instead of generating fake code.

---

# 23. INPUT

Everything provided after this section is the TEST_CASE and optional Playwright Recorder / Codegen output.

Generate the required Playwright code according to this skill.

Output only the complete file(s).
