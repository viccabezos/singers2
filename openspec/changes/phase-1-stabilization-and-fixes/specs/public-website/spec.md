## ADDED Requirements

### Requirement: Correct Breadcrumb Navigation
The system SHALL provide correct breadcrumb navigation on all public pages.

#### Scenario: Playlist detail page breadcrumbs
- **GIVEN** a user is viewing a playlist detail page
- **WHEN** they view the breadcrumbs
- **THEN** the breadcrumb shows "Playlists" linking to /playlists
- **AND** the current playlist name is displayed as the active item
- **AND** clicking "Playlists" navigates to the playlists list page

#### Scenario: Song detail page breadcrumbs
- **GIVEN** a user is viewing a song detail page
- **WHEN** they view the breadcrumbs
- **THEN** the breadcrumb shows "Songs" linking to /songs
- **AND** the current song title is displayed as the active item
- **AND** clicking "Songs" navigates to the songs list page

### Requirement: No Duplicate Footer Elements
The system SHALL not display duplicate footer elements on any page.

#### Scenario: Events page single footer
- **GIVEN** a user is viewing the events page
- **WHEN** the page renders
- **THEN** only one footer is displayed
- **AND** the footer is provided by the layout component
- **AND** no page-specific footer is rendered

### Requirement: Working Navigation Links
The system SHALL provide working navigation links in all call-to-action sections.

#### Scenario: CTA section events link
- **GIVEN** a user is viewing the homepage CTA section
- **WHEN** they click on "View Upcoming Events" button
- **THEN** they are navigated to the /events page
- **AND** the navigation completes successfully
- **AND** no broken anchor links are present
