// Test Case 0006: Verify sorting of products
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test('Inventory sorting verification', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Login using existing LoginPage method
  await loginPage.loginAndVerify(VALID_USER, VALID_PASSWORD);

  const sortingOptions = [
    { value: 'lohi', type: 'price', order: 'asc' },
    { value: 'hilo', type: 'price', order: 'desc' },
    { value: 'az', type: 'name', order: 'asc' },
    { value: 'za', type: 'name', order: 'desc' },
  ];

  for (const option of sortingOptions) {
    await inventoryPage.selectSortingOption(option.value);

    if (option.type === 'name') {
      const names = await inventoryPage.getProductNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      if (option.order === 'desc') sorted.reverse();
      expect(names).toEqual(sorted);
    }

    if (option.type === 'price') {
      const prices = await inventoryPage.getProductPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      if (option.order === 'desc') sorted.reverse();
      expect(prices).toEqual(sorted);
    }
  }
});
