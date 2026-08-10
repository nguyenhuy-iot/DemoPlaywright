import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class PlaywrightDocsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickLink(name: string) {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  async clickTraceViewer() {
    await this.page.getByRole('link', { name: 'Trace viewer' }).first().click();
  }
}
