

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://source.thenbs.com/en/');
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('dyson');
  await page.locator('a').filter({ hasText: /^Dyson$/ }).click();
});