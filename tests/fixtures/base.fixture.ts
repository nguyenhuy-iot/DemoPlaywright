import { test as base } from '@playwright/test';
import { TodoMvcPage } from '../pages/todomvc/todo.page';
import { PlaywrightDocsPage } from '../pages/playwright/docs.page';
import { PlaywrightHomePage } from '../pages/playwright/home.page';
import { AutomationFormPage } from '../pages/demoqa/automation-form.page';
import { EvidenceRecorder } from './evidence/evidence-recorder';

// 1. Định nghĩa kiểu dữ liệu cho các custom fixtures
export type ProjectFixtures = {
  todoMvcPage: TodoMvcPage;
  playwrightDocsPage: PlaywrightDocsPage;
  playwrightHomePage: PlaywrightHomePage;
  automationFormPage: AutomationFormPage;
  evidence: EvidenceRecorder;
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
  automationFormPage: async ({ page }, use) => {
    const automationFormPage = new AutomationFormPage(page);
    await use(automationFormPage);
  },
  evidence: async ({ page }, use, testInfo) => {
    const outputDir = testInfo.outputPath('screenshots');
    const evidence = new EvidenceRecorder(page, outputDir);
    await use(evidence);
  },
});

export { expect } from '@playwright/test';
