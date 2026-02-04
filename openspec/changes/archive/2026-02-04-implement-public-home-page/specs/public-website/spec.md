## ADDED Requirements

### Requirement: Current Event Banner
The home page SHALL display a prominent banner for the current event when one is set in the admin.

#### Scenario: Current event exists
- **GIVEN** an event is marked as "current" in the admin
- **WHEN** a user visits the home page `/`
- **THEN** a prominent banner displays the current event
- **AND** the banner shows event name, date, and brief description
- **AND** clicking the banner navigates to `/event/[id]`
- **AND** the banner is visually distinct from other content

#### Scenario: No current event
- **GIVEN** no event is marked as "current"
- **WHEN** a user visits the home page `/`
- **THEN** the banner section is hidden
- **AND** the page shows upcoming events list only

### Requirement: Upcoming Events List
The home page SHALL display a list of upcoming visible events sorted chronologically.

#### Scenario: Multiple upcoming events
- **GIVEN** there are upcoming visible events
- **WHEN** a user visits the home page
- **THEN** a list of up to 10 upcoming events is displayed
- **AND** events are sorted by date (nearest first)
- **AND** each event shows name, date, time (if available), and location
- **AND** clicking an event navigates to `/event/[id]`

#### Scenario: No upcoming events
- **GIVEN** there are no upcoming visible events
- **WHEN** a user visits the home page
- **THEN** an empty state message is displayed
- **AND** the message is friendly and informative

### Requirement: Navigation to Events List
The home page SHALL provide navigation to the full events list page.

#### Scenario: View all events
- **GIVEN** a user is on the home page
- **WHEN** they click "View All Events" link
- **THEN** they navigate to `/events`
- **AND** the link is clearly visible

### Requirement: Mobile-First Responsive Design
The home page SHALL be designed mobile-first with responsive layouts.

#### Scenario: Mobile viewport
- **GIVEN** a user views the home page on a mobile device
- **WHEN** the page loads
- **THEN** content is displayed in a single column
- **AND** touch targets are at least 44px
- **AND** text is readable without zooming
- **AND** current event banner is full-width

#### Scenario: Tablet viewport
- **GIVEN** a user views the home page on a tablet
- **WHEN** the page loads
- **THEN** events list may use 2-column grid
- **AND** spacing is increased for better readability

#### Scenario: Desktop viewport
- **GIVEN** a user views the home page on desktop
- **WHEN** the page loads
- **THEN** events list uses 3-column grid
- **AND** layout is optimized for larger screens

### Requirement: Dark Mode Support
The home page SHALL support dark mode with appropriate color schemes.

#### Scenario: Dark mode enabled
- **GIVEN** a user has dark mode enabled
- **WHEN** they view the home page
- **THEN** the page displays in dark theme
- **AND** contrast is maintained for readability
- **AND** all components adapt to dark colors
