import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
await page.goto('https://source.thenbs.com/en/');
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.keyboard.type('dyson');
  await page.locator('a').filter({ hasText: /^Dyson$/ }).click();
});

test("1 NBS homepage loads", async ({ page }) => {
  await expect(page).toHaveTitle(/NBS/);
});

test("2 Click on I'm a manufacturer", async ({ page }) => {
  await page.getByRole("link", { name: "I\'m a manufacturer" }).click();
});

test("3 Click on Inspiration", async ({ page }) => {
   await page.getByRole('link', { name: 'Inspiration' }).click();
   await page.getByRole('heading', { name: 'Helping you find the next big' }).isVisible();
});


test(" 4 validate app view container contents", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "What\'s new" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Browse" })).toBeVisible();
  await expect(page.getByRole("button", { name: "BIM Library" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Inspiration" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Collections" })).toBeVisible();
  await expect(page.getByRole("link", { name: "CPD" })).toBeVisible();
});


