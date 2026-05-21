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

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class DysonManufacturerHomePage extends BasePage {
  // ===========================================================================
  // LOCATORS  —  elements on the Dyson manufacturer page.
  // Declare each one here. Create it inside the constructor below.
  // Example:
  // readonly manufacturerButton: Locator;
  // readonly backToTopButton: Locator;
  // ===========================================================================


  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the Dyson page LOCATORS here. Example:
    // this.manufacturerButton = page.getByRole("link", { name: "I'm a manufacturer" });
    // this.backToTopButton = page.locator('[data-cy="backToTopButton"]');
  }


  // ===========================================================================
  // ACTIONS  —  things you do on the Dyson manufacturer page.
  // Move the page steps from the test files into methods here.
  // Example:
  // async clickBackToTop(): Promise<void> {
  //   await this.backToTopButton.click();
  // }
  // ===========================================================================
}
