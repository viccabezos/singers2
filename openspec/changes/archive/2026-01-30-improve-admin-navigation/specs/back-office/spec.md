# back-office Spec Delta

## ADDED Requirements

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
