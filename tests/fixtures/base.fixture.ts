import { test as base } from '@playwright/test';
import { TodoMvcPage } from '../pages/todo-mvc.page';
import { PlaywrightDocsPage } from '../pages/playwright-docs.page';
import { PlaywrightHomePage } from '../pages/playwright-home.page';

// 1. Định nghĩa kiểu dữ liệu cho các custom fixtures
export type ProjectFixtures = {
  todoMvcPage: TodoMvcPage;
  playwrightDocsPage: PlaywrightDocsPage;
  playwrightHomePage: PlaywrightHomePage;
};

// 2. Mở rộng class test để tự động inject Page Objects
export const test = base.extend<ProjectFixtures>({
  todoMvcPage: async ({ page }, use) => {
    const todoMvcPage = new TodoMvcPage(page);
    await use(todoMvcPage);
  },
  playwrightDocsPage: async ({ page }, use) => {
    const playwrightDocsPage = new PlaywrightDocsPage(page);
    await use(playwrightDocsPage);
  },
  playwrightHomePage: async ({ page }, use) => {
    const playwrightHomePage = new PlaywrightHomePage(page);
    await use(playwrightHomePage);
  },
});

export { expect } from '@playwright/test';
