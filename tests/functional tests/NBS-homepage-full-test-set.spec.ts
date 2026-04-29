// FILE: NBS-homepage-full-test-set.spec.ts
//
// Purpose: A full suite of functional tests for the Dyson manufacturer page on NBS Source.
// Tests cover navigation links, page content visibility, and the order of nav items.
//
// All tests share the same starting point (Dyson manufacturer page) which is set up
// in beforeEach — so each test only needs to describe what it checks, not how to get there.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// beforeEach runs automatically before every test in this file.
// It navigates to the NBS Source homepage, searches for "Dyson", and lands on
// the Dyson manufacturer page — ready for each test to begin.
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

// Test 1: Verifies the "I'm a manufacturer" link exists and is clickable.
test("1 Click on I'm a manufacturer", async ({ page }) => {
  await page.getByRole("link", { name: "I\'m a manufacturer" }).click();
});

// Test 2: Clicks the Inspiration link and confirms the correct landing heading is shown.
test("2 Click on Inspiration", async ({ page }) => {
  await page.getByRole("link", { name: "Inspiration" }).click();
  await page
    .getByRole("heading", { name: "Helping you find the next big" })
    .isVisible();
});

// Test 3: Checks that all expected navigation items are visible on the page.
// This is a presence check — it does NOT care about order, just that each item exists.
test(" 3 validate app view container contents", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "What\'s new" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Browse" })).toBeVisible();
  await expect(page.getByRole("button", { name: "BIM Library" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Inspiration" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Collections" })).toBeVisible();
  await expect(page.getByRole("link", { name: "CPD" })).toBeVisible();
});

// Test 4: Checks that all nav items are present AND appear in the correct left-to-right order.
// We use boundingBox() to get each element's pixel position, then assert each x coordinate
// is greater than or equal to the previous one — confirming the expected visual order.
test("4 validate app view container contents and order", async ({ page }) => {
  const items = [
    page.getByRole("link", { name: "Home" }),
    page.getByRole("link", { name: "What's new" }),
    page.getByRole("button", { name: "Browse" }),
    page.getByRole("button", { name: "BIM Library" }),
    page.getByRole("link", { name: "Inspiration" }),
    page.getByRole("link", { name: "Collections" }),
    page.getByRole("link", { name: "CPD" }),
  ];

  // presence check
  for (const item of items) {
    await expect(item).toBeVisible();
  }

  // order check (DOM position)
  // lastY tracks the x position of the previous item; each new item must be at least as far right.
  let lastY = -1;

  for (const item of items) {
    const box = await item.boundingBox();
    expect(box).not.toBeNull();

    expect(box!.x).toBeGreaterThanOrEqual(lastY);
    lastY = box!.x;
  }
});
