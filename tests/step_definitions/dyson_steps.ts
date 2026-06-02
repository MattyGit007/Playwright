import { Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../features/support/world";

setDefaultTimeout(60 * 1000);

Given("I am on the NBS Source homepage", async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error("HomePage is not initialized");
  }

  await this.homePage.goto();
});

When("I search for the manufacturer {string}", async function (
  this: CustomWorld,
  manufacturerName: string,
) {
  if (!this.homePage) {
    throw new Error("HomePage is not initialized");
  }

  await this.homePage.searchForManufacturer(manufacturerName);
});

Then("I should see the {string} button on the page", async function (
  this: CustomWorld,
  buttonLabel: string,
) {
  if (!this.dysonPage || !this.page) {
    throw new Error("DysonPage or page is not initialized");
  }

  // Use the page object to verify the button's business rules,
  // and also assert the label from the Gherkin step so the feature remains data-driven.
  await this.dysonPage.verifyImAManufacturerButton();
  await expect(this.page.getByRole("link", { name: buttonLabel })).toBeVisible();
  
});

Then("I should see the {string} navigation button on the page", async function (
  this: CustomWorld,
  buttonLabel: string,
) {
  if (!this.dysonPage || !this.page) {
    throw new Error("DysonPage or page is not initialized");
  }

  await this.dysonPage.verifyInspirationNavButton();
  await expect(this.page.getByText(buttonLabel)).toBeVisible();
});
