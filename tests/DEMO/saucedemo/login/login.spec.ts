import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from './login.page';
import { users } from '../data/users';

test.describe('SauceDemo Successful Login Tests', () => {
  let loginPage: SauceDemoLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new SauceDemoLoginPage(page);
    await loginPage.navigate();
  });

  test('should login successfully with standard_user', async ({ page }) => {
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should login successfully with problem_user', async ({ page }) => {
    await loginPage.login(users.problem);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should login successfully with performance_glitch_user', async ({ page }) => {
    await loginPage.login(users.performanceGlitch);
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
