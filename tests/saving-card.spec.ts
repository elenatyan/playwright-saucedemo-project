//Test Case 0005: Verify that card is saved after log out
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Full workflow: add to cart, menu, logout, relogin, cart', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page and login
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASSWORD);

  // Verify login successful (inventory page visible)
  await loginPage.assertLoginSuccessful();

  // Adding first product to cart
  const firstAddToCart = page.locator('.inventory_item button.btn_primary').first();
  await firstAddToCart.click();

  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');

  // Click on burger menu
  await page.click('#react-burger-menu-btn');

  const menuItems = page.locator('.bm-item-list a');
  await expect(menuItems).toHaveCount(4);

  //  Click logout
  await page.click('#logout_sidebar_link');

  // Verify redirected to login page and fields are empty
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('#user-name')).toHaveValue('');
  await expect(page.locator('#password')).toHaveValue('');

  // Step 4: Login again
  await loginPage.login(VALID_USER, VALID_PASSWORD);
  await loginPage.assertLoginSuccessful();

  // Verify cart badge still shows 1
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Step 5: Click on Cart
  await page.click('.shopping_cart_link');

  // Verify cart page
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('.cart_item')).toHaveCount(1);
});
