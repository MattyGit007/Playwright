import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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

test("1 Click on I'm a manufacturer", async ({ page }) => {
  await page.getByRole("link", { name: "I\'m a manufacturer" }).click();
});

test("2 Click on Inspiration", async ({ page }) => {
  await page.getByRole("link", { name: "Inspiration" }).click();
  await page
    .getByRole("heading", { name: "Helping you find the next big" })
    .isVisible();
});

test(" 3 validate app view container contents", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "What\'s new" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Browse" })).toBeVisible();
  await expect(page.getByRole("button", { name: "BIM Library" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Inspiration" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Collections" })).toBeVisible();
  await expect(page.getByRole("link", { name: "CPD" })).toBeVisible();
});

test("4 validate app view container contents and order", async ({ page }) => {
  const items = [
    page.getByRole("link", { name: "Home" }),
    page.getByRole("link", { name: "What's new" }),
    page.getByRole("button", { name: "Browse" }),
    page.getByRole("button", { name: "BIM Library" }),
    page.getByRole("link", { name: "Inspiration" }),
    page.getByRole("link", { name: "Collections" }),
    page.getByRole("link", { name: "CPD" }),
  ];

  // presence check
  for (const item of items) {
    await expect(item).toBeVisible();
  }

  //order check (DOM position)
  let lastY = -1;

  for (const item of items) {
    const box = await item.boundingBox();
    expect(box).not.toBeNull();

    expect(box!.x).toBeGreaterThanOrEqual(lastY);
    lastY = box!.x;
  }
});
