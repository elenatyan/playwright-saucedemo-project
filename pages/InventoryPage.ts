import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  private page: Page;

  // Локаторы будут инициализированы в конструкторе
  private sortingSelect!: Locator;
  private productNames!: Locator;
  private productPrices!: Locator;
  private addToCartButtons!: Locator;
  private cartIcon!: Locator;
  private cartBadge!: Locator;
  private inventoryItems!: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---------- LOCATORS ----------
    this.sortingSelect = this.page.locator('.product_sort_container');
    this.productNames = this.page.locator('.inventory_item_name');
    this.productPrices = this.page.locator('.inventory_item_price');
    this.addToCartButtons = this.page.locator('button[data-test^="add-to-cart"]');
    this.cartIcon = this.page.locator('.shopping_cart_link');
    this.cartBadge = this.page.locator('.shopping_cart_badge');
    this.inventoryItems = this.page.locator('.inventory_item');
  }

  // ---------- SORTING ----------
  async selectSortingOption(value: string): Promise<void> {
    await this.sortingSelect.selectOption(value);
    await this.page.waitForTimeout(300); // для стабильности UI
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }

  // ---------- CART ACTIONS ----------
  async addProductToCartByIndex(index: number): Promise<void> {
    await this.addToCartButtons.nth(index).click();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const productContainer = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: name })
    });
    await productContainer.locator('button[data-test^="add-to-cart"]').click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return Number(text);
    }
    return 0;
  }

  async assertCartBadgeCount(expected: string): Promise<void> {
    await expect(this.cartBadge).toHaveText(expected);
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  // ---------- GENERAL ASSERTS ----------
  async assertProductsExist(): Promise<void> {
    const count = await this.inventoryItems.count();
    expect(count).toBeGreaterThan(0);
  }

  async assertProductVisibleByName(name: string): Promise<void> {
    const locator = this.productNames.filter({ hasText: name });
    await expect(locator).toBeVisible();
  }
}
