# AI_QUICK_TEST_GENERATOR_SKILL.md

## 1. PURPOSE
Generate a single, copy-paste-ready Playwright `.spec.ts` from a `TEST_CASE` and optional `Recorder/Codegen` output.

## 2. OUTPUT CONTRACT
*   **Path:** `tests/DEMO/<feature>/<feature>.spec.ts`
*   **Format:** One complete, runnable file.
*   **Restriction:** NO new Page Objects, helpers, or utilities. Use direct Playwright or existing `demo.fixture.ts` only.

## 3. CORE RULES
| Aspect | Directive |
| :--- | :--- |
| **Structure** | Use `test.describe()` for the feature; 1 `test()` block per `TEST_CASE`. |
| **Identity** | **Preserve** original ID, number, title, and order. Never renumber/reorder. |
| **Architecture** | Reuse `import { test, expect } from '../../fixtures/demo.fixture'`. No modification. |
| **Locators** | Prioritize: `Recorder/DOM` > `Repo` > `Guessed`. |
| **Assertions** | Real assertions only (`expect(l).toBeVisible()`). NO `expect(true).toBe(true)`. |
| **Independence** | Tests must be independently executable. |

## 4. PROCESS
1.  **Parse:** Extract feature, ID, data, steps, expected results.
2.  **Inspect:** Check `tests/DEMO/fixtures/demo.fixture.ts` and existing feature tests.
3.  **Generate:** Map steps/data to Playwright actions/assertions.
4.  **Validate:** Assert `test()` count == `TEST_CASE` count; ensure valid TS/imports.

## 5. PROHIBITED
*   Creating new Page Objects/Classes.
*   Arbitrary `page.waitForTimeout()`.
*   Inventing URLs, data, or selectors.
*   Merging, omitting, or reordering tests.
*   Outputting analysis, pseudo-code, or explanations.

## 7. EVIDENCE SCREENSHOT (MANDATORY)
*   **Purpose:** Always capture test evidence (screenshot) for steps and assertions.
*   **API:** `await evidence.step()` (for actions) and `await evidence.expect()` (for assertions).
*   **Placement Rules:**
    *   `evidence.step()`: Call immediately **after** an action.
    *   `evidence.expect()`: Call immediately **before** an assertion.
*   **Independence:** `step` and `expect` have **independent** counters.
*   **Requirement:** Screenshot must exist even if assertion fails.

**Pattern (Standard):**
```ts
// Action
await page.getByLabel('User').fill('admin');
await evidence.step(); // Generates input_01.png

// Assertion
await evidence.expect(); // Generates output_01.png
await expect(page.getByText('Dashboard')).toBeVisible();
```

**Full Example:**
```ts
import { test, expect } from '../../fixtures/demo.fixture';

test('TC001 - Login with evidence', async ({ page, evidence }) => {
  await page.goto('/login');
  await evidence.step(); // input_01.png

  await page.getByLabel('User').fill('admin');
  await evidence.step(); // input_02.png

  await page.getByRole('button', { name: 'Login' }).click();
  await evidence.step(); // input_03.png

  await evidence.expect(); // output_01.png
  await expect(page).toHaveURL(/dashboard/);
});
```

**CHECKLIST FOR EVIDENCE:**
*   [ ] `evidence.step()` called after action?
*   [ ] `evidence.expect()` called before assertion?
*   [ ] Counters are independent (`input_XX` / `output_XX`)?
*   [ ] Screenshot files generated even if assertion fails?
*   [ ] No automated screenshot (hook) logic?

