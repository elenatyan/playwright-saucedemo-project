//Test Case 0008: Verify that the user can not  place an order without products.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Checkout with empty cart workflow', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //Login
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASSWORD);
  await loginPage.assertLoginSuccessful();

  //  Go to Cart
  await page.click('.shopping_cart_link');
  await expect(page.locator('.cart_item')).toHaveCount(0); // Cart is empty

  // Click Checkout
  await page.click('[data-test="checkout"]');

  // ER User is on Checkout Step One page, but no items in the form
  await expect(page).toHaveURL(/checkout-step-one/);

  const overviewItems = page.locator('.cart_item');
  // Verify no products
  await expect(overviewItems).toHaveCount(0); 
});
