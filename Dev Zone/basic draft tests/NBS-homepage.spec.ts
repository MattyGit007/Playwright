import { test, expect } from '@playwright/test';

test('NBS homepage loads', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
});

test('Search for Dyson', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
    await page.locator('input[data-cy="searchFieldSearch"]').nth(1).fill('Dyson');
    await page.getByRole('button', { name: 'search' }).click();
    await page.waitForTimeout(5000);
});


