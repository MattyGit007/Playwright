import { test, expect } from '@playwright/test';


test('validate mdc tab links', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
    await page.locator('input[data-cy="searchFieldSearch"]').nth(1).fill('Dyson');
    await page.getByRole('button', { name: 'search' }).click();
    //await page.waitForTimeout(5000);
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Products' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Manufacturers' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'CPD' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Literature' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Case studies' })).toBeVisible();
    
});
