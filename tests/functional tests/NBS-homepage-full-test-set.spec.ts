// FILE: NBS-homepage-full-test-set.spec.ts
//
// Purpose: A full suite of functional tests for the Dyson manufacturer page on NBS Source.
// Tests cover navigation links, page content visibility, and the order of nav items.
//
// All tests share the same starting point (Dyson manufacturer page) which is set up
// in beforeEach — so each test only needs to describe what it checks, not how to get there.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// increase the default test timeout for this file since page loads and interactions can take a while
test.describe.configure({ timeout: 60000 });

// beforeEach runs automatically before every test in this file.
// It navigates to the NBS Source homepage, searches for "Dyson", and lands on
// the Dyson manufacturer page — ready for each test to begin.
test.beforeEach(async ({ page }) => {
  await page.goto("https://source.thenbs.com/en/");

  // The search box at the top of the page. We pick the visible one because the
  // page has a hidden copy used on mobile screens.
  const searchField = page
    .locator('[data-cy="searchFieldSearch"]')
    .filter({ visible: true })
    .first();
  // The dropdown panel that appears under the search box as you type.
  const searchAutocomplete = page.locator("app-autocomplete");
  // The "Dyson" link inside the dropdown's Manufacturers section.
  // We target the manufacturers section so we don't accidentally click one
  // of the product results listed below it.
  const dysonManufacturerOption = page.locator(
    'app-autocomplete article.manufacturers a[href*="/manufacturer/dyson/"]',
  );

  // Try the search up to 3 times in case the dropdown is slow to show up.
  const maxAttempts = 3;
  const dropdownTimeout = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Wait for the page to load before typing, otherwise the search box
      // might not be ready and our keystrokes get lost.
      await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

      // Click the box, clear it, then type "Dyson" one letter at a time.
      // The small delay gives the site time to react to each keystroke.
      await searchField.click();
      await searchField.fill("");
      await searchField.pressSequentially("Dyson", { delay: 100 });

      // Wait up to 5 seconds for the dropdown to appear.
      try {
        await searchAutocomplete.waitFor({
          state: "visible",
          timeout: dropdownTimeout,
        });
      } catch {
        // If the dropdown didn't open, clear the box and type again.
        // This usually fixes it without needing to reload the page.
        await searchField.fill("");
        await searchField.pressSequentially("Dyson", { delay: 100 });
        await searchAutocomplete.waitFor({
          state: "visible",
          timeout: dropdownTimeout,
        });
      }

      // Click the Dyson result AND wait for the URL to change to the Dyson page.
      // Doing both together means the test fails if the click doesn't navigate,
      // instead of silently carrying on.
      await Promise.all([
        page.waitForURL(/\/manufacturer\/dyson\//, { timeout: 30000 }),
        dysonManufacturerOption.click({ timeout: 10000 }),
      ]);
      return;
    } catch (error) {
      // Log the failure so we can see it in the test output, then try again.
      console.warn(`Attempt ${attempt} to search for "Dyson" failed:`, error);
    }

    // If this wasn't the last attempt, reload the page and try again.
    if (attempt < maxAttempts && !page.isClosed()) {
      await page.reload({ waitUntil: "domcontentloaded", timeout: 20000 });
    }
  }

  // We ran out of attempts and never reached the Dyson page.
  throw new Error(
    `Failed to find and click the "Dyson" search result after ${maxAttempts} attempts (with page reloads).`,
  );
});

// Test 1: Verifies the 'Im a manufacturer' button is visable, shows expected text and has the correct underlying href.
test("1 Validate the I'm a manufacturer button features", async ({ page }) => {
  // Checks that the link is visible
  await expect(
    page.getByRole("link", { name: "I\'m a manufacturer" }),
  ).toBeVisible();
  // expect the link to show the text "I'm a manufacturer" (case-insensitive) to confirm it's the correct element
  await expect(
    page.getByRole("link", { name: "I\'m a manufacturer" }),
  ).toHaveText(/i\'?m a manufacturer/i);
  // Checks that the link has an href attribute pointing to a manufacturer-related URL
  await expect(
    page.getByRole("link", { name: "I\'m a manufacturer" }),
  ).toHaveAttribute("href", /manufacturer/);
});

// Test 2: Verifies the 'Inspiration' button is visable, shows expected text and has the correct underlying href.
test("2 Inspiration nav button is visible and has correct href", async ({
  page,
}) => {
  const inspirationNavButton = page.locator('[data-cy="inspirationNavButton"]');

  // 1. Validate the link is visible
  await expect(inspirationNavButton).toBeVisible();

  // 2. Validate the underlying href
  await expect(inspirationNavButton).toHaveAttribute("href", "/en/inspiration");
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
