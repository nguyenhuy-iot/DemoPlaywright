import { test as base, expect as baseExpect } from '@playwright/test';
import { TodoMvcPage } from '../todoMvc/todoApp/todo.page';
import { PlaywrightDocsPage } from '../playwright/docs/docs.page';
import { PlaywrightHomePage } from '../playwright/home/home.page';
import { AutomationFormPage } from '../forms/practiceForm/automationForm.page';
import { EvidenceRecorder } from '../../shared/utilities/evidence/evidence-recorder';

// 1. Định nghĩa kiểu dữ liệu cho các custom fixtures của DEMO
export type DemoFixtures = {
  todoMvcPage: TodoMvcPage;
  playwrightDocsPage: PlaywrightDocsPage;
  playwrightHomePage: PlaywrightHomePage;
  automationFormPage: AutomationFormPage;
  evidence: EvidenceRecorder;
};

// 2. Mở rộng class test
export const test = base.extend<DemoFixtures>({
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

// Re-export expect
export const expect = baseExpect;
