import {test, expect} from '@playwright/test';

test('able to select an option', async ({ page }) => {
  // Go to the dropdown page
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  // Select the first option (Option 1)
  await page.locator('#dropdown').selectOption({ label: 'Option 1' });

  // Verify that Option 1 is selected
  const selectedOption = await page.locator('#dropdown').inputValue();
  expect(selectedOption).toBe('1');
});

test('able to select multiple options', async ({ page }) => {
    // Go to the dropdown page
    await page.goto('https://output.jsbin.com/osebed/2');

    await page.locator('#fruits').selectOption(['apple', 'banana']);
    
    await expect(page
        .locator('#fruits > option:checked'))
        .toHaveText(['Banana','Apple']); // expect
});