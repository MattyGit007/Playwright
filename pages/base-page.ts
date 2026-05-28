// base-page.ts
//
// WHAT IS A PAGE OBJECT?
// A class that describes ONE web page in one place:
//   - the elements on it       (LOCATORS)
//   - the things you do on it  (ACTIONS)
// Tests use these classes instead of writing raw Playwright code each time.
// This keeps tests short, and if an element changes you fix it in ONE file.
//
// WHAT IS BasePage?
// The shared "parent" page. Every other page class is built on top of it
// using `extends BasePage`. Only put something here if EVERY page uses it
// (for example: the site header, a cookie banner, a "go to URL" helper).
//
// HOW EACH PAGE FILE IS LAID OUT (keep these two apart):
//   LOCATORS = where an element is   (a button, a textbox, a link...)
//   ACTIONS  = what you do with it   (click it, type in it, check it...)

import { Page, Locator } from "@playwright/test";

export class BasePage {
  // `page` is the browser tab Playwright controls. Every page class shares it.
  readonly page: Page;

  // The constructor runs once, when the page class is first created.
  // It receives `page` and saves it so every method below can use it.
  constructor(page: Page) {
    this.page = page;

    // Set up shared LOCATORS here, AFTER the line above.
    // Step 1: declare the field in the LOCATORS section below.
    // Step 2: create it here. Example:
    // this.siteHeader = page.getByRole("banner");
  }

  // ===========================================================================
  // LOCATORS  —  elements found on EVERY page.
  // Declare each one here. Create it inside the constructor above.
  // Example:
  // readonly siteHeader: Locator;
  // ===========================================================================


  // ===========================================================================
  // ACTIONS  —  things you can do on EVERY page (go to a URL, scroll, wait...).
  // Add shared methods here so every page and test can reuse them.
  // Example:
  // async goto(url: string): Promise<void> {
  //   await this.page.goto(url);
  // }
  // ===========================================================================
}
