// Test Case 0003: Verify login with invalid username
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const INVALID_USER = 'standarD_user'; // неправильний логін
const VALID_PASSWORD = 'secret_sauce';

test('Check error message with wrong username on SauceDemo', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Login with invalid username
  await loginPage.loginWithInvalidUsername(INVALID_USER, VALID_PASSWORD);

  // Verify error message
  await loginPage.assertErrorMessage(
    'Epic sadface: Username and password do not match any user in this service'
  );

  // Verify input fields highlighted in red
  await loginPage.assertInputErrorStyles();

  // Verify X icons visible
  await loginPage.assertErrorIconsVisible();
});
