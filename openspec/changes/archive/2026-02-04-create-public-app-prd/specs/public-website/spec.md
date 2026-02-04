## ADDED Requirements

### Requirement: Public Home Page
The public app SHALL provide a home page that serves as the entry point for users, displaying relevant content based on the current context (active event or upcoming events).

#### Scenario: User visits home page with current event
- **GIVEN** there is an event marked as "current" in the admin
- **WHEN** a user visits the home page `/`
- **THEN** the user sees the current event prominently displayed
- **AND** the user can navigate to the event details
- **AND** the user can see a list of upcoming events

#### Scenario: User visits home page without current event
- **GIVEN** there is no event marked as "current"
- **WHEN** a user visits the home page `/`
- **THEN** the user sees a list of upcoming events
- **AND** events are sorted by date (nearest first)
- **AND** past events are hidden or clearly marked

#### Scenario: Mobile home page view
- **GIVEN** a user visits the home page on a mobile device
- **WHEN** the page loads
- **THEN** content is optimized for mobile viewing
- **AND** touch targets are at least 44px
- **AND** text is readable without zooming

### Requirement: Event Discovery and Navigation
The public app SHALL allow users to discover and navigate to events through multiple pathways.

#### Scenario: View all upcoming events
- **GIVEN** a user is on any public page
- **WHEN** they navigate to the events section
- **THEN** they see a list of all upcoming visible events
- **AND** events show date, time, location, and title
- **AND** events are sorted chronologically

#### Scenario: Event detail page
- **GIVEN** a user clicks on an event
- **WHEN** they navigate to `/event/[id]`
- **THEN** they see full event details (name, date, time, location, description)
- **AND** they see a map if location coordinates are available
- **AND** they see associated playlists
- **AND** they can navigate to any playlist

#### Scenario: Past events visibility
- **GIVEN** an event has passed
- **WHEN** a user views events
- **THEN** past events are either hidden OR shown in a separate "Past Events" section
- **AND** the admin can control visibility of past events

### Requirement: Playlist and Song Navigation
The public app SHALL provide clear navigation from events to playlists to songs, with breadcrumb-style wayfinding.

#### Scenario: Navigate from event to playlist
- **GIVEN** a user is viewing an event with playlists
- **WHEN** they click on a playlist
- **THEN** they navigate to `/playlist/[id]`
- **AND** they see the playlist name and description
- **AND** they see a numbered list of songs
- **AND** they can navigate to any song

#### Scenario: Navigate from playlist to song
- **GIVEN** a user is viewing a playlist
- **WHEN** they click on a song
- **THEN** they navigate to `/song/[id]`
- **AND** they see the song title and artist
- **AND** they see the lyrics with preserved formatting
- **AND** they can adjust font size

#### Scenario: Breadcrumb navigation
- **GIVEN** a user is viewing a song
- **WHEN** they look at the page header
- **THEN** they see breadcrumbs showing: Event > Playlist > Song
- **AND** they can click any breadcrumb to navigate back

### Requirement: Lyrics Display and Accessibility
The public app SHALL display song lyrics with excellent readability and accessibility features.

#### Scenario: View song lyrics
- **GIVEN** a user navigates to a song page
- **WHEN** the page loads
- **THEN** lyrics are displayed with preserved line breaks
- **AND** paragraphs/verses are visually separated
- **AND** the layout is optimized for reading

#### Scenario: Adjust font size
- **GIVEN** a user is viewing lyrics
- **WHEN** they use the font size control
- **THEN** the font size changes immediately
- **AND** the size persists for the session
- **AND** the range is 14px to 24px
- **AND** the default is 18px

#### Scenario: Dark mode support
- **GIVEN** a user prefers dark mode
- **WHEN** they toggle dark mode (or system preference)
- **THEN** the interface switches to dark theme
- **AND** contrast remains high for readability
- **AND** the preference persists for the session

#### Scenario: High contrast mode
- **GIVEN** a user needs higher contrast
- **WHEN** they enable high contrast mode (if implemented)
- **THEN** colors provide maximum contrast
- **AND** text is easily readable in various lighting

### Requirement: Mobile-First Design
The public app SHALL be designed mobile-first, ensuring excellent experience on smartphones used during performances.

#### Scenario: Mobile lyrics viewing
- **GIVEN** a user views lyrics on a smartphone
- **WHEN** they scroll through the lyrics
- **THEN** text is large enough to read from a distance
- **AND** scrolling is smooth
- **AND** no horizontal scrolling is required

#### Scenario: Touch-friendly interface
- **GIVEN** a user interacts with the app on mobile
- **WHEN** they tap buttons or links
- **THEN** touch targets are at least 44x44px
- **AND** there is adequate spacing between interactive elements
- **AND** accidental taps are minimized

#### Scenario: Responsive breakpoints
- **GIVEN** users access the app on different devices
- **WHEN** the viewport changes
- **THEN** the layout adapts gracefully
- **AND** mobile: single column, optimized for reading
- **AND** tablet: improved spacing, may show more content
- **AND** desktop: full layout, but still optimized for reading

### Requirement: Performance and Reliability
The public app SHALL perform reliably during live events with minimal loading times.

#### Scenario: Load song lyrics quickly
- **GIVEN** a user navigates to a song during a performance
- **WHEN** the page loads
- **THEN** lyrics display within 2 seconds
- **AND** font size preference applies immediately
- **AND** no layout shift occurs after initial render

#### Scenario: Offline resilience
- **GIVEN** a user has loaded a song page
- **WHEN** they lose internet connection
- **THEN** the already-loaded lyrics remain visible
- **AND** navigation to previously visited pages works (if cached)
- **AND** a subtle indicator shows offline status

#### Scenario: Error handling
- **GIVEN** a song or event is not found
- **WHEN** a user navigates to it
- **THEN** they see a friendly error message
- **AND** they are given navigation options (home, events list)
- **AND** the error is not technical or intimidating

### Requirement: User Preferences
The public app SHALL respect user preferences for font size and theme.

#### Scenario: Persist font size
- **GIVEN** a user adjusts font size to 20px
- **WHEN** they navigate to another song
- **THEN** the new song displays at 20px
- **AND** the preference persists for the browser session

#### Scenario: Persist dark mode
- **GIVEN** a user enables dark mode
- **WHEN** they navigate to another page
- **THEN** dark mode remains active
- **AND** the preference persists for the browser session

#### Scenario: Reset preferences
- **GIVEN** a user has customized preferences
- **WHEN** they want to reset to defaults
- **THEN** they can easily reset font size to 18px
- **AND** they can reset to system theme preference

### Requirement: Social Sharing (Future/Roadmap)
The public app SHALL support sharing events and songs to social media platforms as a future enhancement.

#### Scenario: Share event to social media
- **GIVEN** a user is viewing an event
- **WHEN** they click the share button
- **THEN** they can share to Facebook, Instagram, or copy link
- **AND** the shared content includes event name, date, and link

#### Scenario: Generate QR code for quick access
- **GIVEN** an admin wants to share an event or song
- **WHEN** they generate a QR code
- **THEN** users can scan the code to navigate directly to the content
- **AND** QR codes work for events, playlists, and individual songs

### Requirement: AI Assistant for Lyrics (Future/Roadmap)
The public app SHALL include an AI assistant to help users find songs and lyrics as a future enhancement.

#### Scenario: Search for songs by lyrics
- **GIVEN** a user remembers part of a lyric
- **WHEN** they search using the AI assistant
- **THEN** the system finds matching songs
- **AND** displays results with confidence scores

#### Scenario: Natural language queries
- **GIVEN** a user asks "What songs are in the Christmas playlist?"
- **WHEN** they submit the query
- **THEN** the AI understands and returns relevant results
- **AND** provides direct links to the content
