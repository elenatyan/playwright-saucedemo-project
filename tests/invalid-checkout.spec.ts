// Test Case 0008: Verify that the user cannot place an order without products 
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Checkout with empty cart workflow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Login and verify
  await loginPage.loginAndVerify(VALID_USER, VALID_PASSWORD);

  // Go to Cart
  await cartPage.goToCart();

  // Verify cart is empty
  await cartPage.assertItemsCount(0);

  // Click Checkout
  await cartPage.clickCheckout();

  // Verify user is on Checkout Step One page
  await checkoutPage.assertOnStepOnePage();

  // Verify no products in overview
  await expect(checkoutPage.overviewItems).toHaveCount(0);
});
