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
});

test("Verify back to top button functionality", async ({ request, page }) => {
  const backToTopButton = page.getByRole("button", {
    name: "Back to top of page",
  });

  // Validate button is NOT visible at top of page
  await expect(backToTopButton).not.toBeVisible();

  // Scroll down the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Validate button IS visible after scrolling
  await expect(backToTopButton).toBeVisible();
  await page.getByRole("button", { name: "Back to top of page" }).click();
});
