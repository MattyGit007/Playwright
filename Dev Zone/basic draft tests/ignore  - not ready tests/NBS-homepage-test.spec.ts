import { test, expect } from '@playwright/test';

test('NBS homepage loads', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
});

test('Accept cookies button', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
});
test('Search for Dyson', async ({ page }) => {
    await page.goto('source.thenbs.com');
    await expect(page).toHaveTitle(/NBS/);
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    await page.getByPlaceholder('Search theNBS.com').fill('Dyson');
    //await page.getByRole('button', { name: 'submit' }).click();
    await page.locator('button[title="Search theNBS.com"]').click();
    await page.waitForTimeout(5000);
});