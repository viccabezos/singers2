## ADDED Requirements

### Requirement: Events List Page
The public app SHALL provide a page at `/events` that displays all upcoming visible events.

#### Scenario: View all events
- **GIVEN** a user clicks "View All Events" on the home page
- **WHEN** they navigate to `/events`
- **THEN** a page displays all upcoming visible events
- **AND** events are sorted by date (nearest first)
- **AND** each event shows name, date, time (if available), and location
- **AND** clicking an event navigates to `/event/[id]`

#### Scenario: Direct navigation to events
- **GIVEN** a user navigates directly to `/events`
- **WHEN** the page loads
- **THEN** all upcoming visible events are displayed
- **AND** the page has a clear title (e.g., "Upcoming Events")

#### Scenario: Many events
- **GIVEN** there are many upcoming events
- **WHEN** the events page loads
- **THEN** all events are displayed (no pagination for MVP)
- **AND** the page remains performant

### Requirement: Event Card Display
Each event SHALL be displayed in a card format with consistent information.

#### Scenario: Event card content
- **GIVEN** an event is displayed in the list
- **WHEN** the user views it
- **THEN** the card shows the event name (prominent)
- **AND** the card shows the event date (formatted)
- **AND** the card shows the event time (if available)
- **AND** the card shows the location
- **AND** the card shows a brief description (1-2 lines)
- **AND** the entire card is clickable

### Requirement: Responsive Grid Layout
The events list SHALL use a responsive grid layout.

#### Scenario: Mobile layout
- **GIVEN** a user views on mobile
- **WHEN** the page loads
- **THEN** events display in a single column
- **AND** cards are full-width
- **AND** spacing is optimized for mobile

#### Scenario: Tablet layout
- **GIVEN** a user views on tablet
- **WHEN** the page loads
- **THEN** events display in 2 columns
- **AND** cards have consistent sizing

#### Scenario: Desktop layout
- **GIVEN** a user views on desktop
- **WHEN** the page loads
- **THEN** events display in 3 columns
- **AND** layout uses available space efficiently

### Requirement: Empty State
The events page SHALL display an empty state when no events exist.

#### Scenario: No upcoming events
- **GIVEN** there are no upcoming visible events
- **WHEN** a user visits `/events`
- **THEN** an empty state is displayed
- **AND** the message is friendly (e.g., "No upcoming events scheduled")
- **AND** a link to home is provided
