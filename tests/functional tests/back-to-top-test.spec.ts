import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("https://source.thenbs.com/en/");

  // Focus search box and enter search term
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("dyson");
  

  // Click result AND wait for navigation (CI-safe)
  await Promise.all([
    page.waitForURL(/dyson/i),
    page.locator("a", { hasText: /^Dyson$/ }).click(),
    ]);
    await expect(page).toHaveTitle(/Dyson/i);
  
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
