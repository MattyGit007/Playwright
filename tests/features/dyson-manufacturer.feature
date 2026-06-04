Feature: Dyson manufacturer page
  As a user browsing NBS Source,
  I want to verify key Dyson manufacturer page elements after searching for Dyson.

  Background:
    Given I am on the NBS Source homepage
    When I search for the manufacturer "Dyson"

  Scenario: 1 As a user, I can validate the I'm a manufacturer is visible and has correct href
    Then I should see the "I'm a manufacturer" button on the page, verify its visible and has the correct href   

  Scenario: 2 As a user, I can validate the Inspiration nav button is visible and has correct href
    Then I should see the "Inspiration" navigation button on the page, verify its visible and has the correct href 

  Scenario: 3 As a user, I can validate that all nav items are present AND appear in the correct left-to-right order
    Then I should see all navigation items in the correct order 
    
  Scenario: 4 As a user, I can login via the Sign in button, and ensure the user is returned to the same page
    Then I can login via the Sign in button, ensuring Im returned to the same page
