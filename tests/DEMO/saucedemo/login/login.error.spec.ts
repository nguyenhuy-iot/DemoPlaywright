import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from './login.page';
import { users } from '../data/users';

test.describe('SauceDemo Login Error Tests', () => {
  let loginPage: SauceDemoLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new SauceDemoLoginPage(page);
    await loginPage.navigate();
  });

  test('should display error message when logging in with locked_out_user', async () => {
    await loginPage.login(users.lockedOut);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
  });
});
