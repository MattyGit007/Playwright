// FILE: accessability-AXE-test.spec.ts
//
// Purpose: Runs an automated accessibility audit against the Dyson manufacturer
// page on NBS Source using the AXE engine (industry-standard accessibility tool).
// The results are written to axe-report.html in the project root so they can be
// opened in any browser for easy review.
//
// Tools used:
//   - @axe-core/playwright  : runs AXE accessibility rules against a live page
//   - axe-html-reporter     : turns the raw AXE JSON results into a readable HTML report
//   - fs (Node built-in)    : writes the HTML report file to disk

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

// increase the default test timeout for this file since AXE scans can take a while on complex pages
test.describe.configure({ timeout: 60000 });

// beforeEach runs automatically before every test in this file.
// It navigates to the NBS Source homepage and searches for "Dyson" so that each
// test starts on the Dyson manufacturer page — no duplication needed inside tests.
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

test("Dyson manufacturer page Accessibility test", async ({ page }) => {
  // Run an AXE accessibility scan against the current page (set up in beforeEach).
  // `analyze()` returns an object containing violations, passes, incomplete checks, etc.
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // Convert the raw AXE results into a human-readable HTML report...
  const html = createHtmlReport({ results: accessibilityScanResults });
  // ...and write it to disk in the project root so it can be opened in a browser.
  fs.writeFileSync("axe-report.html", html);
});

// test("NBS homepage accessibility test pass if less than 2000", async ({
//   page,
// }) => {
//   const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
//   page.pause();
//   expect(accessibilityScanResults.violations.length).toBeLessThan(2000);
//   const html = createHtmlReport({ results: accessibilityScanResults });
//   fs.writeFileSync("axe-report.html", html);
//   console.log(accessibilityScanResults.violations);
// });

// test("homepage accessibility scan (pass and show issues in terminal)", async ({
//   page,
// }) => {
//   const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
//   console.log(
//     `Found ${accessibilityScanResults.violations.length} accessibility issues`,
//   );
//   const html = createHtmlReport({ results: accessibilityScanResults });
//   fs.writeFileSync("axe-report.html", html);
//   console.log(accessibilityScanResults.violations);
// });

// test("homepage accessibility scan (Pragmatic - expect more than 1 critical)", async ({
//   page,
// }) => {
//   const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
//   const critical = accessibilityScanResults.violations.filter(
//     (v) => v.impact === "critical",
//   );
//   expect(critical.length).not.toBe({});
//   const html = createHtmlReport({ results: accessibilityScanResults });
//   fs.writeFileSync("axe-report.html", html);
//   console.log(accessibilityScanResults.violations);
// });
