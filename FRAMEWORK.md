# Test Framework Guide

A beginner's guide to the Page Object Model (POM) framework used in this project.
It is built on **Playwright Test** (not Cucumber).

## Folder structure

```
pages/                             Page Objects — one class per web page
  base-page.ts                     Parent class that every page extends
  home-page.ts                     NBS Source homepage
  dyson-manufacturer-homepage.ts   Dyson manufacturer page
fixtures/
  test-fixtures.ts                 Builds the Page Objects and gives them to tests
tests/
  functional tests/
    *.spec.ts                      The actual tests
```

## The three building blocks

### 1. Page Objects (`pages/`)
Each file describes ONE web page, in two clearly separated parts:
- **Locators** — *where* the elements are (a button, a textbox...).
- **Actions** — *what you do* with them (click, type, check...).

Tests never use raw selectors — they call Page Object methods.

### 2. Fixtures (`fixtures/test-fixtures.ts`)
Playwright Test's version of a "World" file. It builds a fresh Page Object for
every test, so tests never write `new HomePage(page)` themselves.

### 3. Tests (`tests/`)
Short and readable — they call Page Object actions and check the result.

## How to write a test

Import `test` and `expect` from the **fixtures file**, NOT from `@playwright/test`:

```ts
import { test, expect } from "../../fixtures/test-fixtures";

test("homepage shows the search box", async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.searchBox).toBeVisible();
});
```

`homePage` is supplied automatically by the fixture — already built and ready.

## Where do "before" hooks go?

Playwright Test has no separate hooks file (that is a Cucumber idea). A
`beforeEach` hook lives at the top of the spec file that needs it.

Keep the hook SHORT — it should only call Page Object actions, never contain
raw selectors. Move the real logic into Page Object actions.

**Before** — logic stuffed inside the hook:

```ts
test.beforeEach(async ({ page }) => {
  await page.goto("https://source.thenbs.com/en/");
  await page.getByRole("textbox", { name: "Search" }).fill("Dyson");
  // ...lots more steps...
});
```

**After** — logic moved into Page Object actions:

```ts
test.beforeEach(async ({ homePage }) => {
  await homePage.goto();
  await homePage.searchForManufacturer("Dyson");
});
```

## Migration checklist (for moving an existing test to the POM)

1. Decide which page the test uses, and open that file in `pages/`.
2. Move each selector into the page's **LOCATORS** section.
3. Move each group of steps into an **ACTION** method on that page.
4. In the spec file, import `test` / `expect` from `fixtures/test-fixtures`.
5. Replace raw `page.` calls with Page Object actions.
6. Move repeated setup into a short `beforeEach` that calls those actions.
