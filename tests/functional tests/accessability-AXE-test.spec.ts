import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto('https://source.thenbs.com/en/');
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.keyboard.type('dyson');
  await page.locator('a').filter({ hasText: /^Dyson$/ }).click();
});
test("NBS homepage accessibility test pass if less than 2000", async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations.length).toBeLessThan(2000);
  const html = createHtmlReport({ results: accessibilityScanResults });
  fs.writeFileSync("axe-report.html", html);
  console.log(accessibilityScanResults.violations);
});

test("homepage accessibility scan (pass and show issues in terminal)", async ({
  page,
}) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  console.log(`Found ${accessibilityScanResults.violations.length} accessibility issues`);
const html = createHtmlReport({ results: accessibilityScanResults });
  fs.writeFileSync("axe-report.html", html);
  console.log(accessibilityScanResults.violations);

});

test("homepage accessibility scan (Pragmatic - expect more than 1 critical)", async ({
  page,
}) => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const critical = accessibilityScanResults.violations.filter((v) => v.impact === "critical");
  expect(critical.length).not.toBe({});
  const html = createHtmlReport({ results: accessibilityScanResults });
  fs.writeFileSync("axe-report.html", html);
  console.log(accessibilityScanResults.violations);
});

