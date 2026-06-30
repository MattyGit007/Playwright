// FILE: NBS-homepage-full-test-set.spec.ts
//
// Purpose: A full suite of functional tests for the Dyson manufacturer page on NBS Source.
// Tests cover navigation links, page content visibility, and the order of nav items.
//
// All tests share the same starting point (Dyson manufacturer page) which is set up
// in beforeEach — so each test only needs to describe what it checks, not how to get there.

// `test` and `expect` come from our fixtures file (NOT "@playwright/test").
// That is what makes `homePage`, `dysonPage` etc. available in the tests below.
import { test, expect } from "../../fixtures/test-fixtures";
// Accessibility tools are used within page fixtures; no direct imports needed here.

// increase the default test timeout for this file since page loads and interactions can take a while
test.describe.configure({ timeout: 60000 });

// beforeEach runs automatically before every test in this file.
// It navigates to the NBS Source homepage, searches for "Dyson", and lands on
// the Dyson manufacturer page — ready for each test to begin.
test.beforeEach(async ({ homePage }) => {
  await homePage.goto();
  await homePage.searchForManufacturer("Dyson");
});

// Test 1: Verifies the 'Im a manufacturer' button is visible, shows expected text and has the correct underlying href.
test("1 Validate the I'm a manufacturer button features", async ({dysonPage,}) => {
  await dysonPage.verifyImAManufacturerButton(  "I'm a manufacturer" );
});

// Test 2: Verifies the 'Inspiration' button is visable, shows expected text and has the correct underlying href.
test("2 Inspiration nav button is visible and has correct href", async ({dysonPage,}) => {
  await dysonPage.verifyInspirationNavButton("Inspiration");
});

// Test 3: Checks that all nav items are present AND appear in the correct left-to-right order.
// We use boundingBox() to get each element's pixel position, then assert each x coordinate
// is greater than or equal to the previous one — confirming the expected visual order.
test("3 validate app view container contents and order", async ({dysonPage,}) => {
  await dysonPage.verifyAppViewContainerContents();
});

// Test 4: Validates the login process via the "Sign in" button, ensuring the user is returned to the same page and sees their initials in the user menu after logging in.
test("4 Test login via sign in button and same page confirmation", async ({dysonPage,}) => {
  await dysonPage.verifyLoginFunctionality();
});

//Test 5: Validates the "Back to top" button appears after scrolling down, successfully scrolls the page back to the top when clicked, and then hides itself again.
test("5 Verify back to top button functionality", async ({dysonPage,}) => {
  await dysonPage.verifyBackToTopButtonFunctionality();
});

// Test 6: Runs an AXE accessibility scan on the Dyson manufacturer page and generates an HTML report of any issues found.
test("6 Dyson manufacturer page Accessibility test", async ({dysonPage,}) => {
  await dysonPage.verifyAccessibility();
});

//Test 7: Verifies the OneTrust geolocation API returns a valid country code and that the NBS website reflects this location in the UI.
// This test has two phases:
//   Phase 1 — hit the OneTrust geolocation API directly and validate the JSON response.
//   Phase 2 — open the NBS website in the browser and confirm the UI reflects the same country.

test("7 Verify API content and UI display", async ({ dysonPage,}) => {
  await dysonPage.verifyGeolocationAndUiDisplay();
});

