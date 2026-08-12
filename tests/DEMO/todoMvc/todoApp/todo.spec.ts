import { test } from '../../fixtures/demo.fixture';

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
