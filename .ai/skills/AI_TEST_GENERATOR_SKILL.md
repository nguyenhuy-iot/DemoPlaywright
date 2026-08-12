# AI_TEST_GENERATOR_SKILL.md

## Goal
Generate complete, copy-paste ready Playwright tests that follow existing repository architecture without manual changes.

## 1. Principles & Architecture
- **Reuse:** Use existing `demo.fixture.ts` and `BasePage`. Do not create new fixtures, config, or helper files.
- **Structure:** Feature-based: `tests/DEMO/<feature>/`.
- **Output:** Exactly two files: `<feature>.page.ts` and `<feature>.spec.ts`.
- **No Novelty:** Do not introduce `services`, `repositories`, `factories`, or arbitrary abstractions.
- **Reliability:** No arbitrary `waitForTimeout`. Use `expect` and auto-waiting.

## 2. Code Patterns (Strict Adherence)

### Page Object Pattern (`<feature>.page.ts`)
```ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../shared/pages/base.page';

export class FeaturePage extends BasePage {
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
```

### Spec Pattern (`<feature>.spec.ts`)
```ts
import { test, expect } from '../../fixtures/demo.fixture';
import { FeaturePage } from './feature.page';

test('should perform action successfully', async ({ page }) => {
  const featurePage = new FeaturePage(page);
  
  await featurePage.open(); // Assuming BasePage open method
  await featurePage.submitForm();
  await expect(page).toHaveURL(/success/);
});
```

## 3. Implementation Rules
- **Locators:** Priority: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId` > `CSS`.
- **Mapping:** Recorder/Codegen interactions MUST be converted into Page Object methods. Do not output raw recorder code in specs.
- **Test Data:** Use exact data from TEST_CASE. Keep small data in the spec.
- **Assertions:** Every expected result requires a real Playwright assertion (e.g., `toBeVisible`, `toHaveValue`).

## 4. Definition of Done
Before outputting, verify:
- [ ] Exactly two files are generated (`.page.ts`, `.spec.ts`).
- [ ] Code is copy-paste ready (no TODOs, no pseudo-code).
- [ ] Imports utilize correct relative paths.
- [ ] Existing `demo.fixture.ts` is used.
- [ ] No arbitrary sleeps.
- [ ] All TEST_CASE steps and expected results are covered.
- [ ] No new architecture introduced.
