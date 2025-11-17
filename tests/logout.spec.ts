// Test Case 0004: Verify that the user is able to log out
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('verify burger menu expands, shows 4 items, and logout redirects to login page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Login and verify
  await loginPage.loginAndVerify('standard_user', 'secret_sauce');

  // Open burger menu
  await loginPage.openBurgerMenu();

  // Verify menu items
  const expectedItems = ['All Items', 'About', 'Logout', 'Reset App State'];
  await loginPage.assertMenuItemsVisible(expectedItems);

  // Click Logout
  await loginPage.logout();

  // Verify redirected to login page
  await loginPage.assertOnLoginPage();
});
