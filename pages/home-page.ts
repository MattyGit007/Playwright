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
  // Declared here as `readonly` fields; created in the constructor below.
  // ===========================================================================

  // The search box in the site header. Typing here opens an autocomplete
  // dropdown of matching results.
  readonly searchBox: Locator;


  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the homepage LOCATORS here.
    this.searchBox = page.getByRole("textbox", { name: "Search" });
  }


  // ===========================================================================
  // ACTIONS  —  things you do on the homepage.
  //
  // Once the test files call these, the beforeEach hook becomes two short lines:
  //
  //   test.beforeEach(async ({ homePage }) => {
  //     await homePage.goto();
  //     await homePage.searchForManufacturer("Dyson");
  //   });
  // ===========================================================================

  // ACTION: goto
  // Opens the NBS Source homepage. This is the starting point for every
  // journey, so most `beforeEach` hooks call this first.
  async goto(): Promise<void> {
    await this.page.goto("https://source.thenbs.com/en/");
  }

  // ACTION: searchForManufacturer
  // Types a manufacturer name into the search box, waits for the matching
  // result in the autocomplete dropdown, clicks it, and waits to land on
  // that manufacturer's page.
  //
  // `manufacturerName` — the name to search for, e.g. "Dyson".
  async searchForManufacturer(manufacturerName: string): Promise<void> {
    // The matching result link in the autocomplete dropdown.
    // This locator is built HERE rather than in the LOCATORS section because it
    // depends on `manufacturerName`, which only has a value when the method runs.
    // The regex `^name$` makes it match the name exactly.
    const manufacturerResult = this.page.locator("a", {
      hasText: new RegExp(`^${manufacturerName}$`),
    });

    // Retry the search up to 3 times in case the autocomplete dropdown is slow.
    const maxAttempts = 3;
    let attempt = 0;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        // Wait for the page HTML to be fully loaded before interacting with it.
        await this.page.waitForLoadState("domcontentloaded");

        // Clear any prior value, then type slowly to trigger the autocomplete debounce.
        await this.searchBox.click();
        await this.searchBox.fill("");
        await this.searchBox.pressSequentially(manufacturerName, { delay: 150 });
        // Short pause to let the dropdown populate after the final keystroke.
        await this.page.waitForTimeout(600);

        await manufacturerResult.waitFor({ state: "visible", timeout: 20000 });

        if (await manufacturerResult.isVisible()) {
          // Promise.all ensures we don't miss the navigation triggered by the click.
          await Promise.all([
            this.page.waitForURL(new RegExp(manufacturerName, "i"), {
              timeout: 40000,
            }),
            manufacturerResult.click(),
          ]);
          return;
        }
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);
      }

      // Reload the page before the next attempt if the dropdown did not appear.
      if (attempt < maxAttempts && !this.page.isClosed()) {
        await this.page.reload({ waitUntil: "domcontentloaded", timeout: 20000 });
      }
    }
  }
}
