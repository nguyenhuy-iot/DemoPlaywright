import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private static readonly url = 'https://www.saucedemo.com/';

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly inventoryList: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.inventoryList = page.locator('.inventory_list');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(LoginPage.url, { waitUntil: 'domcontentloaded' });
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoginSuccess(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }

  async isLoginFail(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async waitForLoginOutcome(timeout = 15_000): Promise<'success' | 'fail'> {
    return Promise.race([
      this.inventoryList.waitFor({ state: 'visible', timeout }).then(() => 'success' as const),
      this.errorMessage.waitFor({ state: 'visible', timeout }).then(() => 'fail' as const),
    ]);
  }

  async getErrorMessage(): Promise<string> {
    if (!(await this.isLoginFail())) {
      return '';
    }

    return ((await this.errorMessage.textContent()) ?? '').trim();
  }
}
