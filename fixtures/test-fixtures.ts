// test-fixtures.ts
//
// WHAT IS THIS FILE?
// This is the heart of the framework. Some test tools call this a "World" file.
// Playwright Test does NOT use a World — it uses "fixtures" instead.
// A fixture is a ready-made object that Playwright builds fresh for each test
// and hands to the test automatically.
//
// WHAT DOES IT DO?
// It builds a Page Object for each page (HomePage, DysonManufacturerHomePage)
// and gives them to every test that asks for them. So a test never has to
// write `const homePage = new HomePage(page)` itself — it just asks for
// `homePage` and it is already built and ready.
//
// HOW TO USE IT IN A TEST:
// Import `test` and `expect` from THIS file — NOT from "@playwright/test":
//
//   import { test, expect } from "../../fixtures/test-fixtures";
//
//   test("my test", async ({ homePage, dysonPage }) => {
//     // homePage and dysonPage are ready to use — no `new` needed.
//   });

import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { DysonManufacturerHomePage } from "../pages/dyson-manufacturer-homepage";

// This type lists every custom fixture we add, and which Page Object it gives.
// When you create a new page, add a line here too.
type Pages = {
  homePage: HomePage;
  dysonPage: DysonManufacturerHomePage;
};

// `base.extend` takes Playwright's normal `test` and adds our own fixtures.
// The result is a new `test` that knows about `homePage` and `dysonPage`.
export const test = base.extend<Pages>({
  // FIXTURE: homePage
  // Playwright runs this function before any test that asks for `homePage`.
  //  - `{ page }` is Playwright's built-in browser tab.
  //  - We build the Page Object and pass `page` into its constructor.
  //    This is "constructor injection": the page is given to the object from
  //    outside, instead of the object creating its own.
  //  - `await use(homePage)` hands the object to the test, then waits for the
  //    test to finish. Any cleanup code would go on the line AFTER `use`.
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // FIXTURE: dysonPage
  // Exactly the same pattern, for the Dyson manufacturer page.
  dysonPage: async ({ page }, use) => {
    const dysonPage = new DysonManufacturerHomePage(page);
    await use(dysonPage);
  },
});

// Re-export `expect` so a test can import BOTH `test` and `expect`
// from this one file.
export { expect };
