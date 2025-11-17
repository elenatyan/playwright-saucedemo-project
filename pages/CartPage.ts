import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async assertItemsCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
