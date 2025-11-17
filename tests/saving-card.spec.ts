// Test Case: Verify that user can "save card" workflow (імітоване на SauceDemo)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const FIRST_NAME = 'John';
const LAST_NAME = 'Doe';
const POSTAL_CODE = '12345';

test('User can fill checkout form and complete payment (save card workflow)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

  // 1️⃣ Login
  await loginPage.loginAndVerify(VALID_USER, VALID_PASSWORD);

  // 2️⃣ Add first product to cart
  await inventoryPage.addFirstProductToCart();
  await inventoryPage.assertCartBadgeCount('1');
  await inventoryPage.goToCart();

  // 3️⃣ Verify cart and click Checkout
  await cartPage.assertItemsCount(1);
  await cartPage.clickCheckout();

  // 4️⃣ Fill checkout form
  await paymentPage.fillCheckoutForm(FIRST_NAME, LAST_NAME, POSTAL_CODE);

  // 5️⃣ Verify single item on overview page
  await paymentPage.assertSingleItemOnOverview();

  // 6️⃣ Optionally validate subtotal/tax/total
  const { subtotal, tax, total } = await paymentPage.getPrices();
  expect(total).toBeCloseTo(subtotal + tax, 2);

  // 7️⃣ Finish order (імітоване збереження “картки”)
  await paymentPage.finishOrder();

  // 8️⃣ Back to products page
  await paymentPage.goBackHome();

  // 9️⃣ Verify products exist and cart is empty
  await inventoryPage.assertProductsExist();
  const cartCount = await inventoryPage.getCartBadgeCount();
  expect(cartCount).toBe(0);
});
