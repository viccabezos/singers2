# back-office Specification

## Purpose
TBD - created by archiving change define-project-structure. Update Purpose after archive.
## Requirements
### Requirement: Back Office Application
The system SHALL provide a private back office application for content management, built with Next.js, Tailwind CSS, and shadcn components.

#### Scenario: Admin access
- **WHEN** an admin accesses back office routes
- **THEN** they must authenticate with the single password

#### Scenario: Content management
- **WHEN** an authenticated admin accesses the back office
- **THEN** they can manage website content

### Requirement: Back Office Routing
The back office SHALL use Next.js App Router with routes organized under the `(admin)` route group with `/admin/*` URL prefix.

#### Scenario: Admin route access
- **WHEN** an admin navigates to `/admin` or admin routes
- **THEN** authentication is required before access is granted

#### Scenario: Protected routes
- **WHEN** an unauthenticated user attempts to access admin routes
- **THEN** they are redirected to the login page

### Requirement: Mobile-First Back Office
The back office application SHALL be designed and developed using a mobile-first approach.

#### Scenario: Mobile-first admin interface
- **WHEN** an admin accesses the back office on a mobile device
- **THEN** the interface is optimized for mobile viewing and interaction
- **WHEN** an admin accesses the back office on a tablet or desktop
- **THEN** the interface progressively enhances with additional features and layout improvements
- **AND** all responsive adaptations use Tailwind CSS mobile-first breakpoints

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

### Requirement: Persistent Admin Navigation
The back office SHALL provide persistent navigation via a sidebar on desktop/tablet and a bottom drawer on mobile. The primary focus  navigation is on MOBILE as it is the one that will be used the most .

#### Scenario: Desktop sidebar navigation
- **WHEN** an admin views any admin page on desktop or tablet
- **THEN** a collapsible sidebar is displayed on the left
- **AND** the sidebar contains links to Dashboard, Songs, Playlists, and Events
- **AND** the sidebar contains quick actions for creating new content
- **AND** the sidebar can be collapsed to icon-only mode

#### Scenario: Mobile drawer navigation
- **WHEN** an admin views any admin page on mobile
- **THEN** a floating action button is displayed in the bottom-right corner
- **AND** tapping the button opens a bottom drawer with navigation options
- **AND** the drawer contains quick actions and main navigation links
- **AND** the drawer contains a logout link

#### Scenario: Navigation excluded from auth pages
- **WHEN** an admin is on the login or logout page
- **THEN** the navigation sidebar/drawer is not displayed
- **AND** only the page content is shown

