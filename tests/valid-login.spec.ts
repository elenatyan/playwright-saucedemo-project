//Test Case 0001: Verify valid login 
import { test, expect } from '@playwright/test';

test('should successfully login and display inventory page with products and cart', async ({ page }) => {
  // Open login page
await page.goto('https://www.saucedemo.com/');

//Locate username field
const usernameField = page.locator('#user-name');

// Enter invalid username
const username = 'standard_user';
await usernameField.fill(username);

//Verify that the field contains entered value
const enteredValue = await usernameField.inputValue();
expect(enteredValue).toBe(username);

//Check that the field is visible and enabled
await expect(usernameField).toBeVisible();
await expect(usernameField).toBeEnabled();

//Locate password field
const passwordField = page.locator('#password');
//Type the password (use type() instead of fill() for reliability)
const password = 'secret_sauce';
await passwordField.click();
await passwordField.fill(''); // clear field if needed
await passwordField.type(password);

// Verify field contains entered value
const enteredpasswordValue = await passwordField.inputValue();
expect(enteredpasswordValue).toBe(password);

// Verify field type is "password" (masked)
const typeAttr = await passwordField.getAttribute('type');
expect(typeAttr).toBe('password');
  
//Click Login button
page.click('#login-button');

  // Step 3: Verify the user is on the inventory page
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // Step 4: Verify inventory container is visible
  const inventoryContainer = page.locator('[data-test="inventory-container"]');
  await expect(inventoryContainer).toBeVisible();

  // Step 5: Verify at least one product is displayed
  const products = page.locator('.inventory_item');
  const productCount = await products.count();
  expect(productCount).toBeGreaterThan(0);

  // Step 6: Verify the shopping cart icon is visible
  const cartIcon = page.locator('.shopping_cart_link');
  await expect(cartIcon).toBeVisible();

  // Optional: Verify title of the page
  await expect(page.locator('.title')).toHaveText('Products');
});
