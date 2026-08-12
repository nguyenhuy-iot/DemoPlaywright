import { test } from '../../fixtures/demo.fixture';

test.describe('Playwright Documentation', () => {
  test('should navigate through documentation links', async ({ playwrightDocsPage }) => {
    // Truy cập tài liệu Playwright
    await playwrightDocsPage.navigateTo('https://playwright.dev/docs/codegen-intro');

    // Click vào các liên kết điều hướng
    await playwrightDocsPage.clickLink('Writing tests');
    await playwrightDocsPage.clickLink('Installation');
    await playwrightDocsPage.clickTraceViewer();
  });
});
