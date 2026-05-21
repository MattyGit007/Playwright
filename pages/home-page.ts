// home-page.ts
//
// Page Object for the NBS Source homepage: https://source.thenbs.com/en/
// This is where most tests start (for example, searching for "Dyson").
//
// `extends BasePage` means this class gets everything BasePage has
// (the shared `page`, plus any shared locators and actions) for free.
//
// Layout reminder:
//   LOCATORS = where an element is.
//   ACTIONS  = what you do with it.

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class HomePage extends BasePage {
  // ===========================================================================
  // LOCATORS  —  elements on the homepage.
  // Declare each one here. Create it inside the constructor below.
  // Example:
  // readonly searchBox: Locator;
  // ===========================================================================


  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the homepage LOCATORS here. Example:
    // this.searchBox = page.getByRole("textbox", { name: "Search" });
  }


  // ===========================================================================
  // ACTIONS  —  things you do on the homepage.
  // Move the homepage steps from the test files into methods here.
  // Example:
  // async searchFor(term: string): Promise<void> {
  //   await this.searchBox.click();
  //   await this.searchBox.fill(term);
  // }
  // ===========================================================================
}
