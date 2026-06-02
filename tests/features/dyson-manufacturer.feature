Feature: Dyson manufacturer page
  As a user browsing NBS Source,
  I want to verify key Dyson manufacturer page elements after searching for Dyson.

  Background:
    Given I am on the NBS Source homepage
    When I search for the manufacturer "Dyson"

  Scenario: Validate the I'm a manufacturer button features
    Then I should see the "I'm a manufacturer" button on the page
    And the "I'm a manufacturer" button should have the correct href attribute

  Scenario: Verify the Inspiration nav button is visible and has correct href
    Then I should see the "Inspiration" navigation button on the page
    And the "Inspiration" button should have the correct href attribute
