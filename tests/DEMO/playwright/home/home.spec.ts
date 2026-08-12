import { test } from '../../fixtures/demo.fixture';

test.describe('Playwright Home Page', () => {
  test.beforeEach(async ({ playwrightHomePage }) => {
    await playwrightHomePage.navigateToHome();
  });

  test('should display Playwright in the title', async ({ playwrightHomePage }) => {
    await playwrightHomePage.expectTitleToContain(/Playwright/);
  });

  test('should navigate to Installation from Get Started', async ({ playwrightHomePage }) => {
    await playwrightHomePage.clickGetStarted();
    await playwrightHomePage.expectHeadingToBeVisible('Installation');
  });
});
