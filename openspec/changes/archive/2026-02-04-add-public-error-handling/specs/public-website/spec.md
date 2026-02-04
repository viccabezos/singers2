## ADDED Requirements

### Requirement: 404 Not Found Page
The public app SHALL display a custom 404 page when users navigate to non-existent routes.

#### Scenario: Non-existent event
- **GIVEN** a user navigates to `/event/non-existent-id`
- **WHEN** the page loads
- **THEN** a 404 page is displayed
- **AND** the page shows a friendly message like "Event not found"
- **AND** the page provides links to "Go Home" and "Browse Events"
- **AND** the page maintains consistent styling with the app

#### Scenario: Non-existent song
- **GIVEN** a user navigates to `/song/non-existent-id`
- **WHEN** the page loads
- **THEN** a 404 page is displayed
- **AND** the message is appropriate for songs ("Song not found")
- **AND** navigation options are provided

#### Scenario: Invalid route
- **GIVEN** a user navigates to `/invalid-route`
- **WHEN** the page loads
- **THEN** a generic 404 page is displayed
- **AND** the message is friendly and helpful
- **AND** navigation to home is provided

### Requirement: Generic Error Page
The public app SHALL display a custom error page for unexpected errors.

#### Scenario: Database error
- **GIVEN** a database connection error occurs
- **WHEN** the error is caught
- **THEN** an error page is displayed
- **AND** the message is friendly (not technical)
- **AND** the user can retry or navigate home
- **AND** no technical details are exposed

#### Scenario: Runtime error
- **GIVEN** a component throws an unexpected error
- **WHEN** the error is caught
- **THEN** the error page displays
- **AND** the app doesn't crash completely
- **AND** the user can recover by navigating away

### Requirement: Error Page Styling
Error pages SHALL maintain visual consistency with the rest of the application.

#### Scenario: Consistent styling
- **GIVEN** an error page is displayed
- **WHEN** the user views it
- **THEN** colors match the app theme
- **AND** typography is consistent
- **AND** spacing follows app conventions
- **AND** dark mode is supported

### Requirement: Mobile-Friendly Error Pages
Error pages SHALL be optimized for mobile devices.

#### Scenario: Mobile error view
- **GIVEN** a user encounters an error on mobile
- **WHEN** the error page displays
- **THEN** text is readable without zooming
- **AND** touch targets are at least 44px
- **AND** layout is optimized for small screens
- **AND** navigation buttons are easy to tap
