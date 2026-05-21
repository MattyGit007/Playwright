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

  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the Dyson page LOCATORS here.
    this.manufacturerButton = page.getByRole("link", { name: "I'm a manufacturer" });
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

}
