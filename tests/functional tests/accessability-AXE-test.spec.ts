import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

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
