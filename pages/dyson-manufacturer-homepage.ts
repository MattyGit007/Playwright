// dyson-manufacturer-homepage.ts
//
// Page Object for the Dyson manufacturer page on NBS Source.
// You reach this page by searching for "Dyson" on the homepage.
// Most tests in tests/functional tests/NBS-homepage-full-test-set.spec.ts
// check this page (nav links, the "I'm a manufacturer" button, "back to top").
//
// `extends BasePage` means this class gets everything BasePage has
// (the shared `page`, plus any shared locators and actions) for free.
//
// Layout reminder:
//   LOCATORS = where an element is.
//   ACTIONS  = what you do with it.

import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base-page";

export class DysonManufacturerHomePage extends BasePage {
  // ===========================================================================
  // LOCATORS  —  elements on the Dyson manufacturer page.
  // Declare each one here. Create it inside the constructor below.
  // ===========================================================================

  readonly manufacturerButton: Locator;
  readonly inspirationNavButton: Locator;
  readonly mainNavTabs: Locator;
  
  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the Dyson page LOCATORS here.
    this.manufacturerButton = page.getByRole("link", {
      name: "I'm a manufacturer",
    });
    this.inspirationNavButton = page.locator(
      '[data-cy="inspirationNavButton"]',
    );

    // The 7 tab labels inside the main nav. Scoping to the nav's aria-label
    // (rather than a class) makes this resilient to styling changes, and
    // `.mdc-button__label` picks up only the tab buttons/links — the Browse
    // dropdown's category items use `.menu-panel-link` so they are excluded.
    this.mainNavTabs = page
      .getByRole("navigation", { name: "Main navigation links" })
      .locator(".mdc-button__label");

  }
  // ===========================================================================
  // ACTIONS  —  things you do on the Dyson manufacturer page.
  // Move the page steps from the test files into methods here.
  // Example:
  // async clickBackToTop(): Promise<void> {
  //   await this.backToTopButton.click();
  // }
  // ===========================================================================

  // ACTION: 1 verifyImAManufacturerButton
  // Checks the "I'm a manufacturer" button on the homepage.
  // `Promise<void>` is the return type — it means this method returns NO value,
  // it only performs checks.
  // Empty for now — ready for the verification (expect) code to be migrated in.
  async verifyImAManufacturerButton(): Promise<void> {
    // Checks that the link is visible
    await expect(this.manufacturerButton).toBeVisible();
    // Expect the link to show the text "I'm a manufacturer" (case-insensitive).
    await expect(this.manufacturerButton).toHaveText(/i'm a manufacturer/i);
    // Checks that the link has an href attribute pointing to a manufacturer-related URL.
    await expect(this.manufacturerButton).toHaveAttribute(
      "href",
      /manufacturer/,
    );
  }

  //ACTION: 2 verifyInspirationNavButton
  // Checks the 'Inspiration' link is visable on the homepage.

  async verifyInspirationNavButton(): Promise<void> {
    // Checks that the "Inspiration" nav button is visible
    await expect(this.inspirationNavButton).toBeVisible();
    // Expect the link to show the text "Inspiration" (case-insensitive).
    await expect(this.inspirationNavButton).toHaveText(/inspiration/i);
    // Checks that the link has an href attribute pointing to an inspiration-related URL.
    await expect(this.inspirationNavButton).toHaveAttribute(
      "href",
      /inspiration/,
    );
  }

  //ACTION: 3 verifyAppViewContainerContents
  // Checks that the 7 main navigation tabs are present, have the expected
  // labels, and appear in the expected left-to-right order.
 
  async verifyAppViewContainerContents(): Promise<void> {
    // Step 1: assert each tab is actually visible. `toHaveText` only checks
    // DOM text content, so without this loop a tab hidden via CSS (e.g. the
    // `small-screen-hide` class at narrow breakpoints) would still pass.
    const count = await this.mainNavTabs.count();
    expect(count).toBe(7);
    for (let i = 0; i < count; i++) {
      await expect(this.mainNavTabs.nth(i)).toBeVisible();
    }
 
    // Step 2: `toHaveText` with an array does three things in a single
    // assertion:
    //   1. Asserts the locator resolves to exactly 7 elements (length match).
    //   2. Asserts each element's text matches the expected label in order
    //      (DOM order, which matches visual order for this standard nav).
    //   3. Normalises whitespace, so rendered labels like " Home " match
    //      "Home" without extra trim() calls.
    // If any tab is missing, renamed, or re-ordered the test fails with a
    // clear diff showing actual vs. expected labels.
    await expect(this.mainNavTabs).toHaveText([
      "Home",
      "What's new",
      "Browse",
      "BIM Library",
      "Inspiration",
      "Collections",
      "CPD",
    ]);
  }

  // ACTION: 4 Test login via sign in button and same page confirmation
  // Validates the login process via the "Sign in" button, ensuring the user is returned to the same page and sees their initials in the user menu after logging in.
  async verifyLoginFunctionality(): Promise<void> {
    // Snapshot the current URL so we can verify the user is returned here after login.
    const capturedUrl = this.page.url();
    // Open the sign-in modal and fill in the email address from the .env file.
    await this.page.getByRole("button", { name: "Sign in" }).click();
    await this.page.getByRole("textbox", { name: "Email address" }).click();
    await this.page
      .getByRole("textbox", { name: "Email address" })
      .fill(process.env.NBS_USERNAME!);
    // Submit the email step — the login form uses a two-step flow (email then password).
    await this.page.getByRole("button", { name: "Next" }).click();
    // Fill in the password from the .env file and submit.
    await this.page
      .getByRole("textbox", { name: "Password" })
      .click({ timeout: 30000 });
    await this.page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.NBS_PASSWORD!);
    await this.page.getByRole("button", { name: "Sign in" }).click();
    await this.page.waitForLoadState("networkidle", { timeout: 60000 });
    // Verify the user is returned to the same page after login.
    await expect(this.page).toHaveURL(capturedUrl);
    // Verify the user's initials appear in the user menu after login.
    const userMenu = this.page.getByRole("button", { name: "Open user menu" });
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toHaveText("TH");
  }
}
