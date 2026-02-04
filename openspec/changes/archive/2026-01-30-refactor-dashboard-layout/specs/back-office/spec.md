# back-office Spec Delta

## MODIFIED Requirements

### Requirement: Dashboard Event Calendar
The back office dashboard SHALL display an event calendar using shadcn Calendar component with custom day rendering and a monthly event list sidebar. The dashboard layout SHALL prioritize main content widgets over informational notices.

#### Scenario: Dashboard layout order
- **WHEN** an admin views the dashboard
- **THEN** navigation cards are displayed at the top
- **AND** the Recent Activity widget and Event Calendar are displayed below navigation cards
- **AND** any informational notices (such as unpublished items alert) are displayed at the bottom of the dashboard
- **AND** the layout maintains visual hierarchy from actionable to informational content

#### Scenario: Calendar displays events with color coding
- **WHEN** an admin views the dashboard
- **THEN** a monthly calendar is displayed showing the current month
- **AND** today is always highlighted with primary color
- **AND** dates with upcoming events display a blue background
- **AND** dates with past events display a grey/muted background
- **AND** the calendar uses French locale for month and day names

#### Scenario: Event navigation from calendar
- **WHEN** an admin clicks on a date that has an event
- **THEN** they are navigated to the event detail page
- **WHEN** an admin clicks on a date without events
- **THEN** they are navigated to the new event form with the date pre-filled

#### Scenario: Month navigation
- **WHEN** an admin uses the calendar navigation controls
- **THEN** they can navigate to previous and next months
- **AND** event indicators update to reflect events in the displayed month

#### Scenario: Monthly event list
- **WHEN** an admin views the dashboard
- **THEN** a sidebar displays all events for the currently selected month
- **AND** events are sorted with today's events first, then upcoming, then past
- **AND** each event shows name, description, date, time, and location
- **AND** clicking an event navigates to its detail page
- **AND** a chevron icon appears on hover to indicate clickability

#### Scenario: Mobile calendar display
- **WHEN** an admin views the dashboard on a mobile device
- **THEN** the calendar and event list stack vertically
- **AND** touch interactions work correctly for navigation and event selection
