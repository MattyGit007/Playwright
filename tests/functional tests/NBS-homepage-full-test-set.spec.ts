import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("https://source.thenbs.com/en/");

  // Focus search box and enter search term
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("dyson");

  // Click result AND wait for navigation (CI-safe)
  await Promise.all([
    page.waitForURL(/dyson/i),
    page.locator("a", { hasText: /^Dyson$/ }).click(),
    ]);
    await expect(page).toHaveTitle(/Dyson/i);
  
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
