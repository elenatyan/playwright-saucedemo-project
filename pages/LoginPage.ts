import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // --- LOCATORS ---
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  readonly burgerMenuButton: Locator;
  readonly menuItems: Locator;
  readonly logoutLink: Locator;

  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly errorIcons: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login fields
    this.usernameField = page.locator('#user-name');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('#login-button');

    // Burger menu / logout
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.menuItems = page.locator('.bm-item.menu-item');
    this.logoutLink = page.locator('#logout_sidebar_link');

    // Error messages
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('button.error-button');
    this.errorIcons = page.locator('.error_icon');
  }

  // ---------- NAVIGATION ----------
  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // ---------- LOGIN ----------
  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async loginAndVerify(username: string, password: string): Promise<void> {
    await this.goto();
    await this.login(username, password);
    await this.assertLoginSuccessful();
  }

  async assertLoginSuccessful(): Promise<void> {
    await expect(this.page.locator('[data-test="inventory-container"]')).toBeVisible();
  }

  // ---------- INVALID LOGIN ----------
  async loginWithInvalidUsername(invalidUsername: string, password: string): Promise<void> {
    await this.goto();
    await this.usernameField.fill(invalidUsername);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async loginWithInvalidPassword(username: string, invalidPassword: string): Promise<void> {
    await this.goto();
    await this.usernameField.fill(username);
    await this.passwordField.fill(invalidPassword);
    await this.loginButton.click();
  }

  async assertErrorMessage(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedText);
    await expect(this.errorCloseButton).toBeVisible();
  }

  async assertInputErrorStyles(): Promise<void> {
    const usernameBorderColor = await this.usernameField.evaluate((el) => {
      return window.getComputedStyle(el).borderBottomColor;
    });
    const passwordBorderColor = await this.passwordField.evaluate((el) => {
      return window.getComputedStyle(el).borderBottomColor;
    });

    expect(usernameBorderColor).toBe('rgb(226, 35, 26)');
    expect(passwordBorderColor).toBe('rgb(226, 35, 26)');
  }

  async assertErrorIconsVisible(): Promise<void> {
    const usernameErrorVisible = await this.errorIcons.nth(0).isVisible();
    const passwordErrorVisible = await this.errorIcons.nth(1).isVisible();

    expect(usernameErrorVisible).toBeTruthy();
    expect(passwordErrorVisible).toBeTruthy();
  }

  // ---------- LOGOUT ----------
  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  async assertMenuItemsVisible(expectedItems: string[]): Promise<void> {
    await expect(this.menuItems).toHaveCount(expectedItems.length);
    for (const item of expectedItems) {
      await expect(this.page.locator(`.bm-item.menu-item >> text=${item}`)).toBeVisible();
    }
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async assertOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.usernameField).toHaveValue('');
    await expect(this.passwordField).toHaveValue('');
  }
}
