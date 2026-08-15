import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../shared/pages/base.page';

export class SauceDemoInventoryPage extends BasePage {
  readonly titleHeader: Locator;
  readonly productItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.titleHeader = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async getProductsCount(): Promise<number> {
    return await this.productItems.count();
  }

  async addProductToCart(index: number) {
    const item = this.productItems.nth(index);
    const addToCartButton = item.locator('[data-test^="add-to-cart"]');
    await addToCartButton.click();
  }

  async getCartBadgeCount(): Promise<string> {
    if (await this.cartBadge.isVisible()) {
      return (await this.cartBadge.textContent()) || '';
    }
    return '';
  }

  async getTitleText(): Promise<string> {
    return (await this.titleHeader.textContent()) || '';
  }
}
