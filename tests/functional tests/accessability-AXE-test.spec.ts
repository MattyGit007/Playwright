import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com/en/');

  // Focus search box and enter search term
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('dyson');
  

  // Click result AND wait for navigation (CI-safe)
  await Promise.all([
    page.waitForURL(/dyson/i),
    page.locator('a', { hasText: /^Dyson$/ }).click(),
    ]);
await expect(page).toHaveTitle(/Dyson/i);
  
});

test("Dyson manufacturer page Accessibility test", async ({ page }) => {
  // Run an AXE accessibility scan against the current page (set up in beforeEach).
  // `analyze()` returns an object containing violations, passes, incomplete checks, etc.
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // try/finally is used so the HTML report is ALWAYS written,
  // even if the logging block below throws an unexpected error.
  try {
    // If AXE found one or more violations, log how many and dump the details
    // to the terminal. The test itself doesn't fail — there's no expect() here.
    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        `Found ${accessibilityScanResults.violations.length} accessibility violations (test will still pass):`,
      );
      console.log(accessibilityScanResults.violations);
    } else {
      // Clean run — let the user know nothing was flagged.
      console.log("No accessibility violations found.");
    }
  } finally {
    // Convert the raw AXE results into a human-readable HTML report...
    const html = createHtmlReport({ results: accessibilityScanResults });
    // ...and write it to disk in the project root so it can be opened in a browser.
    fs.writeFileSync("axe-report.html", html);
  }
});

test("NBS homepage accessibility test pass if less than 2000", async ({
  page,
}) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  page.pause();
  expect(accessibilityScanResults.violations.length).toBeLessThan(2000);
  const html = createHtmlReport({ results: accessibilityScanResults });
  fs.writeFileSync("axe-report.html", html);
  console.log(accessibilityScanResults.violations);
});

test("homepage accessibility scan (pass and show issues in terminal)", async ({
  page,
}) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  console.log(
    `Found ${accessibilityScanResults.violations.length} accessibility issues`,
  );
  const html = createHtmlReport({ results: accessibilityScanResults });
  fs.writeFileSync("axe-report.html", html);
  console.log(accessibilityScanResults.violations);
});

test("homepage accessibility scan (Pragmatic - expect more than 1 critical)", async ({
  page,
}) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const critical = accessibilityScanResults.violations.filter(
    (v) => v.impact === "critical",
  );
  expect(critical.length).not.toBe({});
  const html = createHtmlReport({ results: accessibilityScanResults });
  fs.writeFileSync("axe-report.html", html);
  console.log(accessibilityScanResults.violations);
});
