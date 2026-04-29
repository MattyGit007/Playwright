// FILE: Click-Sign-In-button-test.spec.ts
//
// Purpose: Tests the full login flow on NBS Source using the Sign In button.
// After a successful login the test verifies that:
//   1. The user is returned to the same page they were on before logging in.
//   2. The user menu button is visible and shows the correct user initials.
//
// Credentials are loaded from a .env file (NBS_USERNAME and NBS_PASSWORD).
// The .env file is NOT committed to source control — each developer/CI environment
// must have their own copy. See the project README for setup instructions.

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Guard clause: fail loudly at load time if credentials are missing.
// This prevents confusing "element not found" errors deep inside the test when
// the real problem is simply that the .env file hasn't been configured.
if (!process.env.NBS_USERNAME || !process.env.NBS_PASSWORD) {
  throw new Error("NBS credentials not loaded from env file");
}

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

test("test login via sign in button and same page confirmation", async ({
  page,
}) => {
  // Snapshot the current URL so we can verify the user is returned here after login.
  const capturedUrl = page.url();

  // Open the sign-in modal and fill in the email address from the .env file.
  // The "!" after process.env.NBS_USERNAME tells TypeScript: "I've already checked
  // this isn't undefined" (the guard clause above handles that case).
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill(process.env.NBS_USERNAME!);

  // Submit the email step — the login form uses a two-step flow (email then password).
  await page.getByRole("button", { name: "Next" }).click();

  // Fill in the password from the .env file and submit.
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.NBS_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();

  // Wait for the OAuth redirect loop to finish — the URL briefly contains "/authorize"
  // during authentication. We wait until that's gone before making assertions.
  await page.waitForURL(url => !url.pathname.includes("/authorize"));

  // Confirm the user is back on the same page they were on before logging in.
  // We compare just the pathname (e.g. "/en/manufacturers/dyson") to ignore query strings.
  expect(new URL(page.url()).pathname).toBe(new URL(capturedUrl).pathname);

  // Confirm the user menu button is visible — this only appears when logged in.
  // Also check it displays the correct user initials ("SP") to confirm the right account logged in.
  const userMenuButton = page.getByRole("button", { name: "Open user menu" });
  await expect(userMenuButton).toBeVisible();
  await expect(userMenuButton).toHaveText("SP");
});
