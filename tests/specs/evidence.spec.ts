import { test, expect } from '../../tests/fixtures/base.fixture';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Evidence Screenshot Feature', () => {
  test('should generate correct evidence files', async ({ page, evidence }, testInfo) => {
    await page.goto('https://playwright.dev/');
    await evidence.step(); // input_01.png

    await expect(page).toHaveURL(/.*playwright/);
    await evidence.expect(); // output_01.png

    const screenshotDir = testInfo.outputPath('screenshots');

    expect(fs.existsSync(path.join(screenshotDir, 'input_01.png'))).toBeTruthy();
    expect(fs.existsSync(path.join(screenshotDir, 'output_01.png'))).toBeTruthy();
  });

  test('should use independent counters', async ({ page, evidence }, testInfo) => {
    await page.goto('https://playwright.dev/');

    await evidence.step(); // input_01.png
    await evidence.step(); // input_02.png

    await evidence.expect(); // output_01.png

    const screenshotDir = testInfo.outputPath('screenshots');

    expect(fs.existsSync(path.join(screenshotDir, 'input_01.png'))).toBeTruthy();
    expect(fs.existsSync(path.join(screenshotDir, 'input_02.png'))).toBeTruthy();
    expect(fs.existsSync(path.join(screenshotDir, 'output_01.png'))).toBeTruthy();
    expect(fs.existsSync(path.join(screenshotDir, 'input_03.png'))).toBeFalsy();
  });

  test('should generate output screenshot even if assertion fails', async ({
    page,
    evidence,
  }, testInfo) => {
    await page.goto('https://playwright.dev/');

    await evidence.expect(); // output_01.png

    // Intentionally failing assertion
    try {
      await expect(page.getByText('Non-existent Element')).toBeVisible({ timeout: 1000 });
    } catch {
      // Expected to fail
    }

    const screenshotDir = testInfo.outputPath('screenshots');
    expect(fs.existsSync(path.join(screenshotDir, 'output_01.png'))).toBeTruthy();
  });

  test('should support configurable fullPage screenshot', async ({ page, evidence }, testInfo) => {
    await page.goto('https://playwright.dev/');

    // Test with fullPage: true
    await evidence.step({ fullPage: true });

    const screenshotDir = testInfo.outputPath('screenshots');
    expect(fs.existsSync(path.join(screenshotDir, 'input_01.png'))).toBeTruthy();
  });
});
