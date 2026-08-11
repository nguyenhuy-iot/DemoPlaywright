import { test } from '../fixtures';

test.describe('ToDoMVC Application', () => {
  test('should add, toggle, and delete a todo item', async ({ todoMvcPage }) => {
    // Truy cập trang ToDoMVC
    await todoMvcPage.navigateTo('https://demo.playwright.dev/todomvc/#/');

    // Thêm một item mới
    await todoMvcPage.addTodo('123456');

    // Đánh dấu hoàn thành và xóa
    await todoMvcPage.toggleTodo();
    await todoMvcPage.deleteTodo();
    await todoMvcPage.expectHeadingVisible();
  });
});

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
