/**
 * DYSON STEPS - BDD Step Definitions
 * 
 * This file defines the step implementations for Gherkin scenarios.
 * It connects the human-readable feature file steps to actual code that runs browser automation.
 */

// Import Cucumber step keywords (Given, When, Then) and timeout utility
import { Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber";

// Import assertion library from Playwright for verifying test results
import { expect } from "@playwright/test";

// Import the CustomWorld class which provides access to page objects and browser context
import { CustomWorld } from "../features/support/world";

// Set a 60-second timeout for all steps to prevent tests from hanging indefinitely
setDefaultTimeout(60 * 1000);
/**
 * GIVEN Step: Set up the initial state
 * 
 * Gherkin: "Given I am on the NBS Source homepage"
 * Purpose: Navigate to the homepage before running test scenarios
 */
Given("I am on the NBS Source homepage", async function (this: CustomWorld) {
  // Call the goto() method on the HomePage page object to navigate to the URL
  await this.homePage.goto();
});
/**
 * WHEN Step: Perform an action
 * 
 * Gherkin: "When I search for the manufacturer 'Dyson'"
 * The {string} placeholder captures the manufacturer name from the feature file
 * 
 * @param manufacturerName - The name of the manufacturer to search for (e.g., "Dyson")
 */
When("I search for the manufacturer {string}", async function (
  this: CustomWorld,
  manufacturerName: string,
) {
  // Execute the search functionality by calling the HomePage method
  // This method handles typing in the search field and submitting the form
  await this.homePage.searchForManufacturer(manufacturerName);
});
/**
 * THEN Step: Verify the outcome (Assertion)
 * 
 * Gherkin: "Then I should see the 'I'm a manufacturer' button on the page and verify its has the correct href "
 * 
 * @param buttonLabel - The button text to verify (e.g., "I'm a manufacturer")
 */
Then("I should see the {string} button on the page, verify its visible and has the correct href", async function (
  this: CustomWorld,
  buttonLabel: string,
) {
  // Step 1: Verify the button's business logic using the page object.
  // We pass buttonLabel (captured from the {string} in the feature file) through
  // so the page object asserts against the exact text from the Gherkin, instead
  // of a value hardcoded in the page object.
  await this.dysonPage.verifyImAManufacturerButton(buttonLabel);
});
/**
 * THEN Step: Verify another outcome (Assertion)
 * 
 * Gherkin: "Then I should see the 'Inspiration' navigation button on the page and verify its has the correct href "
 * 
 * @param buttonLabel - The button text to verify (e.g., "Inspiration")
 */
Then("I should see the {string} navigation button on the page, verify its visible and has the correct href", async function (
  this: CustomWorld,
  buttonLabel: string,
) {
  // Step 1: Verify the navigation button's business logic using the page object
  await this.dysonPage.verifyInspirationNavButton(buttonLabel); 
});
/**
 * THEN Step: Verify navigation items (Assertion)
 * 
 * Gherkin: "Then I should see all navigation items in the correct order"
 * 
 * This step validates that all 7 main navigation tabs are present, visible, and appear
 * in the expected left-to-right order: Home, What's new, Browse, BIM Library, Inspiration, Collections, CPD
 */
Then("I should see all navigation items in the correct order", async function (
  this: CustomWorld,
) {
  // Call the page object method that verifies all nav items are present, visible, and in correct order
  await this.dysonPage.verifyAppViewContainerContents();
});
/**
 * THEN Step: Verify sign in button and return to same page (Assertion)
 * 
 * Gherkin: "I can login via the Sign in button, ensuring Im returned to the same page"
 * 
 * This step validates that sign in button functionality and ensures the user is returned to the same page
 */
Then("I can login via the Sign in button, ensuring Im returned to the same page", async function (
this: CustomWorld,
buttonLabel: string,
) {
  // Call the page object method that verifies sign in button functionality and ensures the user is returned to the same page
 await this.dysonPage.verifyLoginFunctionality();
});

