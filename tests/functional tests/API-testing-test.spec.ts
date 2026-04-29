// FILE: API-testing-test.spec.ts
//
// Purpose: An integration test that combines a direct API call with a UI assertion.
// It calls the OneTrust geolocation API to check the detected country, then opens the
// NBS Source website and confirms the UI is showing the matching country flag/label.
//
// This pattern is useful for verifying that a backend API and the front-end UI agree
// on the same data — if the API says "GB" but the UI shows "US", there's a bug.
//
// Note: `request` is Playwright's built-in API client (like a lightweight fetch/curl).
//       It does NOT go through the browser — requests are made directly from Node.js.

import { test, expect } from "@playwright/test";

// beforeEach runs automatically before every test in this file.
// It navigates to NBS Source and lands on the Dyson manufacturer page.
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

// This test has two phases:
//   Phase 1 — hit the OneTrust geolocation API directly and validate the JSON response.
//   Phase 2 — open the NBS website in the browser and confirm the UI reflects the same country.
test("Verify API content and UI display", async ({ request, page }) => {
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
