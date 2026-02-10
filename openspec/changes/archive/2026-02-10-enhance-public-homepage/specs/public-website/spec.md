## ADDED Requirements

### Requirement: Hero Section
The public homepage SHALL display a prominent hero section that welcomes visitors and introduces the choir.

#### Scenario: Hero section displays on homepage
- **WHEN** a user visits the homepage `/`
- **THEN** a hero section is displayed at the top
- **AND** the section shows the choir name prominently
- **AND** the section shows a tagline or welcome message
- **AND** the section uses visual elements (background color, image, or gradient)

#### Scenario: Hero section on mobile
- **GIVEN** a user views the homepage on mobile
- **WHEN** the hero section renders
- **THEN** text is readable without zooming
- **AND** the layout is optimized for small screens
- **AND** all content fits without horizontal scrolling

#### Scenario: No tagline configured
- **GIVEN** no tagline is set in admin settings
- **WHEN** the hero section renders
- **THEN** a default welcome message is displayed
- **OR** the section shows only the choir name

### Requirement: About Section
The public homepage SHALL include an about/introduction section that describes the choir's mission and history.

#### Scenario: About section displays
- **WHEN** a user scrolls down the homepage
- **THEN** an about section is visible
- **AND** the section displays a brief description of the choir
- **AND** the section includes information about the choir's mission or history
- **AND** the content is admin-configurable

#### Scenario: No about content configured
- **GIVEN** no about content is set in admin settings
- **WHEN** the homepage renders
- **THEN** the about section is hidden
- **OR** a default placeholder message is shown

#### Scenario: About section formatting
- **WHEN** the about section displays
- **THEN** text is formatted with proper paragraphs
- **AND** line breaks are preserved
- **AND** typography is clear and readable

### Requirement: Featured Playlists Showcase
The public homepage SHALL showcase up to 3 featured playlists selected by admins.

#### Scenario: Featured playlists display
- **GIVEN** playlists are marked as featured in admin
- **WHEN** a user visits the homepage
- **THEN** up to 3 featured playlists are displayed
- **AND** playlists are shown in admin-defined order
- **AND** each playlist shows name and song count
- **AND** clicking a playlist navigates to `/playlist/[id]`

#### Scenario: No featured playlists
- **GIVEN** no playlists are marked as featured
- **WHEN** the homepage renders
- **THEN** the featured playlists section is hidden

#### Scenario: Featured playlists on mobile
- **GIVEN** a user views the homepage on mobile
- **WHEN** featured playlists render
- **THEN** playlists display in a single column
- **AND** touch targets are at least 44px

#### Scenario: Featured playlists on desktop
- **GIVEN** a user views the homepage on desktop
- **WHEN** featured playlists render
- **THEN** playlists display in a grid (up to 3 columns)

### Requirement: Photo Gallery
The public homepage SHALL display a photo gallery showcasing the choir.

#### Scenario: Photo gallery displays
- **GIVEN** photos are uploaded in admin
- **WHEN** a user visits the homepage
- **THEN** a photo gallery section is displayed
- **AND** up to 6 photos are shown in a responsive grid
- **AND** photos are optimized for web (using next/image)
- **AND** photos load efficiently without blocking page render

#### Scenario: No photos configured
- **GIVEN** no photos are uploaded in admin
- **WHEN** the homepage renders
- **THEN** the photo gallery section is hidden

#### Scenario: Photo gallery on mobile
- **GIVEN** a user views the homepage on mobile
- **WHEN** the photo gallery renders
- **THEN** photos display in 1-2 columns
- **AND** images are appropriately sized for mobile

#### Scenario: Photo gallery on desktop
- **GIVEN** a user views the homepage on desktop
- **WHEN** the photo gallery renders
- **THEN** photos display in a 3-column grid

### Requirement: Call-to-Action Sections
The public homepage SHALL include call-to-action sections encouraging engagement.

#### Scenario: CTA sections display
- **WHEN** a user views the homepage
- **THEN** call-to-action sections are visible
- **AND** CTAs may include: join the choir, attend events, follow on social media
- **AND** each CTA has a clear button or link

#### Scenario: Join choir CTA
- **GIVEN** a "join choir" CTA is configured
- **WHEN** displayed on the homepage
- **THEN** the CTA shows a button or link
- **AND** the button links to a contact email or external form

#### Scenario: Social media CTA
- **GIVEN** social media links are configured
- **WHEN** displayed on the homepage
- **THEN** the CTA encourages following on social platforms
- **AND** links to configured social profiles are provided

### Requirement: Enhanced Visual Hierarchy
The public homepage SHALL have improved typography, spacing, and visual design.

#### Scenario: Visual improvements
- **WHEN** a user views the homepage
- **THEN** sections have clear visual separation
- **AND** typography uses consistent heading hierarchy (h1, h2, h3)
- **AND** spacing between sections is adequate
- **AND** color scheme is consistent with app branding

#### Scenario: Dark mode support
- **GIVEN** a user has dark mode enabled
- **WHEN** they view the homepage
- **THEN** all new sections adapt to dark theme
- **AND** contrast remains high for readability

### Requirement: Social Media Links
The public app SHALL display social media links for the choir.

#### Scenario: Social links in footer
- **GIVEN** social media URLs are configured in admin
- **WHEN** a user views any public page footer
- **THEN** social media icons are displayed
- **AND** clicking an icon opens the respective platform in a new tab
- **AND** supported platforms include Facebook, Instagram, YouTube

#### Scenario: No social links configured
- **GIVEN** no social media URLs are set in admin
- **WHEN** the footer renders
- **THEN** the social links section is hidden

#### Scenario: Social link accessibility
- **WHEN** social links are displayed
- **THEN** each icon has an accessible label (aria-label)
- **AND** links indicate they open in new tab

### Requirement: Browse All Songs Page
The public app SHALL provide a page at `/songs` for browsing all visible songs.

#### Scenario: Navigate to songs page
- **GIVEN** a user clicks "Browse Songs" link
- **WHEN** they navigate to `/songs`
- **THEN** a page displays all visible songs
- **AND** songs are sorted alphabetically by title
- **AND** each song shows title, artist, and language

#### Scenario: Songs list display
- **WHEN** the songs page loads
- **THEN** songs are displayed in a list or grid format
- **AND** clicking a song navigates to `/song/[id]`
- **AND** the page has a clear title (e.g., "All Songs")

#### Scenario: Search songs
- **GIVEN** a user wants to find a specific song
- **WHEN** they use the search input
- **THEN** songs are filtered by title in real-time
- **AND** the list updates as they type

#### Scenario: No visible songs
- **GIVEN** no songs are marked as visible
- **WHEN** a user visits `/songs`
- **THEN** an empty state is displayed
- **AND** a message explains no songs are available

#### Scenario: Songs page on mobile
- **GIVEN** a user views `/songs` on mobile
- **WHEN** the page renders
- **THEN** songs display in a single column
- **AND** touch targets are at least 44px

### Requirement: Browse All Playlists Page
The public app SHALL provide a page at `/playlists` for browsing all visible playlists.

#### Scenario: Navigate to playlists page
- **GIVEN** a user clicks "Browse Playlists" link
- **WHEN** they navigate to `/playlists`
- **THEN** a page displays all visible playlists
- **AND** playlists are sorted alphabetically by name
- **AND** each playlist shows name, description (brief), and song count

#### Scenario: Playlists list display
- **WHEN** the playlists page loads
- **THEN** playlists are displayed in a list or grid format
- **AND** clicking a playlist navigates to `/playlist/[id]`
- **AND** the page has a clear title (e.g., "All Playlists")

#### Scenario: No visible playlists
- **GIVEN** no playlists are marked as visible
- **WHEN** a user visits `/playlists`
- **THEN** an empty state is displayed
- **AND** a message explains no playlists are available

#### Scenario: Playlists page on mobile
- **GIVEN** a user views `/playlists` on mobile
- **WHEN** the page renders
- **THEN** playlists display in a single column
- **AND** touch targets are at least 44px

### Requirement: Enhanced Public Navigation
The public app SHALL have enhanced header navigation with links to main sections.

#### Scenario: Header navigation
- **WHEN** a user views any public page
- **THEN** a header is displayed with navigation links
- **AND** navigation includes: Home (logo), Events, Playlists, Songs
- **AND** the current page is visually indicated
- **AND** clicking a link navigates to the respective page

#### Scenario: Mobile navigation
- **GIVEN** a user views on mobile
- **WHEN** the header renders
- **THEN** navigation is accessible via a menu button
- **OR** navigation links are displayed in a mobile-friendly format
- **AND** the menu is easy to open and close

#### Scenario: Logo link
- **WHEN** a user clicks the choir logo/name in the header
- **THEN** they navigate to the homepage `/`

### Requirement: Enhanced Footer
The public app footer SHALL include social media links, navigation links, and choir information.

#### Scenario: Footer content
- **WHEN** a user views any public page footer
- **THEN** the footer displays social media links
- **AND** the footer displays navigation links (Events, Playlists, Songs)
- **AND** the footer displays copyright information

#### Scenario: Footer layout
- **GIVEN** a user views the footer on desktop
- **WHEN** the footer renders
- **THEN** content is organized in columns (navigation, social, copyright)

#### Scenario: Footer on mobile
- **GIVEN** a user views the footer on mobile
- **WHEN** the footer renders
- **THEN** content is stacked vertically for readability

## MODIFIED Requirements

### Requirement: Public Home Page
The public app SHALL provide a home page that serves as the entry point for users, displaying engaging content including current event, upcoming events, featured playlists, about section, and visual elements.

#### Scenario: User visits home page with current event
- **GIVEN** there is an event marked as "current" in the admin
- **WHEN** a user visits the home page `/`
- **THEN** the user sees a hero section with choir welcome
- **AND** the user sees the current event prominently displayed
- **AND** the user sees featured playlists (if configured)
- **AND** the user sees a list of upcoming events
- **AND** the user sees an about section describing the choir
- **AND** the user sees a photo gallery (if photos uploaded)
- **AND** the user sees call-to-action sections
- **AND** the user can navigate to any section easily

#### Scenario: User visits home page without current event
- **GIVEN** there is no event marked as "current"
- **WHEN** a user visits the home page `/`
- **THEN** the user sees a hero section with choir welcome
- **AND** the user sees featured playlists (if configured)
- **AND** the user sees a list of upcoming events
- **AND** the user sees an about section
- **AND** the user sees a photo gallery (if configured)
- **AND** the user sees call-to-action sections
- **AND** events are sorted by date (nearest first)
- **AND** past events are hidden or clearly marked

#### Scenario: Mobile home page view
- **GIVEN** a user visits the home page on a mobile device
- **WHEN** the page loads
- **THEN** all sections are optimized for mobile viewing
- **AND** touch targets are at least 44px
- **AND** text is readable without zooming
- **AND** images are optimized for mobile bandwidth

#### Scenario: Homepage performance
- **WHEN** a user visits the homepage
- **THEN** the page loads in less than 2 seconds on 3G
- **AND** no layout shift occurs after initial render
- **AND** images are lazy-loaded or optimized

### Requirement: Navigation to Events List
The home page SHALL provide navigation to the full events list page and to new browse pages.

#### Scenario: View all events
- **GIVEN** a user is on the home page
- **WHEN** they click "View All Events" link
- **THEN** they navigate to `/events`
- **AND** the link is clearly visible

#### Scenario: Browse songs
- **GIVEN** a user is on the home page
- **WHEN** they click "Browse Songs" in header or footer
- **THEN** they navigate to `/songs`

#### Scenario: Browse playlists
- **GIVEN** a user is on the home page
- **WHEN** they click "Browse Playlists" in header or footer
- **THEN** they navigate to `/playlists`
