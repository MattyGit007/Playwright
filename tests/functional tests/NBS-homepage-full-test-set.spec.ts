import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com');
  await page.locator('input[data-cy="searchFieldSearch"]').nth(1).fill('Dyson');
await page.getByRole('button', { name: 'search' }).click();
});

test('NBS homepage loads', async ({ page }) => {   
    await expect(page).toHaveTitle(/NBS/);
});

test('Click on I\'m a manufacturer', async ({ page }) => {
    await page.getByRole('link', { name: "I'm a manufacturer" }).click();
});

test('Click on Manufacturers', async ({ page }) => {
    await page.getByRole('link', { name: "I'm a manufacturer" }).click();
    await page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Manufacturers' }).click();
});

test('validate mdc tab links', async ({ page }) => {
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Products' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Manufacturers' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'CPD' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Literature' })).toBeVisible();
    await expect(page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Case studies' })).toBeVisible();   
});


// the below test will be skipped as the selector is not working, need to investigate and fix the selector

test.skip('validate mdc tab links test2', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Manufacturers' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Manufacturers', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CPD' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Literature', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Case studies', exact: true })).toBeVisible();   
});



test('Click on Case studies', async ({ page }) => {
    await page.locator('.mat-mdc-tab-links a').filter({ hasText: 'Case studies' }).click();
    
});

