import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com');
  await page.locator('input[data-cy="searchFieldSearch"]').nth(1).fill('Dyson');
await page.getByRole('button', { name: 'search' }).click();
});

test('NBS homepage accessibility test', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
});


test('homepage accessibility scan (pass and show issues in terminal)', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  console.log(`Found ${results.violations.length} accessibility issues`);
});

test('homepage accessibility scan (Pragmatic - expect 1 critical)', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter(
    v => v.impact === 'critical'
  );
  expect(critical.length).toBe(1);
});
