

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://source.thenbs.com/en/');

  // Focus search box and enter search term
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('dyson');

  // Click result AND wait for navigation (CI-safe)
  await Promise.all([
    page.waitForURL(/dyson/i),
    page.locator('a', { hasText: /^Dyson$/ }).click(),
  ]);
});