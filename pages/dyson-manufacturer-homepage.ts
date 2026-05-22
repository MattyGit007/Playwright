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
  readonly InspirationLink: Locator
  readonly CollectionsLink: Locator;
  readonly CPDLink: Locator;

  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the Dyson page LOCATORS here.
    this.manufacturerButton = page.getByRole("link", { name: "I'm a manufacturer" });
    this.inspirationNavButton = page.locator('[data-cy="inspirationNavButton"]');
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

  // ACTION: verifyImAManufacturerButton
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
    await expect(this.manufacturerButton).toHaveAttribute("href", /manufacturer/);
  }

  async verifyInspirationNavButton(): Promise<void> {
    // Checks that the "Inspiration" nav button is visible 
    await expect(this.inspirationNavButton).toBeVisible();
    // Expect the link to show the text "Inspiration" (case-insensitive).
    await expect(this.inspirationNavButton).toHaveText(/inspiration/i);
    // Checks that the link has an href attribute pointing to an inspiration-related URL.
    await expect(this.inspirationNavButton).toHaveAttribute("href", /inspiration/);
  }

  async verifyAppViewContainerContents(): Promise<void> {
   //chect the 6 main navigation items are visible on the page
   await expect(this.Homelink).toBeVisible();
   await expect(this.WhatsNewLink).toBeVisible();
   await expect(this.BrowseButton).toBeVisible();
   await expect(this.BIMLibraryButton).toBeVisible();
   await expect(this.InspirationLink).toBeVisible();
   await expect(this.CollectionsLink).toBeVisible();
   await expect(this.CPDLink).toBeVisible();
  }
}
