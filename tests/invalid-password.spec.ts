//Test Case 0002: Verify login with invalid password 
import {test, expect, Page} from '@playwright/test';
test('Check  error message with wrong password on SauceDemo', async ({page}) => {
// Open login page
await page.goto('https://www.saucedemo.com/');

//Locate username field
const usernameField = page.locator('#user-name');

// Enter  username
const username = 'standard_user';
await usernameField.fill(username);

//Verify that the field contains entered value
const enteredValue = await usernameField.inputValue();
expect(enteredValue).toBe(username);

//Check that the field is visible and enabled
await expect(usernameField).toBeVisible();
await expect(usernameField).toBeEnabled();

//Locate invalid password field
const passwordField = page.locator('#password');
//Type the password (use type() instead of fill() for reliability)
const password = 'wrong_pass';
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
//Verify that error message is displayed 
const errorMessage =page.locator('[data-test="error"]');
await expect(errorMessage).toBeVisible();

//Verify that error message displays corresponding text
await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');

//Check that the close button  error message is displayed
const closeButton = page.locator('button.error-button');
await expect(closeButton).toBeVisible();

//Verify that both inputs are highlighted with red border
const usernameInput = page.locator('#user-name');
const passwordInput = page.locator('#password');

const usernameBorderColor = await usernameInput.evaluate((element) => {
    return window.getComputedStyle(element).borderBottomColor;
});
const passwordBorderColor = await passwordInput.evaluate((element) => {
    return window.getComputedStyle(element).borderBottomColor;
});
console.log('Username border color:', usernameBorderColor);
console.log('Passwordborder color:', passwordBorderColor);

//verify that highlighed red color is rgb(226, 35, 26)
expect(usernameBorderColor).toBe('rgb(226, 35, 26)');
expect(usernameBorderColor).toBe('rgb(226, 35, 26)');

//Verify that X icons are displayed inside both fields
const usernameErrorIcon = page.locator('[data-test="error"] + div svg');

//Check that the X icons are separate <svg> elements positioned absolutely inside inputs
const usernameErrorIconVisible = await page.locator('.error_icon').nth(0).isVisible;
const passwordErrorIconVisible = await page.locator('.error_icon').nth(1).isVisible;

expect(usernameErrorIconVisible).toBeTruthy;
expect(passwordErrorIconVisible).toBeTruthy;
});