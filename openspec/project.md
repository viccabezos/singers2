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
**Purpose**: Provide easy access to lyrics for choir members and audience during events, plus showcase the choir with an engaging public presence.

**Key Features**:
- **Homepage**: Complete structure with hero, about section, featured playlists, photo gallery, and call-to-action
- **Dynamic Content**: Admin-configurable tagline, about text, social links, and contact email
- **Photo Gallery**: Display up to 6 photos from admin-uploaded choir photos
- **Event Access**: Display lyrics for songs in the current event's playlist
- **Font Size Control**: Multiple font-size options for lyrics (stored in session)
- **Dark Mode**: Full dark mode support across all pages
- **Navigation**: Enhanced header with mobile menu, footer with social links
- **Skeleton States**: Graceful loading states for all dynamic content
- **Mobile-First**: Responsive design optimized for on-stage phone use

**User Personas**:
- **Choir members**: Often retired people, not very comfortable with technology. Need simple, clear interface.
- **Guests/audience**: May want to follow along with lyrics during performances or learn about the choir.

**User Flows**:
- User visits public website homepage
- User sees hero section with choir tagline, about section, photo gallery, and featured content
- User can click social media links (if configured) or contact button
- User navigates to events to view playlists
- User selects a song to view lyrics
- User can adjust font size (persisted in session)
- User can toggle dark mode

#### Back Office (`app/(admin)/admin/`)
**Purpose**: Allow choir organizers to manage all content for the platform.

**Key Features**:
- **Authentication**: Single password authentication (cookie-based sessions)
- **Content Management**: 
  - Manage Events (create, edit, delete, visibility control)
  - Manage Playlists (create, edit, delete, link to events, visibility control)
  - Manage Songs (create, edit, delete, lyrics content, link to playlists, visibility control)
- **Site Settings**: Configure tagline, about text, social media links, contact email
- **Photo Gallery**: Upload, manage, reorder choir photos (multiple uploads, bulk delete, drag-to-reorder)
- **Visibility Control**: Show/hide content items
- **Relationships**: Define links between events, playlists, and songs
- **Dashboard**: Overview with recent activity and quick actions
- **Navigation**: Sidebar navigation (desktop) with mobile drawer menu

**User Personas**:
- **Choir organizers/admins**: Manage events, playlists, songs, and site content

**User Flows**:
- Admin logs in with single password
- Admin accesses dashboard with overview
- Admin can navigate to Events, Playlists, Songs, Photos, or Settings
- Admin can create/edit/delete items
- Admin can control visibility (show/hide items)
- Admin can link items together (events ↔ playlists ↔ songs)
- Admin can upload and manage photos for public gallery
- Admin can configure site-wide settings (tagline, about text, social links)

### Content Model

#### Choir Settings
- Purpose: Store site-wide configuration for public website
- Attributes: tagline, about_text, facebook_url, instagram_url, youtube_url, contact_email
- Pattern: Singleton table (single row with id=1)
- Management: Admin settings page (`/admin/settings`)
- Public Use: Dynamic content in hero, about, footer, and CTA sections
- Graceful Degradation: Widgets fall back to placeholder content if not configured

#### Photos
- Purpose: Showcase choir through photo gallery on public website
- Attributes: image_url (Supabase Storage), caption (optional), display_order, timestamps
- Storage: `choir-photos` bucket in Supabase Storage (public, max 5MB per image)
- Management: 
  - Upload: Multiple file upload with drag-and-drop support
  - Reorder: Drag-to-reorder photos
  - Delete: Individual or bulk deletion with checkboxes
  - Captions: Inline caption editing
- Public Display: Up to 6 photos shown on homepage gallery
- File Types: JPG, PNG, WebP
- Graceful Degradation: Skeleton states shown when no photos uploaded

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

- ✅ Launch a Minimum Viable Product (MVP) that includes:
  - ✅ A public website for the audience and choir members with:
    - ✅ Complete homepage with hero, about, photo gallery, featured content, and CTAs
    - ✅ Dynamic content managed by admins (tagline, about text, social links)
    - ✅ Photo gallery showcasing the choir
    - ✅ Event, playlist, and song browsing
    - ✅ Lyrics display with font-size control
    - ✅ Dark mode support
    - ✅ Mobile-first responsive design
  - ✅ A back-office to manage the site's data with:
    - ✅ Dashboard with overview
    - ✅ Event, playlist, and song management
    - ✅ Photo gallery management
    - ✅ Site settings configuration
    - ✅ Visibility controls
- ✅ Provide simple authentication for the back-office:
  - ✅ Single password-based access with cookie sessions
- ✅ Allow admins to create and manage:
  - ✅ Events
  - ✅ Playlists
  - ✅ Songs
  - ✅ Photos
  - ✅ Site Settings
- ✅ Control visibility:
  - ✅ Decide which items are visible or hidden
  - ✅ Define how events, playlists, and songs are linked together

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

- **Supabase**: PostgreSQL database and Storage for:
  - Database: Events, playlists, songs, choir_settings, choir_photos tables
  - Storage: `choir-photos` bucket for photo uploads
  - Authentication: Service role key for admin operations
  - RLS: Row-level security for data access control
- **Next.js 16**: Framework for both public and admin applications
- **Tailwind CSS 4**: Styling system with dark mode support
- **shadcn/ui**: Component library (buttons, forms, dialogs, etc.)
- **Bun**: Runtime and package manager

## Open Questions (To Be Clarified)

### Current State (February 2026)

**Completed Features**:
- ✅ Public homepage with complete widget structure (7 sections)
- ✅ Choir settings management (dynamic content)
- ✅ Photo gallery management system (upload, reorder, bulk delete)
- ✅ Featured playlists functionality
- ✅ Browse pages for songs and playlists
- ✅ Admin dashboard and navigation
- ✅ Events, playlists, and songs CRUD operations
- ✅ Lyrics display with font-size control
- ✅ Dark mode support
- ✅ Mobile-first responsive design throughout
- ✅ Comprehensive admin documentation

**Active Changes**:
- `prepare-for-deployment` - Production deployment preparation
- `test-social-links-and-polish` - Social links testing and final polish

**Next Phase**:
- User accounts for choir members (vs single admin password)
- Analytics/metrics for tracking usage
- Data export/backup functionality
- Integration with external services (social media auto-posting)
- AI assistant for finding lyrics
- QR codes for quick song access
- Performance monitoring

### Questions for Future Consideration

- How should "current event" be determined for the public homepage?
- Should we add user accounts for choir members?
- What analytics/metrics are needed to track usage?
- Should there be a way to export/backup data?
- Integration with external services (social media auto-posting, etc.)?
- Monetization options to cover hosting costs?
