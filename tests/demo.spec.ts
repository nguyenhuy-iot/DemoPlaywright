import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('123456');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).check();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('heading', { name: 'todos' }).click();
  await page.pause();
  await page.goto('https://playwright.dev/docs/codegen-intro');
  await page.getByRole('link', { name: 'Writing tests', exact: true }).click();
  await page.getByRole('link', { name: 'Installation', exact: true }).click();
  await page.getByRole('link', { name: 'Trace viewer' }).first().click();
});