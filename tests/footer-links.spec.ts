//Test Case 0007: Verify that the user is able to navigate through Social Links
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Social links in footer open new tabs reliably', async ({ page, context }) => {
  const loginPage = new LoginPage(page);

  // Login on the page
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASSWORD);
  await loginPage.assertLoginSuccessful();

  // Verify that footer is visible
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  // Socials selectors 
  const socialLinksSelectors = [
    { selector: '.footer a[href*="twitter.com"]', expected: 'x.com' },
    { selector: '.footer a[href*="facebook.com"]', expected: 'facebook.com' },
    { selector: '.footer a[href*="linkedin.com"]', expected: 'linkedin.com' }
  ];

  for (const link of socialLinksSelectors) {
    const href = await page.locator(link.selector).getAttribute('href');
    expect(href).not.toBeNull();

    // Open new tab 
    const newPage = await context.newPage();
    await newPage.goto(href!);
    console.log('Opened social page:', newPage.url());
    expect(newPage.url()).toContain(link.expected);
    await newPage.close();
  }
});
