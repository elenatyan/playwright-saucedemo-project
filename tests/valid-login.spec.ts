// Test Case 0001: Verify valid login
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('should successfully login and display inventory page with products and cart', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Perform login and verify via POM
  await loginPage.loginAndVerify(VALID_USER, VALID_PASSWORD);

  // Additional assertions after login
  // Verify at least one product is displayed
  const products = page.locator('.inventory_item');
  const productCount = await products.count();
  expect(productCount).toBeGreaterThan(0);

  // Verify the shopping cart icon is visible
  const cartIcon = page.locator('.shopping_cart_link');
  await expect(cartIcon).toBeVisible();

  // Verify page title
  const title = page.locator('.title');
  await expect(title).toHaveText('Products');
});
