// Test Case 0008: Verify that the user can place an order through the checkout form.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const FIRST_NAME = 'John';
const LAST_NAME = 'Doe';
const POSTAL_CODE = '12345';

test('Full checkout workflow with taxes', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Login
  await loginPage.loginAndVerify(VALID_USER, VALID_PASSWORD);

  // Add product and go to cart
  await inventoryPage.addFirstProductToCart();
  await inventoryPage.assertCartBadgeCount('1');
  await inventoryPage.goToCart();

  await cartPage.assertItemsCount(1);
  await cartPage.clickCheckout();

  // Fill checkout form
  await checkoutPage.fillCheckoutForm(FIRST_NAME, LAST_NAME, POSTAL_CODE);

  await checkoutPage.assertSingleItemOnOverview();

  // Validate prices logic
  const { subtotal, tax, total } = await checkoutPage.getPrices();
  expect(total).toBeCloseTo(subtotal + tax, 2);

  // Complete order
  await checkoutPage.finishOrder();

  // Back to inventory & verify state
  await checkoutPage.goBackHome();
  await inventoryPage.assertProductsExist();
});
