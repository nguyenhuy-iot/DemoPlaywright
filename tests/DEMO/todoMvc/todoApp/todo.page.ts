import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/base.page';

export class TodoMvcPage extends BasePage {
  readonly input: Locator;
  readonly toggle: Locator;
  readonly deleteButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.input = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.toggle = page.getByRole('checkbox', { name: 'Toggle Todo' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.heading = page.getByRole('heading', { name: 'todos' });
  }

  async navigateTo(path: string = '/') {
    await this.page.goto(path);
  }

  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  async toggleTodo() {
    await this.toggle.check();
  }

  async deleteTodo() {
    await this.deleteButton.click();
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }
}
