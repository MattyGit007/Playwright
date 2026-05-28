// FILE: NBS-homepage-full-test-set.spec.ts
//
// Purpose: A full suite of functional tests for the Dyson manufacturer page on NBS Source.
// Tests cover navigation links, page content visibility, and the order of nav items.
//
// All tests share the same starting point (Dyson manufacturer page) which is set up
// in beforeEach — so each test only needs to describe what it checks, not how to get there.

// `test` and `expect` come from our fixtures file (NOT "@playwright/test").
// That is what makes `homePage`, `dysonPage` etc. available in the tests below.
import { test, expect } from "../../fixtures/test-fixtures";
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

// increase the default test timeout for this file since page loads and interactions can take a while
test.describe.configure({ timeout: 60000 });

// beforeEach runs automatically before every test in this file.
// It navigates to the NBS Source homepage, searches for "Dyson", and lands on
// the Dyson manufacturer page — ready for each test to begin.
test.beforeEach(async ({ homePage }) => {
  await homePage.goto();
  await homePage.searchForManufacturer("Dyson");
});

// Test 1: Verifies the 'Im a manufacturer' button is visible, shows expected text and has the correct underlying href.
test("1 Validate the I'm a manufacturer button features", async ({ dysonPage }) => {
  await dysonPage.verifyImAManufacturerButton();
});

// Test 2: Verifies the 'Inspiration' button is visable, shows expected text and has the correct underlying href.
test("2 Inspiration nav button is visible and has correct href", async ({ dysonPage }) => { 
  await dysonPage.verifyInspirationNavButton();
});

// Test 3: Checks that all nav items are present AND appear in the correct left-to-right order.
// We use boundingBox() to get each element's pixel position, then assert each x coordinate
// is greater than or equal to the previous one — confirming the expected visual order.
test("3 validate app view container contents and order", async ({ dysonPage, page }) => {
 await dysonPage.verifyAppViewContainerContents();
});

// Test 4: Validates the login process via the "Sign in" button, ensuring the user is returned to the same page and sees their initials in the user menu after logging in.
test("4 Test login via sign in button and same page confirmation", async ({dysonPage, page }) => {
  await dysonPage.verifyLoginFunctionality();
});
 


//Test 5: Validates the "Back to top" button appears after scrolling down, successfully scrolls the page back to the top when clicked, and then hides itself again.
test("5 Verify back to top button functionality", async ({ page }) => {
  // Find the back-to-top button using its data-cy test ID attribute.
  const backToTopButton = page.locator('[data-cy="backToTopButton"]');

  // The button should be hidden at the top of the page — no need to show it until the user scrolls.
  await expect(backToTopButton).not.toBeVisible();

  // Force an instant jump to the bottom — bypasses CSS smooth-scroll animation
  // which behaves differently in headed vs headless mode and races with the assertions.
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
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

// Test 6: Runs an AXE accessibility scan on the Dyson manufacturer page and generates an HTML report of any issues found.
test("6 Dyson manufacturer page Accessibility test", async ({ page }) => {
  // Run an AXE accessibility scan against the current page (set up in beforeEach).
  // `analyze()` returns an object containing violations, passes, incomplete checks, etc.
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // Convert the raw AXE results into a human-readable HTML report...
  const html = createHtmlReport({ results: accessibilityScanResults });
  // ...and write it to disk in the project root so it can be opened in a browser.
  fs.writeFileSync("axe-report.html", html);
});

//Test 7: Verifies the OneTrust geolocation API returns a valid country code and that the NBS website reflects this location in the UI.
// This test has two phases:
//   Phase 1 — hit the OneTrust geolocation API directly and validate the JSON response.
//   Phase 2 — open the NBS website in the browser and confirm the UI reflects the same country.
test("7 Verify API content and UI display", async ({ request, page }) => {
  // 1. Call the OneTrust geolocation API directly (no browser involved here).
  const response = await request.get(
    "https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location",
  );

  // 2. Verify the API responded successfully (HTTP 200 = OK).
  expect(response.status()).toBe(200);

  // 3. Validate API response body.
  // The response uses JSONP format — it wraps JSON in a function call like: jsonFeed({...});
  // We strip the wrapper with .replace() so we can parse the inner JSON normally.
  const responseText = await response.text();
  const jsonString = responseText
    .replace(/^jsonFeed\(/, "")
    .replace(/\);?$/, "");

  const body = JSON.parse(jsonString);
  // Confirm the response contains a "country" field and it's one of the expected values.
  expect(body).toHaveProperty("country");
  expect(["GB", "US"]).toContain(body.country);

  // 4. Now open the NBS website in the browser and check the UI shows the correct country.
  await page.goto("https://source.thenbs.com");
  const countryButton = page.getByRole("button", {
    name: "Choose location and language",
  });
  // The country picker button should display "UK" when the detected country is GB.
  await expect(countryButton).toContainText("UK");
});
