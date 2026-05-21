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
  //
  // The before-hook actions further down need the search box, so that is the
  // first locator to migrate:
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
  //
  // The two methods below are the "before hook" outline. Today the test files
  // do this setup inside `test.beforeEach`. The plan is to move that low-level
  // code into these methods, so the hook becomes two short, readable lines:
  //
  //   test.beforeEach(async ({ homePage }) => {
  //     await homePage.goto();
  //     await homePage.searchForManufacturer("Dyson");
  //   });
  //
  // The method BODIES are empty on purpose — they are ready for the real
  // Playwright code to be migrated in.
  // ===========================================================================

  // ACTION: goto
  // Opens the NBS Source homepage. This is the starting point for every
  // journey, so most `beforeEach` hooks call this first.
  //
  // TO MIGRATE — move this line out of the spec's beforeEach into here:
  //   await this.page.goto("https://source.thenbs.com/en/");
  async goto(): Promise<void> {
    // TODO: migrate the page.goto(...) call here.
  }

  // ACTION: searchForManufacturer
  // Types a manufacturer name into the search box, waits for the matching
  // result in the autocomplete dropdown, clicks it, and waits to land on
  // that manufacturer's page.
  //
  // `manufacturerName` — the name to search for, e.g. "Dyson".
  //
  // TO MIGRATE — move the search/retry logic out of the spec's beforeEach.
  // The original steps were:
  //   1. Retry up to 3 times (the autocomplete dropdown can be slow).
  //   2. Wait for the page HTML to load  (waitForLoadState "domcontentloaded").
  //   3. Click the search box, clear it, type the name slowly (delay: 150).
  //   4. Wait for the matching result link to become visible.
  //   5. Click it and wait for the URL to change to the manufacturer's page.
  //   6. If an attempt fails, reload the page and try again.
  //
  // Tip: use the `manufacturerName` parameter instead of a hard-coded "Dyson"
  // so this one method works for ANY manufacturer.
  async searchForManufacturer(manufacturerName: string): Promise<void> {
    // TODO: migrate the search-and-navigate logic here.
  }
}
