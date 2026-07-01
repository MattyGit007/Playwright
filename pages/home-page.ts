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

  // The close button for the "new feature" announcement dialog.
  // This popup appears to inform users about new features like NBS LCA.
  readonly newFeaturePopupCloseButton: Locator;

  constructor(page: Page) {
    // `super(page)` hands `page` to BasePage so the shared setup runs first.
    super(page);

    // Create the homepage LOCATORS here.
    this.searchBox = page.getByRole("textbox", { name: "Search" });
    this.newFeaturePopupCloseButton = page.locator(
      '[data-cy="newFeatureDialogIconCloseButton"]',
    );
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
    await this.page.goto("https://source.thenbs.com/en/gb");
    // Wait for basic DOM to load, then close the popup immediately.
    // Use domcontentloaded instead of networkidle to avoid waiting for ongoing requests.
    await this.page.waitForLoadState("domcontentloaded");
    // Close any "new feature announcement" popup that may have appeared.
    // This ensures the search box is unobstructed for subsequent interactions.
    await this.dismissNewFeaturePopupIfPresent();
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

        // Ensure the search box is in the DOM (attached state), then wait longer for visibility.
        // Using "attached" first to check existence, then try the interaction.
        await this.searchBox.waitFor({ state: "attached", timeout: 30000 });
        
        // Now wait for it to be clickable (visible and enabled).
        await this.searchBox.waitFor({ state: "visible", timeout: 30000 });

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
        // Close the popup again if it appears on reload.
        await this.dismissNewFeaturePopupIfPresent();
      }
    }
  }

  // ACTION: verifyImAManufacturerButton
  // Checks the "I'm a manufacturer" button on the homepage.
  // `Promise<void>` is the return type — it means this method returns NO value,
  // it only performs checks.
  // Empty for now — ready for the verification (expect) code to be migrated in.
  async verifyImAManufacturerButton(): Promise<void> {
    // TODO: migrate the "I'm a manufacturer" button checks here.
  }

  // ACTION: dismissNewFeaturePopupIfPresent
  // The "new feature announcement" dialog can appear a moment or two after the
  // page loads, so we wait a short while for its close button to become visible.
  // If it never shows (the site may not display it on every visit, or may drop
  // it later), the wait times out, we swallow that and carry on — its absence is
  // expected, not a failure. When it is there we click the close button and wait
  // for it to disappear, so the dialog can't intercept the next click (e.g. on
  // the search box) before it has finished closing.
  async dismissNewFeaturePopupIfPresent(): Promise<void> {
    try {
      await this.newFeaturePopupCloseButton.waitFor({
        state: "visible",
        timeout: 5000,
      });
    } catch {
      // No popup this time — nothing to dismiss, so just continue.
      return;
    }

    await this.newFeaturePopupCloseButton.click();
    await this.newFeaturePopupCloseButton.waitFor({
      state: "hidden",
      timeout: 5000,
    });
  }
}
