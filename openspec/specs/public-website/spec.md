# public-website Specification

## Purpose
TBD - created by archiving change define-project-structure. Update Purpose after archive.
## Requirements
### Requirement: Public Website Application
The system SHALL provide a public-facing website application built with Next.js, Tailwind CSS, and shadcn components.

#### Scenario: Public access
- **WHEN** a user visits the website
- **THEN** they can view public content without authentication

#### Scenario: Mobile-first responsive design
- **WHEN** a user accesses the website on a mobile device
- **THEN** the interface is optimized for mobile viewing
- **WHEN** a user accesses the website on a tablet or desktop
- **THEN** the interface progressively enhances with additional features and layout improvements
- **AND** all responsive adaptations use Tailwind CSS mobile-first breakpoints

### Requirement: Public Website Routing
The public website SHALL use Next.js App Router with routes organized under the `(public)` route group.

#### Scenario: Home page access
- **WHEN** a user navigates to the root URL `/`
- **THEN** they are served the public website home page

#### Scenario: Public pages
- **WHEN** a user navigates to any public route
- **THEN** the route is handled by the public application route group

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

