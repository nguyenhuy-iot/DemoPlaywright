import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class PlaywrightHomePage extends BasePage {
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async navigateToHome() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }

  async expectTitleToContain(title: RegExp | string) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectHeadingToBeVisible(name: string) {
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }
}
