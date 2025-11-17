import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // LOCATORS
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly overviewItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');

    this.overviewItems = page.locator('.cart_item');

    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');

    this.errorMessage = page.locator('[data-test="error"]');
  }

  // ---------- STEP ONE ----------
  async assertOnStepOnePage(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(postalCode);
    await this.continueButton.click();
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async assertFieldError(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedText);
  }

  // ---------- STEP TWO / OVERVIEW ----------
  async assertSingleItemOnOverview(): Promise<void> {
    await expect(this.overviewItems).toHaveCount(1);
  }

  async getOverviewItemsCount(): Promise<number> {
    return await this.overviewItems.count();
  }

  async getPrices(): Promise<{ subtotal: number; tax: number; total: number }> {
    const subtotalText = await this.subtotalLabel.textContent();
    const taxText = await this.taxLabel.textContent();
    const totalText = await this.totalLabel.textContent();

    const subtotal = parseFloat(subtotalText?.replace('Item total: $', '') || '0');
    const tax = parseFloat(taxText?.replace('Tax: $', '') || '0');
    const total = parseFloat(totalText?.replace('Total: $', '') || '0');

    return { subtotal, tax, total };
  }

  // ---------- STEP THREE / FINISH ----------
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
    await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
  }

  async goBackHome(): Promise<void> {
    await this.backHomeButton.click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}
