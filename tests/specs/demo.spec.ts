import { test } from '../fixtures';

test('test demo todomvc and playwright docs', async ({ page, todoMvcPage, playwrightDocsPage }) => {
  // Truy cập trang ToDoMVC
  await todoMvcPage.navigateTo('https://demo.playwright.dev/todomvc/#/');
  
  // Chụp ảnh màn hình kết quả cuối cùng
  await page.screenshot({
    path: 'screenshots/step-final-result.png',
    fullPage: true
  });
  
  // Thêm một item mới
  await todoMvcPage.addTodo('123456');
  
  // Đánh dấu hoàn thành và xóa
  await todoMvcPage.toggleTodo();
  await todoMvcPage.deleteTodo();
  await todoMvcPage.heading.click();
  
  // Dừng lại để kiểm tra
  await page.pause();
  
  // Truy cập tài liệu Playwright
  await playwrightDocsPage.navigateTo('https://playwright.dev/docs/codegen-intro');
  
  // Click vào các liên kết điều hướng
  await playwrightDocsPage.clickLink('Writing tests');
  await playwrightDocsPage.clickLink('Installation');
  await playwrightDocsPage.clickTraceViewer();
});
