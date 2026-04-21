import { chromium, expect, test } from '@playwright/test';

import { LoginExpectation, users } from '../data/users';
import { LoginPage } from '../pages/login.page';
import {
  createSummary,
  formatDuration,
  getDurationMs,
  incrementSummary,
  toErrorMessage,
} from '../utils/helper';

test('runs login attempts sequentially with a visible browser', async () => {
  const browser = await chromium.launch({ headless: false });
  const summary = createSummary();
  const mismatches: string[] = [];

  const expectedSummary = users.reduce(
    (result, user) => {
      incrementSummary(result, user.expected);
      return result;
    },
    createSummary(),
  );

  try {
    for (const user of users) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const startTime = Date.now();

      try {
        await loginPage.goto();
        await loginPage.login(user.username, user.password);

        const observedOutcome = await loginPage.waitForLoginOutcome();
        const isSuccess = await loginPage.isLoginSuccess();
        const isFail = await loginPage.isLoginFail();
        const outcome: LoginExpectation = isSuccess
          ? 'success'
          : isFail
            ? 'fail'
            : observedOutcome;

        incrementSummary(summary, outcome);

        const durationMs = getDurationMs(startTime);
        const errorMessage = outcome === 'fail' ? await loginPage.getErrorMessage() : '';

        console.log(
          `[${user.id}] ${user.username} -> ${outcome.toUpperCase()} (${formatDuration(durationMs)})` +
            (errorMessage ? ` | ${errorMessage}` : ''),
        );

        if (outcome !== user.expected) {
          mismatches.push(
            `[${user.id}] ${user.description}: expected ${user.expected}, but got ${outcome}.`,
          );
        }
      } catch (error) {
        incrementSummary(summary, 'fail');

        const durationMs = getDurationMs(startTime);
        const errorMessage = toErrorMessage(error);

        console.log(
          `[${user.id}] ${user.username} -> FAIL (${formatDuration(durationMs)}) | ${errorMessage}`,
        );

        mismatches.push(`[${user.id}] ${user.description}: unexpected error - ${errorMessage}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log('');
  console.log('Final summary');
  console.log(`Success: ${summary.success}`);
  console.log(`Fail: ${summary.fail}`);
  console.log(`Total: ${users.length}`);

  expect(summary).toEqual(expectedSummary);
  expect(mismatches, mismatches.join('\n')).toHaveLength(0);
});
