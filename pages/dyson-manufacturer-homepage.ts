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
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

export class DysonManufacturerHomePage extends BasePage {
  // ===========================================================================
  // LOCATORS  —  elements on the Dyson manufacturer page.
  // Declare each one here. Create it inside the constructor below.
  // ===========================================================================

  readonly manufacturerButton: Locator;
  readonly inspirationNavButton: Locator;
  readonly mainNavTabs: Locator;
  readonly signInButton: Locator;
  readonly signInEmailTextbox: Locator;
  readonly nextButton: Locator;
  readonly signInPasswordTextbox: Locator;
  readonly userMenuButton: Locator;
  readonly countryButton: Locator;
  readonly backToTopButton: Locator;
  
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
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.signInEmailTextbox = page.getByRole("textbox", {
      name: "Email address",
    });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.signInPasswordTextbox = page.getByRole("textbox", {
      name: "Password",
    });
    this.userMenuButton = page.getByRole("button", {
      name: "Open user menu",
    });
    this.countryButton = page.getByRole("button", {
      name: "Choose location and language",
    });
    this.backToTopButton = page.locator('[data-cy="backToTopButton"]');

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
    await this.signInButton.click();
    await this.signInEmailTextbox.click();
    await this.signInEmailTextbox.fill(process.env.NBS_USERNAME!);
    // Submit the email step — the login form uses a two-step flow (email then password).
    await this.nextButton.click();
    // Fill in the password from the .env file and submit.
    await this.signInPasswordTextbox.click({ timeout: 30000 });
    await this.signInPasswordTextbox.fill(process.env.NBS_PASSWORD!);
    await this.signInButton.click();
    await this.page.waitForLoadState("networkidle", { timeout: 60000 });
    // Verify the user is returned to the same page after login.
    await expect(this.page).toHaveURL(capturedUrl);
    // Verify the user's initials appear in the user menu after login.
    await expect(this.userMenuButton).toBeVisible();
    await expect(this.userMenuButton).toHaveText("TH");
  }

// ACTION: 5 Verify back to top button functionality
// Validates the "Back to top" button appears after scrolling down, successfully scrolls the page back to the top when clicked, and then hides itself again.
async verifyBackToTopButtonFunctionality(): Promise<void> {
  // The button should be hidden at the top of the page — no need to show it until the user scrolls.
  await expect(this.backToTopButton).not.toBeVisible();
  // Force an instant jump to the bottom — bypasses CSS smooth-scroll animation
  // which behaves differently in headed vs headless mode and races with the assertions.    
  await this.page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
  });
  // After scrolling down, the button should now be visible.
  await expect(this.backToTopButton).toBeVisible({ timeout: 10000 });    
  // Click the button to scroll back to the top.
  await this.backToTopButton.click();  
  // Use expect.poll to repeatedly check window.scrollY until it equals 0.
  // This is CI-safe because scroll animations can take a moment to complete.
  // window.scrollY is the current vertical scroll position (0 = top of page).
  await expect
    .poll(async () => this.page.evaluate(() => window.scrollY), { timeout: 10000 })
    .toBe(0);
  // Once back at the top, the button should hide itself again.
  await expect(this.backToTopButton).not.toBeVisible({ timeout: 10000 });

}

//ACTION: 6 Dyson manufacturer page Accessibility test
// Runs an AXE accessibility scan on the Dyson manufacturer page and generates an HTML report of any issues found.
async verifyAccessibility(): Promise<void> {
  // Run an AXE accessibility scan against the current page (set up in beforeEach).
  // `analyze()` returns an object containing violations, passes, incomplete checks, etc.
  const accessibilityScanResults = await new AxeBuilder({ page: this.page }).analyze(); 
  // Convert the raw AXE results into a human-readable HTML report...
  const html = createHtmlReport({ results: accessibilityScanResults });   
  // ...and write it to disk in the project root so it can be opened in a browser.
  fs.writeFileSync("axe-report.html", html);  
}

//ACTION: 7 Verify geolocation and OneTrust cookie banner
// Verifies the OneTrust geolocation API returns a valid country code and that the NBS website reflects this location in the UI.
// This test has two phases:
//   Phase 1 — hit the OneTrust geolocation API directly and validate the JSON response.
//   Phase 2 — open the NBS website in the browser and confirm the UI reflects the same country.
async verifyGeolocationAndUiDisplay(): Promise<void> {
    // Phase 1: API validation  
    const response = await this.page.request.get("https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location");
    // Assert the API call was successful with a 200 status code.
    expect(response.status()).toBe(200);
    // 3. Validate API response body.
  // The response uses JSONP format — it wraps JSON in a function call like: jsonFeed({...});
  // We strip the wrapper with .replace() so we can parse the inner JSON normally.
  const responseText = await response.text();
  const jsonString = responseText.replace(/^jsonFeed\(/, "").replace(/\);?$/, "");
  const body = JSON.parse(jsonString);  
  // Assert the API response contains a valid country code (e.g. "US", "GB").
  expect(body).toHaveProperty("country");
  expect(["GB", "US"]).toContain(body.country);

  // 4. (Phase 2) Now open the NBS website in the browser and check the UI shows the correct country.
  await this.page.goto("https://source.thenbs.com");
  // The country picker button should display "UK" when the detected country is GB.
  await expect(this.countryButton).toContainText("UK");
}
}
