//Test Case 0008: Verify that the user can place an order through the checkout form.
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const FIRST_NAME = 'John';
const LAST_NAME = 'Doe';
const POSTAL_CODE = '12345';

test('Full checkout workflow with taxes', async ({ page, context }) => {
  const loginPage = new LoginPage(page);

  //Login
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASSWORD);
  await loginPage.assertLoginSuccessful();

  //Add first product to cart
  const firstAddToCart = page.locator('.inventory_item button.btn_primary').first();
  await firstAddToCart.click();

  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');

  //Go to Cart
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart/);
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(1);

  // Click Checkout
  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL(/checkout-step-one/);

  // Fill First Name
  const firstNameField = page.locator('[data-test="firstName"]');
  await firstNameField.fill(FIRST_NAME);
  await expect(firstNameField).toHaveValue(FIRST_NAME);

  // Fill Last Name
  const lastNameField = page.locator('[data-test="lastName"]');
  await lastNameField.fill(LAST_NAME);
  await expect(lastNameField).toHaveValue(LAST_NAME);

  //  Fill Postal Code
  const postalCodeField = page.locator('[data-test="postalCode"]');
  await postalCodeField.fill(POSTAL_CODE);
  await expect(postalCodeField).toHaveValue(POSTAL_CODE);

  //  Click Continue
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL(/checkout-step-two/);

  // Verify product in Overview page
  const overviewItems = page.locator('.cart_item');
  await expect(overviewItems).toHaveCount(1);

  // Check rice with taxes 
  const itemPriceText = await overviewItems.locator('.inventory_item_price').first().textContent();
  const itemPrice = parseFloat(itemPriceText?.replace('$', '') || '0');

  const subtotalText = await page.locator('.summary_subtotal_label').textContent();
  const taxText = await page.locator('.summary_tax_label').textContent();
  const totalText = await page.locator('.summary_total_label').textContent();

  const subtotal = parseFloat(subtotalText?.replace('Item total: $', '') || '0');
  const tax = parseFloat(taxText?.replace('Tax: $', '') || '0');
  const total = parseFloat(totalText?.replace('Total: $', '') || '0');

  // Verify that subtotal coresponds price 
  expect(subtotal).toBeCloseTo(itemPrice, 2);

  // Verify that  total = subtotal + tax
  expect(total).toBeCloseTo(subtotal + tax, 2);

  // Click Finish
  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL(/checkout-complete/);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // Back Home
  await page.click('[data-test="back-to-products"]');
  await expect(page).toHaveURL(/inventory/);

  // Verify products displayed and cart empty
  const inventoryCount = await page.locator('.inventory_item').count();
  expect(inventoryCount).toBeGreaterThan(0);

  const cartBadgeCount = await page.locator('.shopping_cart_badge').count();
  expect(cartBadgeCount).toBe(0);
});
