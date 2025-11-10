//Test Case 0006: Verify sorting of products 
import { test, expect, Locator } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Inventory sorting verification', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //  Login
  await loginPage.goto();
  await loginPage.login(VALID_USER, VALID_PASSWORD);
  await loginPage.assertLoginSuccessful();

  //  Sorting options
  const sortingSelect = page.locator('.product_sort_container');
  const productNames = page.locator('.inventory_item_name');
  const productPrices = page.locator('.inventory_item_price');

  const sortingOptions = [
    { value: 'lohi', type: 'price', order: 'asc' },
    { value: 'hilo', type: 'price', order: 'desc' },
    { value: 'az', type: 'name', order: 'asc' },
    { value: 'za', type: 'name', order: 'desc' },
  ];

  for (const option of sortingOptions) {
    await sortingSelect.selectOption(option.value);

    // Wait a bit for UI to update
    await page.waitForTimeout(500);

    if (option.type === 'name') {
      const names = await productNames.allTextContents();
      const sortedNames = [...names].sort();
      if (option.order === 'desc') sortedNames.reverse();
      expect(names).toEqual(sortedNames);
    }

    if (option.type === 'price') {
      const pricesText = await productPrices.allTextContents(); // ["$7.99", "$15.99"]
      const prices = pricesText.map(p => parseFloat(p.replace('$', '')));
      const sortedPrices = [...prices].sort((a, b) => a - b);
      if (option.order === 'desc') sortedPrices.reverse();
      expect(prices).toEqual(sortedPrices);
    }
  }
});
