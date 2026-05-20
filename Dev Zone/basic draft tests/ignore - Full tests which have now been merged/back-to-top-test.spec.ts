// FILE: back-to-top-test.spec.ts
//
// Purpose: Verifies the "back to top" button behaviour on the Dyson manufacturer page.
// The button should only appear once the user scrolls down, scroll the page back to the
// top when clicked, and then hide itself again once back at the top.
//
// The button is found using a data-cy attribute (data-cy="backToTopButton") — these are
// custom test IDs added by developers specifically to make elements easy to target in tests.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// increase the default test timeout for this file since page loads and interactions can take a while
test.describe.configure({ timeout: 60000 });

// beforeEach runs automatically before every test in this file.
// It navigates to NBS Source and lands on the Dyson manufacturer page.
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

test("Verify back to top button functionality", async ({ page }) => {
  // Find the back-to-top button using its data-cy test ID attribute.
  const backToTopButton = page.locator('[data-cy="backToTopButton"]');

  // The button should be hidden at the top of the page — no need to show it until the user scrolls.
  await expect(backToTopButton).not.toBeVisible();

  // Force an instant jump to the bottom — bypasses CSS smooth-scroll animation
  // which behaves differently in headed vs headless mode and races with the assertions.
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });

  // After scrolling down, the button should now be visible.
  await expect(backToTopButton).toBeVisible({ timeout: 10000 });

  // Click the button to scroll back to the top.
  await backToTopButton.click();

  // Use expect.poll to repeatedly check window.scrollY until it equals 0.
  // This is CI-safe because scroll animations can take a moment to complete.
  // window.scrollY is the current vertical scroll position (0 = top of page).
  await expect
    .poll(async () => page.evaluate(() => window.scrollY), { timeout: 10000 })
    .toBe(0);

  // Once back at the top, the button should hide itself again.
  await expect(backToTopButton).not.toBeVisible({ timeout: 10000 });
});
