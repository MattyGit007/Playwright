import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

//safety check in case credentials are not loaded from .env file
if (!process.env.NBS_USERNAME || !process.env.NBS_PASSWORD) {
  throw new Error("NBS credentials not loaded from env file");
}

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

test("test login via sign in button and same page confirmation", async ({
  page,
}) => {
  // Capture current URL before login
  const capturedUrl = page.url();
// Click sign in and perform login with email address and password
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page

    .getByRole("textbox", { name: "Email address" })
    .fill(process.env.NBS_USERNAME!);

  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("textbox", { name: "Password" }).click();

  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.NBS_PASSWORD!);

  await page.getByRole("button", { name: "Sign in" }).click();

  
  // Wait for auth redirect to complete
  await page.waitForURL(url => !url.pathname.includes("/authorize"));


// Assert user remains on the same page
expect(new URL(page.url()).pathname).toBe(new URL(capturedUrl).pathname);

// Assert user menu button is visible and displays user initials (SP)
const userMenuButton = page.getByRole("button", { name: "Open user menu" });
  await expect(userMenuButton).toBeVisible();
  await expect(userMenuButton).toHaveText("SP");
});
