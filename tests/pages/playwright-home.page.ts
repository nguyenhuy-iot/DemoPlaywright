import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PlaywrightHomePage extends BasePage {
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }
}
