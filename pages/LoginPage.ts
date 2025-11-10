import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField;
  readonly passwordField;
  readonly loginButton;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#user-name');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccessful() {
    await expect(this.page.locator('[data-test="inventory-container"]')).toBeVisible();
  }
}
