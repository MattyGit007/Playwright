import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com/en/');

  const maxAttempts = 3;
  let attempt = 0;
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const dysonResult = page.locator('a', { hasText: /^Dyson$/ });

  while (attempt < maxAttempts) {
    attempt++;
    try {
      await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

      // Clears any prior value then types character-by-character to trigger the autocomplete debounce.
      await searchBox.click();
      await searchBox.fill('');
      await searchBox.type('Dyson', { delay: 150 });
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
 const backToTopButton = page.locator('[data-cy="backToTopButton"]');

  // Validate button is NOT visible at top of page
  await expect(backToTopButton).not.toBeVisible();

  // Scroll down the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Validate button IS visible after scrolling
  await expect(backToTopButton).toBeVisible();
  
 // Click back to top
  await backToTopButton.click();

// Assert scroll position returned to top (CI-safe)
  await expect
    .poll(async () => page.evaluate(() => window.scrollY))
    .toBe(0);

    // Validate button is NOT visible after scrolling
  await expect(backToTopButton).not.toBeVisible();

});
