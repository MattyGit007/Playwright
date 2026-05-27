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
  readonly Homelink: Locator;
  readonly WhatsNewLink: Locator;
  readonly BrowseButton: Locator;
  readonly BIMLibraryButton: Locator;
  readonly InspirationLink: Locator;
  readonly CollectionsLink: Locator;
  readonly CPDLink: Locator;

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
    this.Homelink = page.getByRole("link", { name: "Home" });
    this.WhatsNewLink = page.getByRole("link", { name: "What\'s new" });
    this.BrowseButton = page.getByRole("button", { name: "Browse" });
    this.BIMLibraryButton = page.getByRole("button", { name: "BIM Library" });
    this.InspirationLink = page.getByRole("link", { name: "Inspiration" });
    this.CollectionsLink = page.getByRole("link", { name: "Collections" });
    this.CPDLink = page.getByRole("link", { name: "CPD" });
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
  // Checks the 6 main navigation items are visable and in the correct order (left to right) within the app container on the homepage.

  async verifyAppViewContainerContents(): Promise<void> {
    //chect the following 6 main navigation items are visible on the page and in the correct order
    await expect(this.Homelink).toBeVisible();
    await expect(this.WhatsNewLink).toBeVisible();
    await expect(this.BrowseButton).toBeVisible();
    await expect(this.BIMLibraryButton).toBeVisible();
    await expect(this.InspirationLink).toBeVisible();
    await expect(this.CollectionsLink).toBeVisible();
    await expect(this.CPDLink).toBeVisible();

    // order check (DOM position)
    // lastY tracks the x position of the previous item; each new item must be at least as far right.
    const items = [
      this.Homelink,
      this.WhatsNewLink,
      this.BrowseButton,
      this.BIMLibraryButton,
      this.InspirationLink,
      this.CollectionsLink,
      this.CPDLink,
    ];

    let lastY = -1;

    for (const item of items) {
      const box = await item.boundingBox();
      expect(box).not.toBeNull();

      expect(box!.x).toBeGreaterThanOrEqual(lastY);
      lastY = box!.x;
    }
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
