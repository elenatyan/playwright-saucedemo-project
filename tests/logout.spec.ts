//Test Case 0004: Verify that the user is able log out
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('verify burger menu expands, shows 4 items, and logout redirects to login page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Login on the page
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await loginPage.assertLoginSuccessful();

  // Click burger menu
  const burgerButton = page.locator('#react-burger-menu-btn');
  await burgerButton.click();

  //  Verify 4 menu items are visible
  const menuItems = page.locator('.bm-item.menu-item');
  await expect(menuItems).toHaveCount(4);

  const expectedItems = ['All Items', 'About', 'Logout', 'Reset App State'];
  for (const item of expectedItems) {
    await expect(page.locator(`.bm-item.menu-item >> text=${item}`)).toBeVisible();
  }

  // Click Logout
  await page.locator('#logout_sidebar_link').click();

  //Verify redirect to login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(loginPage.usernameField).toBeVisible();
  await expect(loginPage.passwordField).toBeVisible();

  // Verify username and password fields are empty
  await expect(loginPage.usernameField).toHaveValue('');
  await expect(loginPage.passwordField).toHaveValue('');
});
