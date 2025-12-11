# Project Context

## Purpose

**Les Chanteurs** (Singer) is a platform for managing a choir's events and playlists in real time. The project provides two distinct applications:

1. **Public Website** - Allows singers and guests to easily access lyrics for the current event's playlist
2. **Back Office (Admin)** - Allows choir organizers to manage events, playlists, and songs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Runtime**: Bun
- **Architecture**: Feature-Sliced Design

## Project Conventions

### Code Style
- TypeScript for type safety
- Mobile-first responsive design (always)
- Feature-Sliced Design architecture for code organization

### Architecture Patterns
- **Feature-Sliced Design (FSD)**: Code organized in layers (app, pages, widgets, features, entities, shared)
- **Route Groups**: Next.js route groups separate public (`(public)`) and admin (`(admin)`) applications
- **Server Components**: Default to server components, use client components only when needed

### Testing Strategy
- To be defined

### Git Workflow
- To be defined

## Domain Context

### Application Overview

#### Public Website (`app/(public)/`)
**Purpose**: Provide easy access to lyrics for choir members and audience during events.

**Key Features**:
- Display lyrics for songs in the current event's playlist
- Support for multiple font-size options (stored in session)
- Dark mode support
- High contrast, easy-to-read interface
- Mobile-first design (critical for on-stage use)

**User Personas**:
- **Choir members**: Often retired people, not very comfortable with technology. Need simple, clear interface.
- **Guests/audience**: May want to follow along with lyrics during performances.

**User Flows**:
- User visits public website
- System determines "current event" (logic to be defined)
- User sees playlist for current event
- User selects a song to view lyrics
- User can adjust font size (persisted in session)
- User can toggle dark mode

#### Back Office (`app/(admin)/admin/`)
**Purpose**: Allow choir organizers to manage all content for the platform.

**Key Features**:
- Single password authentication (already implemented)
- Manage Events (create, edit, delete, visibility control)
- Manage Playlists (create, edit, delete, link to events, visibility control)
- Manage Songs (create, edit, delete, lyrics content, link to playlists, visibility control)
- Control visibility of all content items
- Define relationships between events, playlists, and songs

**User Personas**:
- **Choir organizers/admins**: Manage events, playlists, and song content

**User Flows**:
- Admin logs in with single password
- Admin accesses dashboard
- Admin can navigate to Events, Playlists, or Songs management
- Admin can create/edit/delete items
- Admin can control visibility (show/hide items)
- Admin can link items together (events ↔ playlists ↔ songs)

### Content Model (To Be Refined)

#### Events
- Purpose: Represent choir performances or gatherings
- Attributes: To be defined (date, location, title, description, status, etc.)
- Relationships: Linked to none, one or more Playlists
- Visibility: Can be shown/hidden

#### Playlists
- Purpose: Group songs together for a specific event
- Attributes: To be defined (name, description, order, etc.)
- Relationships: 
  - Linked to one Event
  - Contains multiple Songs
- Visibility: Can be shown/hidden

#### Songs
- Purpose: Individual songs with lyrics
- Required Attributes: Title, Lyrics
- Optional Attributes: Artist/Composer, Language, Genre, Year
- Lyrics Format: Plain text with preserved line breaks (single `\n` = new line, double `\n\n` = paragraph/verse)
- Relationships:
  - Can belong to multiple Playlists
  - Changes to song are reflected in all playlists
- Visibility: Show/hide toggle
  - Hidden songs do not appear on public website
  - Hidden songs appear greyed out in admin playlists for editing/preview
- Deletion: Soft delete (archive) with hard delete option from archive
  - Deleting from songs list removes from all playlists (with confirmation)
  - Removing from playlist only removes from that playlist
- Font Size: Custom range 14px-24px via slider, applies to lyrics only, stored in session
- Management: Copy/duplicate, search (title/artist/language/visibility), bulk visibility toggle

### Design Considerations

**Accessibility & Usability**:
- Interfaces must be clear and simple
- High contrast and easy to read
- Mobile-first always, no exceptions
- Public web app supports dark mode
- Lyrics support multiple font-size options
- Font size preference stored in browser session (persists when changing songs)

**Technical Constraints**:
- Mobile-first design is non-negotiable
- Must work well on small screens (choir members using phones on stage)
- High contrast for readability in various lighting conditions
- Session-based font size storage (not persistent across devices)

## Goals

### Primary Goals (Phase 1 – MVP)

- Launch a Minimum Viable Product (MVP) that includes:
  - A public web site for the audience and choir members
  - A back-office to manage the site's data
- Provide very simple authentication for the back-office:
  - Single password-based access (✅ Already implemented)
- Allow admins to create and manage:
  - Events
  - Playlists
  - Songs
- Control visibility:
  - Decide which items are visible or hidden
  - Define how events, playlists, and songs are linked together

### Long-Term Vision (Roadmap)
- Share an event into social medias (Facebook, instagram)
- Become the preferred interface for the city's choir to:
  - Discover upcoming events
  - Browse playlists and lyrics for each event
  - Access additional content in the future

**Possible Future Extensions**:

- Add an AI assistant to help admins find the correct song lyrics
- Add QR codes for songs so new participants can quickly find lyrics from their phones
- Add ways to monetize (e.g. ads or other revenue) to cover database and hosting costs
- Other features to be defined

## Important Constraints

- **Mobile-first**: All interfaces must be designed mobile-first, no exceptions
- **Accessibility**: High contrast, easy to read, simple navigation
- **User Base**: Choir members are often retired and not tech-savvy - simplicity is critical
- **Real-time Use**: Public website must work reliably during live events
- **Session Storage**: Font size preferences stored in session (not persistent across devices)

## External Dependencies

- **Supabase**: PostgreSQL database for storing events, playlists, songs, and relationships
- **Next.js**: Framework for both applications
- **Tailwind CSS**: Styling system
- **shadcn/ui**: Component library

## Open Questions (To Be Clarified)

Questions are organized by feature scope. We'll define each entity (Songs, Playlists, Events) one at a time before moving to the next.

### Songs (Current Focus)

**Status**: Questions and decisions are being defined in OpenSpec proposal `define-songs-scope`.

See `openspec/changes/define-songs-scope/design.md` for all questions about Songs data model, fields, lyrics format, visibility, deletion behavior, and font size options.

Once questions are answered and decisions made, the Songs specification will be finalized.

### Playlists (Next)
- Questions to be defined after Songs are complete.

### Events (After Playlists)
- Questions to be defined after Playlists are complete.
