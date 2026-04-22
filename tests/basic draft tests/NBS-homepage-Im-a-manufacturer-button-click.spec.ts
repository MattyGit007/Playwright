import { test, expect } from '@playwright/test';

test('Click on I\'m a manufacturer', async ({ page }) => {
    await page.goto('https://source.thenbs.com');
    await page.waitForLoadState('networkidle');

    await page.locator('a[mat-flat-button]:has-text("I\'m a manufacturer")').click();

    // await page.waitForTimeout(5000);
});


