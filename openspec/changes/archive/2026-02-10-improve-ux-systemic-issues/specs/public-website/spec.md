# public-website Spec Delta

## ADDED Requirements

### Requirement: Public Homepage Current Event Display
The public website homepage SHALL display the current or upcoming event with its playlists.

#### Scenario: Homepage with current event
- **GIVEN** there is a visible event marked as current (`is_current=true`)
- **WHEN** a user visits the homepage
- **THEN** the current event is displayed with its name, date, time, and location
- **AND** the event's visible playlists are listed
- **AND** each playlist links to its public page

#### Scenario: Homepage with auto-selected upcoming event
- **GIVEN** no event is marked as current
- **AND** there are visible upcoming events
- **WHEN** a user visits the homepage
- **THEN** the closest upcoming event is displayed
- **AND** the event's visible playlists are listed

#### Scenario: Homepage with no events
- **GIVEN** there are no visible upcoming events
- **WHEN** a user visits the homepage
- **THEN** a friendly message is displayed indicating no upcoming events
- **AND** the message is clear and accessible

### Requirement: Public Header Navigation
The public website SHALL provide a consistent header navigation on all pages.

#### Scenario: Header displays on all public pages
- **WHEN** a user views any public page (event, playlist, or song)
- **THEN** a header is visible at the top of the page
- **AND** the header contains a link to the homepage
- **AND** the header contains a dark mode toggle

#### Scenario: Contextual back navigation
- **WHEN** a user views a playlist page
- **THEN** the header shows "← Back" navigation to the parent event or homepage
- **WHEN** a user views a song/lyrics page
- **THEN** the header shows "← Back" navigation to the parent playlist or homepage

### Requirement: Dark Mode Toggle
The public website SHALL provide a user-accessible toggle to switch between light and dark modes.

#### Scenario: Toggle dark mode
- **GIVEN** the user is on any public page
- **WHEN** the user clicks the dark mode toggle
- **THEN** the color scheme switches between light and dark
- **AND** the preference is persisted in the browser

#### Scenario: Dark mode persistence
- **GIVEN** the user has previously selected dark mode
- **WHEN** the user returns to the website
- **THEN** the dark mode preference is restored

#### Scenario: System preference detection
- **GIVEN** the user has not set a preference
- **WHEN** the user first visits the website
- **THEN** the system respects the user's OS dark mode preference

### Requirement: Loading States for Public Content
The public website SHALL display loading indicators while content is being fetched.

#### Scenario: Homepage loading
- **WHEN** the homepage is loading event data
- **THEN** skeleton placeholders are shown for the event information
- **AND** the layout does not shift when content loads

#### Scenario: Playlist page loading
- **WHEN** a playlist page is loading song data
- **THEN** skeleton placeholders are shown for the song list
- **AND** the layout does not shift when content loads

## MODIFIED Requirements

### Requirement: Public Website Application
The system SHALL provide a public-facing website application built with Next.js, Tailwind CSS, and shadcn components, with a consistent header navigation and dark mode support.

#### Scenario: Public access
- **WHEN** a user visits the website
- **THEN** they can view public content without authentication
- **AND** a consistent header is displayed on all pages

#### Scenario: Mobile-first responsive design
- **WHEN** a user accesses the website on a mobile device
- **THEN** the interface is optimized for mobile viewing
- **AND** touch targets are at least 44x44 pixels
- **WHEN** a user accesses the website on a tablet or desktop
- **THEN** the interface progressively enhances with additional features and layout improvements
- **AND** all responsive adaptations use Tailwind CSS mobile-first breakpoints

#### Scenario: Accessibility for elderly users
- **GIVEN** the target user base includes retired choir members
- **WHEN** a user interacts with the website
- **THEN** the interface uses high contrast colors
- **AND** text is easily readable
- **AND** navigation is simple and clear
