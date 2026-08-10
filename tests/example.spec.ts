import { test, expect } from './fixtures';

test('has title', async ({ page, playwrightHomePage }) => {
  await playwrightHomePage.navigateTo('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page, playwrightHomePage }) => {
  await playwrightHomePage.navigateTo('https://playwright.dev/');

  // Click the get started link.
  await playwrightHomePage.clickGetStarted();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
