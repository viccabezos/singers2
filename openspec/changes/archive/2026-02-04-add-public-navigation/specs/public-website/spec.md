## ADDED Requirements

### Requirement: Shared Header Component
The public app SHALL have a shared Header component that appears on all pages.

#### Scenario: Header on all pages
- **GIVEN** a user visits any public page
- **WHEN** the page loads
- **THEN** a header is displayed at the top
- **AND** the header shows the app name/logo
- **AND** clicking the logo navigates to home
- **AND** the header is consistent across all pages

#### Scenario: Mobile header
- **GIVEN** a user views on mobile device
- **WHEN** the page loads
- **THEN** the header is compact
- **AND** touch targets are at least 44px

### Requirement: Breadcrumb Navigation
Event, Playlist, and Song pages SHALL display breadcrumb navigation showing the hierarchy.

#### Scenario: Event page breadcrumbs
- **GIVEN** a user is on an event detail page
- **WHEN** the page loads
- **THEN** breadcrumbs show: Home > Event Name
- **AND** "Home" is clickable and navigates to /
- **AND** "Event Name" is not clickable (current page)

#### Scenario: Playlist page breadcrumbs
- **GIVEN** a user is on a playlist detail page
- **WHEN** the page loads
- **THEN** breadcrumbs show: Home > Event Name > Playlist Name
- **AND** each parent is clickable
- **AND** "Playlist Name" is not clickable

#### Scenario: Song page breadcrumbs
- **GIVEN** a user is on a song detail page
- **WHEN** the page loads
- **THEN** breadcrumbs show: Home > Event Name > Playlist Name > Song Name
- **AND** each parent is clickable
- **AND** "Song Name" is not clickable

### Requirement: Navigation Styling
Navigation components SHALL maintain visual consistency.

#### Scenario: Consistent navigation
- **GIVEN** navigation components are displayed
- **WHEN** the user views them
- **THEN** colors match the app theme
- **AND** typography is consistent
- **AND** dark mode is supported
