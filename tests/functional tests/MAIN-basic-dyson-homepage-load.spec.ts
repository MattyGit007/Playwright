// FILE: MAIN-basic-dyson-homepage-load.spec.ts
//
// Purpose: This is the foundational setup file for the test suite.
// It contains the shared beforeEach hook that all other spec files also use —
// navigating to NBS Source and landing on the Dyson manufacturer page.
//
// Currently this file contains no tests of its own. It acts as a reference
// for the standard page setup pattern and is a good place to add basic
// smoke tests (e.g. "page loads without errors") in the future.

import { test, expect } from '@playwright/test';

// beforeEach runs automatically before every test in this file.
// It navigates to the NBS Source homepage, searches for "Dyson" via the search box,
// and clicks through to the Dyson manufacturer page — ready for tests to begin.
test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com/en/');

  // Retry the search up to 3 times in case the autocomplete dropdown is slow to appear.
  const maxAttempts = 3;
  let attempt = 0;
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const dysonResult = page.locator('a', { hasText: /^Dyson$/ });

  while (attempt < maxAttempts) {
    attempt++;
    try {
      // Wait for the page HTML to be fully loaded before interacting with it.
      await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

      // Clears any prior value then types character-by-character to trigger the autocomplete debounce.
      await searchBox.click();
      await searchBox.fill('');
      await searchBox.type('Dyson', { delay: 150 });
      // Short pause to let the autocomplete dropdown populate after the final keystroke.
      await page.waitForTimeout(600);

      await dysonResult.waitFor({ state: 'visible', timeout: 20000 });

      if (await dysonResult.isVisible()) {
        // Promise.all ensures we don't miss the navigation event triggered by the click.
        await Promise.all([
          page.waitForURL(/dyson/i, { timeout: 30000 }),
          dysonResult.click(),
        ]);
        return;
      }
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
    }

    // Reloads the page before the next attempt if the dropdown did not appear.
    if (attempt < maxAttempts && !page.isClosed()) {
      await page.reload({ waitUntil: "domcontentloaded", timeout: 20000 });
    }
  }
});