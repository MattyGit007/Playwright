import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com');
  await page.locator('input[data-cy="searchFieldSearch"]').nth(1).fill('Dyson');
await page.getByRole('button', { name: 'search' }).click();
});

test('NBS homepage loads', async ({ page }) => {   
    await expect(page).toHaveTitle(/NBS/);
});

test('Click on I\'m a manufacturer', async ({ page }) => {
    await page.locator('a[mat-flat-button]:has-text("I\'m a manufacturer")').click();
});

test('Click on Manufacturers', async ({ page }) => {
    await page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Manufacturers' }).click();
});

test('validate mdc tab links', async ({ page }) => {
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Products' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Manufacturers' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'CPD' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Literature' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Case studies' })).toBeVisible();   
});
test('Click on Case studies', async ({ page }) => {
    await page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Case studies' }).click();
});

