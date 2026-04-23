import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://source.thenbs.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('dyson');
  await page.locator('a').filter({ hasText: /^Dyson$/ }).click();
  await page.getByRole('link', { name: 'Dyson Airblade™ 9kJ Hand' }).click();
});