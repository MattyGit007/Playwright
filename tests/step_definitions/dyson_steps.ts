/**
 * DYSON STEPS - BDD Step Definitions
 * 
 * This file defines the step implementations for Gherkin scenarios.
 * It connects the human-readable feature file steps to actual code that runs browser automation.
 */

// Import Cucumber step keywords (Given, When, Then, And, But) and timeout utility
import { And, But, Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber";

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
 * Gherkin: "Then I should see the 'I'm a manufacturer' button on the page"
 * 
 * @param buttonLabel - The button text to verify (e.g., "I'm a manufacturer")
 */
Then("I should see the {string} button on the page", async function (
  this: CustomWorld,
  buttonLabel: string,
) {
  // Step 1: Verify the button's business logic using the page object
  // The page object encapsulates specific verification logic for this button
  await this.dysonPage.verifyImAManufacturerButton();
  
  // Step 2: Assert that the button is visible on the page
  // getByRole finds elements by their accessibility role (in this case, a link)
  // The assertion will fail if the button is not visible, causing the test to fail
  await expect(this.page.getByRole("link", { name: buttonLabel })).toBeVisible();
});

/**
 * THEN Step: Verify another outcome (Assertion)
 * 
 * Gherkin: "Then I should see the 'Inspiration' navigation button on the page"
 * 
 * @param buttonLabel - The button text to verify (e.g., "Inspiration")
 */
Then("I should see the {string} navigation button on the page", async function (
  this: CustomWorld,
  buttonLabel: string,
) {
  // Step 1: Verify the navigation button's business logic using the page object
  await this.dysonPage.verifyInspirationNavButton();
  
  // Step 2: Assert that the navigation button text is visible on the page
  // getByText finds elements containing the specified text
  await expect(this.page.getByText(buttonLabel)).toBeVisible();
});
