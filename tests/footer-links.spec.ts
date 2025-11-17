// Test Case 0007: Verify that the user is able to navigate through Social Links
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { FooterPage } from '../pages/FooterPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Social links in footer open new tabs reliably', async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  const footerPage = new FooterPage(page, context);

  // Login using new unified POM method
  await loginPage.loginAndVerify(VALID_USER, VALID_PASSWORD);

  // Validate footer + social navigation
  await footerPage.assertFooterVisible();
  await footerPage.verifyAllSocialLinks();
});
