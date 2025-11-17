import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
  private page: Page;

  // LOCATORS
  private firstNameInput!: Locator;
  private lastNameInput!: Locator;
  private postalCodeInput!: Locator;
  private continueButton!: Locator;
  private finishButton!: Locator;
  private successMessage!: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---------- LOCATORS ----------
    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput = this.page.locator('[data-test="lastName"]');
    this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
    this.continueButton = this.page.locator('[data-test="continue"]');
    this.finishButton = this.page.locator('[data-test="finish"]');
    this.successMessage = this.page.locator('.complete-header'); // "Thank you for your order!"
  }

  // ---------- PAGE ACTIONS ----------
  async goto(): Promise<void> {
    // Перехід на checkout-step-one.html для початку заповнення форми
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async assertSingleItemOnOverview(): Promise<void> {
    const items = this.page.locator('.cart_item');
    const count = await items.count();
    expect(count).toBe(1);
  }

  async getPrices(): Promise<{ subtotal: number; tax: number; total: number }> {
    const subtotalText = await this.page.locator('.summary_subtotal_label').textContent();
    const taxText = await this.page.locator('.summary_tax_label').textContent();
    const totalText = await this.page.locator('.summary_total_label').textContent();

    const subtotal = parseFloat(subtotalText?.replace('Item total: $', '') || '0');
    const tax = parseFloat(taxText?.replace('Tax: $', '') || '0');
    const total = parseFloat(totalText?.replace('Total: $', '') || '0');

    return { subtotal, tax, total };
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toHaveText('Thank you for your order!');
  }

  async goBackHome(): Promise<void> {
    await this.page.locator('[data-test="back-to-products"]').click();
  }
}
