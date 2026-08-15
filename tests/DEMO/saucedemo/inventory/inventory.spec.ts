import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from '../login/login.page';
import { SauceDemoInventoryPage } from './inventory.page';
import { users } from '../data/users';

test.describe('SauceDemo Inventory Tests', () => {
  let inventoryPage: SauceDemoInventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    inventoryPage = new SauceDemoInventoryPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard);
  });

  test('should display inventory page correctly', async () => {
    const titleText = await inventoryPage.getTitleText();
    expect(titleText).toBe('Products');

    const productsCount = await inventoryPage.getProductsCount();
    expect(productsCount).toBeGreaterThan(0);
  });

  test('should add a product to cart and update cart badge', async () => {
    let badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe(''); // Empty badge initially

    await inventoryPage.addProductToCart(0);

    badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1'); // Updates to 1
  });
});
