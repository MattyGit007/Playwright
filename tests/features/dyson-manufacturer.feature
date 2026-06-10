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

  Scenario: 5 As a user, I can validate the "Back to top" button appears after scrolling down, successfully scrolls the page back to the top when clicked, and then hides itself again.
    Then I should see the "Back to top" button appear after scrolling down, successfully scrolls the page back to the top when clicked, and then hides itself again.  

  Scenario: 6 As a user, I can run an AXE accessibility scan on the Dyson manufacturer page and generate an HTML report of any issues found. 
    Then I can run an AXE accessibility scan on the Dyson manufacturer page and generate an HTML report of any issues found.

  Scenario: 7 As a user, I can validate the OneTrust geolocation API returns a valid country code and that the NBS website reflects this location in the UI.
    Then I can validate the OneTrust geolocation API returns a valid country code and that the NBS website reflects this location in the UI.