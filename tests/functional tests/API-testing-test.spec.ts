import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
 await page.goto('https://source.thenbs.com/en/');
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.keyboard.type('dyson');
  await page.locator('a').filter({ hasText: /^Dyson$/ }).click();
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
