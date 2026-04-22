import { test, expect } from '@playwright/test';

test('Click on Manufacturers', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
    await page.locator('input[data-cy="searchFieldSearch"]').nth(1).fill('Dyson');
    await page.getByRole('button', { name: 'search' }).click();
    //await page.waitForTimeout(5000);
    // await page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Manufacturers' }).click();
    await page.getByRole('link', { name: "I'm a manufacturer" }).click();
    await page.waitForTimeout(5000);
});


