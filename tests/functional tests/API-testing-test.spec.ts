import { test, expect } from "@playwright/test";

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



test("Verify API content and UI display", async ({ request, page }) => {
  // 1. Call the API
  const response = await request.get(
    "https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location",
  );

  // 2. Verify API status = 200
  expect(response.status()).toBe(200);

  // 3. Validate API response body - as the response is JSONP, we need to remove the wrapper before parsing
  const responseText = await response.text();
  const jsonString = responseText
    .replace(/^jsonFeed\(/, "")
    .replace(/\);?$/, "");

  const body = JSON.parse(jsonString);
  expect(body).toHaveProperty("country");
  expect(["GB", "US"]).toContain(body.country);

  // 4. Open website that displays the country
  await page.goto("https://source.thenbs.com");
  const countryButton = page.getByRole("button", {
    name: "Choose location and language",
  });
  await expect(countryButton).toContainText("UK");
});
