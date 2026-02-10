# Project Context

## Purpose

**Les Chanteurs** is a comprehensive platform for managing a choir's digital presence. The project provides two distinct applications:

1. **Public Website** - An engaging, accessible website for visitors to discover the choir, view upcoming events, browse playlists, and access song lyrics
2. **Back Office (Admin)** - A complete content management system for choir organizers to manage events, playlists, songs, settings, and media

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for photos/media)
- **Runtime**: Bun
- **Architecture**: Feature-Sliced Design

## Project Conventions

### Code Style
- TypeScript for type safety
- Mobile-first responsive design (always)
- Feature-Sliced Design architecture for code organization

### Architecture Patterns
- **Feature-Sliced Design (FSD)**: Code organized in layers (app, widgets, features, entities, shared)
- **Route Groups**: Next.js route groups separate public (`(public)`) and admin (`(admin)`) applications
- **Server Components**: Default to server components, use client components only when needed

### Testing Strategy
- To be defined

### Git Workflow
- To be defined

## Domain Context

### Application Overview

#### Public Website (`app/(public)/`)

**Purpose**: Provide an engaging public presence for the choir while serving as the primary interface for accessing lyrics during events.

**Key Features**:

**Homepage**:
- Hero section with choir name and tagline
- Current event banner (when an event is marked as current)
- Featured playlists showcase (up to 3 admin-selected playlists)
- Upcoming events grid
- About section (choir description, mission, history)
- Photo gallery (choir performance photos)
- Call-to-action sections (join choir, attend events, follow on social)
- Social media links (Facebook, Instagram, YouTube)

**Event Discovery**:
- Browse all upcoming events at `/events`
- Event detail pages with date, time, location, description, map
- Current event prominently highlighted
- Associated playlists visible from event pages

**Content Browsing**:
- Browse all songs at `/songs` with search/filter
- Browse all playlists at `/playlists`
- Navigate from events → playlists → songs
- Direct access to any song or playlist

**Lyrics Display**:
- Full-screen lyrics view optimized for reading
- Adjustable font size (14px-24px, persisted in session)
- Dark mode support
- High contrast, easy-to-read typography
- Preserved line breaks and verse formatting

**Navigation**:
- Public header with links to Home, Events, Playlists, Songs
- Breadcrumb navigation showing hierarchy
- Enhanced footer with navigation, social links, copyright

**User Personas**:
- **Choir members**: Often retired, not very tech-savvy. Need simple, clear interface for accessing lyrics on phones during performances.
- **Potential new members**: Discovering the choir, learning about mission and upcoming events.
- **Audience members**: Following along with lyrics during performances, learning about the choir.
- **General public**: Browsing events, playlists, and learning about the choir's activities.

**User Flows**:

*Primary Flow (Lyrics Access)*:
1. User visits public website
2. Sees current event banner or upcoming events
3. Clicks event → selects playlist → selects song
4. Views lyrics with adjustable font size
5. Can toggle dark mode for different lighting conditions

*Discovery Flow*:
1. User visits homepage
2. Reads about the choir in hero/about sections
3. Views featured playlists or photo gallery
4. Browses upcoming events
5. Follows social media links or clicks CTAs

*Direct Browse Flow*:
1. User navigates to "Browse Songs" or "Browse Playlists"
2. Searches/filters to find specific content
3. Clicks to view song lyrics or playlist details

#### Back Office (`app/(admin)/admin/`)

**Purpose**: Provide choir organizers with a comprehensive content management system for all platform content.

**Key Features**:

**Authentication**:
- Single password authentication (cookie-based sessions)
- Protected routes via middleware
- Logout functionality

**Dashboard**:
- Count cards for Songs, Playlists, Events
- Statistics for hidden/draft items
- Recent activity widget (last 5 updated items)
- Event calendar widget (monthly view with click-to-create)
- Draft alert for unpublished content
- Quick action buttons (New Song, New Playlist, New Event)

**Navigation**:
- Responsive admin navigation (sidebar on desktop, bottom drawer on mobile)
- Quick actions for creating content
- Collapsible sidebar for more workspace

**Songs Management**:
- List view with filtering (title, artist, language, visibility)
- Create/edit song forms (title, lyrics, artist, language, genre, year, visibility)
- Bulk operations (show, hide, duplicate, archive)
- Individual song duplicate and archive
- Archive management (restore, permanent delete)
- Lyrics with preserved line breaks

**Playlists Management**:
- List view with filtering (name, status)
- Create/edit playlist forms (name, description, status)
- Add songs to playlist (searchable picker)
- Reorder songs (drag-and-drop sortable table)
- Remove songs from playlist
- Archive management (restore, permanent delete)
- Featured playlist toggle (for homepage showcase)

**Events Management**:
- Card-based list with filtering (name, visibility, time)
- Create/edit event forms (name, date, time, place, description, visibility)
- Google Places autocomplete for location
- Interactive Google Map for location selection
- Add playlists to event (searchable picker)
- Reorder playlists (drag-and-drop sortable table)
- Remove playlists from event
- Set current event (star button)
- Archive management (restore, permanent delete)

**Settings Management** (NEW):
- Choir settings form (about text, tagline, social media URLs)
- Photo gallery management (upload, delete, reorder)
- Site configuration

**Shared UI Components**:
- Data tables with selection and filtering
- Sortable content tables (drag-and-drop)
- Form layouts with validation
- Status badges (visible, hidden, in progress, past)
- Archive lists with restore/delete actions
- Empty states
- Breadcrumbs
- Bulk action bars

**User Personas**:
- **Choir organizers/admins**: Manage all content for the platform, prepare playlists for events, control what's visible on public site

**User Flows**:

*Create Event Flow*:
1. Admin logs in
2. Clicks "New Event" from dashboard or events page
3. Fills event details (name, date, time, place with map)
4. Adds playlists to event (or creates new ones)
5. Sets visibility and current event status
6. Saves event

*Manage Songs Flow*:
1. Admin navigates to Songs
2. Uses filters to find songs or views all
3. Edits existing songs or creates new ones
4. Uses bulk operations to show/hide multiple songs
5. Archives outdated songs

*Prepare for Performance Flow*:
1. Admin creates or updates event for upcoming performance
2. Creates/updates playlist with songs for performance
3. Ensures all songs have correct lyrics
4. Sets event as "current event" before performance
5. Makes event and playlist visible
6. Choir members can now access lyrics on public site

### Content Model

#### Events
- **Purpose**: Represent choir performances or gatherings
- **Attributes**:
  - Name (required)
  - Date (required)
  - Time (optional)
  - Place (optional, with Google Places autocomplete)
  - Latitude/Longitude (optional, from map or autocomplete)
  - Description (optional)
  - Visibility (visible/hidden toggle)
  - Is Current (boolean, only one event can be current)
- **Relationships**: Linked to zero, one, or more Playlists (ordered)
- **Visibility**: Can be shown/hidden on public site
- **Current Event**: One event can be marked as "current" (prominently displayed on homepage)
- **Archive**: Soft delete with restore and permanent delete options

#### Playlists
- **Purpose**: Group songs together for a specific event or theme
- **Attributes**:
  - Name (required)
  - Description (optional)
  - Status (visible, hidden, in progress)
  - Featured (boolean, for homepage showcase)
  - Featured Order (integer, for ordering featured playlists)
- **Relationships**:
  - Linked to one or more Events
  - Contains multiple Songs (ordered)
- **Visibility**: Status controls visibility (visible = shown on public site)
- **Featured**: Up to 3 playlists can be featured on homepage
- **Archive**: Soft delete with restore and permanent delete options

#### Songs
- **Purpose**: Individual songs with lyrics
- **Required Attributes**: Title, Lyrics
- **Optional Attributes**: Artist/Composer, Language, Genre, Year
- **Lyrics Format**: Plain text with preserved line breaks (single `\n` = new line, double `\n\n` = paragraph/verse)
- **Relationships**:
  - Can belong to multiple Playlists
  - Changes to song are reflected in all playlists
- **Visibility**: Show/hide toggle
  - Hidden songs do not appear on public website
  - Hidden songs appear greyed out in admin playlists for editing/preview
- **Deletion**: Soft delete (archive) with hard delete option from archive
  - Deleting from songs list removes from all playlists (with confirmation)
  - Removing from playlist only removes from that playlist
- **Font Size**: Custom range 14px-24px via slider, applies to lyrics only, stored in session
- **Management**: Copy/duplicate, search (title/artist/language/visibility), bulk visibility toggle, bulk archive

#### Choir Settings (NEW)
- **Purpose**: Store site-wide configuration and content
- **Attributes**:
  - About text (rich text, choir description)
  - Tagline (short welcome message)
  - Facebook URL (optional)
  - Instagram URL (optional)
  - YouTube URL (optional)
  - Contact email (optional)
- **Management**: Single settings page in admin

#### Choir Photos (NEW)
- **Purpose**: Store gallery images for public site
- **Attributes**:
  - Image file (stored in Supabase Storage)
  - Caption (optional)
  - Display order (integer)
- **Management**: Photo gallery page in admin with upload/delete/reorder

### Design Considerations

**Accessibility & Usability**:
- Interfaces must be clear and simple
- High contrast and easy to read
- Mobile-first always, no exceptions
- Public web app supports dark mode
- Lyrics support multiple font-size options
- Font size preference stored in browser session (persists when changing songs)
- Touch targets ≥ 44px on mobile
- Keyboard navigation support

**Technical Constraints**:
- Mobile-first design is non-negotiable
- Must work well on small screens (choir members using phones on stage)
- High contrast for readability in various lighting conditions
- Session-based font size storage (not persistent across devices)
- Performance: homepage loads < 2 seconds on 3G
- No layout shift after initial render
- Images optimized with next/image

**Visual Design**:
- Consistent color scheme and branding
- Clear visual hierarchy with proper heading structure
- Adequate spacing between sections
- Responsive grid layouts
- Status indicators with color coding
- Empty states for missing content

## Goals

### Primary Goals (Phase 1 – MVP)

- Launch a Minimum Viable Product (MVP) that includes:
  - A public website for the audience, choir members, and general public
  - A back-office to manage the site's data
- Provide very simple authentication for the back-office:
  - Single password-based access (✅ Already implemented)
- Allow admins to create and manage:
  - Events
  - Playlists
  - Songs
  - Choir settings and photos
- Control visibility:
  - Decide which items are visible or hidden
  - Define how events, playlists, and songs are linked together
  - Feature specific playlists on homepage
  - Set current event
- Create an engaging public presence:
  - Welcoming homepage with hero section
  - Featured content and photo gallery
  - Easy navigation and content discovery
  - Social media integration

### Long-Term Vision (Roadmap)

- **Social Sharing**: Share events to social media (Facebook, Instagram)
- **QR Codes**: Generate QR codes for songs/playlists for quick access via phone scan
- **AI Assistant**: Help admins find correct song lyrics, help users search by lyrics
- **Monetization**: Ads or other revenue to cover database and hosting costs
- **Advanced Search**: Full-text search across songs, playlists, events
- **User Accounts**: Save favorite songs, create custom playlists
- **Performance Analytics**: Track which songs/playlists are most popular
- **Multi-language Support**: Interface in multiple languages
- **Offline Support**: PWA with offline lyrics access

## Important Constraints

- **Mobile-first**: All interfaces must be designed mobile-first, no exceptions
- **Accessibility**: High contrast, easy to read, simple navigation
- **User Base**: Choir members are often retired and not tech-savvy - simplicity is critical
- **Real-time Use**: Public website must work reliably during live events
- **Session Storage**: Font size preferences stored in session (not persistent across devices)
- **Performance**: Fast loading times, no layout shift, optimized images
- **Admin-friendly**: All content manageable without code changes

## External Dependencies

- **Supabase**: PostgreSQL database for storing events, playlists, songs, settings
- **Supabase Storage**: File storage for photos and media
- **Next.js**: Framework for both applications
- **Tailwind CSS**: Styling system
- **shadcn/ui**: Component library
- **Google Maps API**: Place autocomplete and map for event locations
- **Lucide React**: Icon library

## Open Questions (To Be Clarified)

Questions are organized by feature scope. We'll define each entity (Songs, Playlists, Events) one at a time before moving to the next.

### Songs

**Status**: Completed and implemented.

See `openspec/specs/songs/spec.md` for the finalized Songs specification.

### Playlists

**Status**: Completed and implemented.

See `openspec/specs/playlists/spec.md` for the finalized Playlists specification.

**New**: Featured playlists functionality to be added as part of homepage enhancements.

### Events

**Status**: Completed and implemented.

See `openspec/specs/events/spec.md` for the finalized Events specification.

### Public Website Enhancements

**Status**: In progress (see `openspec/changes/enhance-public-homepage/`).

Questions:
- How many photos should the gallery display? (Proposed: 4-6)
- Should featured playlists rotate automatically? (Proposed: No, manual admin selection)
- Should there be a full "About" page or just homepage section? (Proposed: Homepage section first)
- What's the minimum content required for launch? (Proposed: About text and tagline required, rest optional)
