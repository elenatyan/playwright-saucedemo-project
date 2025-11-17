// Test Case 0002: Verify login with invalid password
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const INVALID_PASSWORD = 'wrong_pass';
const VALID_USER = 'standard_user';

test('Check error message with wrong password on SauceDemo', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Login with invalid password
  await loginPage.loginWithInvalidPassword(VALID_USER, INVALID_PASSWORD);

  // Verify error message
  await loginPage.assertErrorMessage(
    'Epic sadface: Username and password do not match any user in this service'
  );

  // Verify input fields highlighted in red
  await loginPage.assertInputErrorStyles();

  // Verify X icons visible
  await loginPage.assertErrorIconsVisible();
});
