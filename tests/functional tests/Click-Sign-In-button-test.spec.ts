import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

//safety check in case credentials are not loaded from .env file
if (!process.env.NBS_USERNAME || !process.env.NBS_PASSWORD) {
  throw new Error("NBS credentials not loaded from env file");
}

test.beforeEach(async ({ page }) => {
  await page.goto("https://source.thenbs.com/en/");

  // Focus search box and enter search term
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("dyson");

  // Click result AND wait for navigation (CI safe)
  await Promise.all([
    page.waitForURL(/dyson/i),
    page.locator("a", { hasText: /^Dyson$/ }).click(),
  ]);
});

test("test login via sign in button and same page confirmation", async ({ page }) => {
  await expect(page).toHaveURL(
    /\/manufacturer\/dyson\/nakAxHWxDZprdqkBaCdn4U\/overview$/,
  );

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
  await expect(page).toHaveURL(
    /\/manufacturer\/dyson\/nakAxHWxDZprdqkBaCdn4U\/overview$/,
  );
  const userMenuButton = page.getByRole("button", { name: "Open user menu" });
  await expect(userMenuButton).toBeVisible();
  await expect(userMenuButton).toHaveText("SP");
});
