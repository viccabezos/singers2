# Les Chanteurs - Public Application Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 2026  
**Status:** Draft  

---

## Executive Summary

Les Chanteurs is a choir management platform consisting of two applications:
1. **Admin Back-Office** (Complete) - For choir organizers to manage events, playlists, and songs
2. **Public Website** (In Development) - For choir members and audience to access lyrics during performances

This PRD defines the complete user experience, features, and technical requirements for the Public Website to ensure it meets the needs of choir members (often retired, non-tech-savvy) and guests who need simple, reliable access to lyrics during live performances.

---

## Table of Contents

1. [User Personas](#user-personas)
2. [Current State Analysis](#current-state-analysis)
3. [Information Architecture](#information-architecture)
4. [Feature Specifications](#feature-specifications)
5. [User Flows](#user-flows)
6. [UI/UX Design Guidelines](#uiux-design-guidelines)
7. [Technical Requirements](#technical-requirements)
8. [MVP Scope](#mvp-scope)
9. [Future Roadmap](#future-roadmap)
10. [Acceptance Criteria](#acceptance-criteria)

---

## User Personas

### Primary Persona: Choir Member (Marie, 68)
- **Background:** Retired teacher, sings in the choir for 10 years
- **Tech Comfort:** Low - uses smartphone for basic tasks (calls, messages, photos)
- **Goals:** 
  - Access lyrics quickly during rehearsals and performances
  - Read lyrics easily on stage under various lighting
  - Navigate without confusion or technical barriers
- **Pain Points:**
  - Small text is hard to read
  - Complex navigation is confusing
  - Apps that require technical knowledge
  - Losing place when switching between songs
- **Device:** iPhone, often holds it while singing

### Secondary Persona: Guest/Audience Member (Pierre, 45)
- **Background:** Attending a choir performance, wants to follow along
- **Tech Comfort:** Medium - comfortable with smartphones and apps
- **Goals:**
  - Discover upcoming choir events
  - Follow along with lyrics during performance
  - Share events with friends
- **Pain Points:**
  - Not knowing which songs will be performed
  - Can't read lyrics from a distance
  - Difficulty finding event information
- **Device:** Various smartphones

### Tertiary Persona: New Choir Member (Sophie, 55)
- **Background:** Recently joined the choir, learning the repertoire
- **Tech Comfort:** Medium-Low - learning to use new tools
- **Goals:**
  - Practice lyrics at home
  - Access songs from different playlists
  - Learn the choir's existing repertoire
- **Pain Points:**
  - Finding specific songs quickly
  - Remembering which playlist contains which songs
- **Device:** Android tablet and smartphone

---

## Current State Analysis

### Implemented Features

#### ✅ Song Page (`/song/[id]`)
- **Status:** Implemented
- **Features:**
  - Display song title and artist
  - Show lyrics with preserved line breaks and paragraph formatting
  - Font size slider (14px - 24px, default 18px)
  - Font size persisted in sessionStorage
  - Dark mode support
  - Responsive layout

#### ✅ Event Page (`/event/[id]`)
- **Status:** Implemented
- **Features:**
  - Display event details (name, date, time, location, description)
  - Google Maps integration for location
  - List associated playlists
  - Navigation to playlists
  - "Back to home" link

#### ✅ Playlist Page (`/playlist/[id]`)
- **Status:** Implemented
- **Features:**
  - Display playlist name and description
  - Numbered list of songs
  - Navigation to individual songs
  - Song count display

### Missing Features (MVP Priority)

#### ❌ Home Page (`/`)
- **Status:** Not implemented (default Next.js template)
- **Needed:** 
  - Featured current event banner
  - List of upcoming events
  - Navigation to events list
  - Quick access to current event's playlists

#### ❌ Events List Page
- **Status:** Not implemented
- **Needed:**
  - Chronological list of all upcoming events
  - Event cards with date, time, location
  - Filtering/sorting options
  - Past events section (optional)

#### ❌ Consistent Navigation
- **Status:** Not implemented
- **Needed:**
  - Header with logo/home link
  - Breadcrumb navigation
  - Consistent footer

#### ❌ Error Pages
- **Status:** Not implemented
- **Needed:**
  - 404 Not Found page
  - Friendly error messages
  - Navigation options

---

## Information Architecture

### Site Map

```
/
├── Home Page
│   ├── Current Event Banner (if set)
│   ├── Upcoming Events List
│   └── Quick Links
│
├── /events
│   └── Events List Page
│       ├── Upcoming Events (chronological)
│       └── Past Events (optional)
│
├── /event/[id]
│   └── Event Detail Page
│       ├── Event Info (name, date, time, location, description)
│       ├── Location Map
│       └── Associated Playlists
│
├── /playlist/[id]
│   └── Playlist Detail Page
│       ├── Playlist Info (name, description)
│       └── Numbered Song List
│
└── /song/[id]
    └── Song Detail Page
        ├── Song Info (title, artist)
        ├── Font Size Control
        └── Lyrics Display
```

### URL Structure

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Entry point, shows current/upcoming events |
| Events List | `/events` | All upcoming events |
| Event Detail | `/event/[id]` | Specific event with playlists |
| Playlist Detail | `/playlist/[id]` | Playlist with song list |
| Song Detail | `/song/[id]` | Song lyrics display |

### Navigation Flow

```
User visits /
    ↓
Sees Current Event Banner (if exists) → Click → /event/[id]
    ↓
Sees Upcoming Events List → Click → /event/[id]
    ↓
On Event Page → Click Playlist → /playlist/[id]
    ↓
On Playlist Page → Click Song → /song/[id]
    ↓
On Song Page → Use breadcrumbs to navigate back
```

---

## Feature Specifications

### 1. Home Page

#### 1.1 Current Event Banner
**Priority:** High  
**User Story:** As a choir member, I want to see the current event prominently so I can quickly access its playlists.

**Requirements:**
- Display only if an event is marked as "current" in admin
- Show event name, date, and brief description
- Large, tappable banner area
- Click navigates to event detail page
- Visual distinction from other content (background color, border, or shadow)

**Acceptance Criteria:**
- [ ] Banner appears only when current event exists
- [ ] Banner displays event name, date, and truncated description
- [ ] Clicking banner navigates to `/event/[id]`
- [ ] Banner is visually prominent (larger than event list items)
- [ ] Mobile: Full-width banner with adequate touch target (min 120px height)

#### 1.2 Upcoming Events List
**Priority:** High  
**User Story:** As a user, I want to see upcoming events so I can plan which performances to attend.

**Requirements:**
- Display 5-10 upcoming visible events
- Sorted by date (nearest first)
- Each event shows: name, date, time (if available), location
- Click navigates to event detail
- Hide past events or show in separate section
- "View All Events" link if more than displayed limit

**Acceptance Criteria:**
- [ ] Events sorted chronologically (ascending)
- [ ] Each event card shows name, date, and location
- [ ] Time displayed if available
- [ ] Click navigates to event detail
- [ ] Past events hidden by default
- [ ] Empty state: "No upcoming events" message

#### 1.3 Quick Access Section (Future)
**Priority:** Low  
**User Story:** As a user, I want quick access to recently viewed content.

**Requirements:**
- Show recently viewed songs/playlists (stored in session)
- Only show if user has visited other pages in session

---

### 2. Events List Page

#### 2.1 Event Cards
**Priority:** High  
**User Story:** As a user, I want to browse all upcoming events in one place.

**Requirements:**
- Grid or list layout (responsive)
- Each card shows:
  - Event name (bold, prominent)
  - Date (formatted: "Monday, January 15, 2026")
  - Time (if available)
  - Location
  - Brief description (1-2 lines)
- Visual distinction between upcoming and past events
- Click navigates to event detail

**Acceptance Criteria:**
- [ ] Events sorted by date (ascending)
- [ ] Cards show all required information
- [ ] Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop
- [ ] Past events in separate section or hidden
- [ ] Empty state: "No events scheduled"

#### 2.2 Filtering (Future)
**Priority:** Low  
**Requirements:**
- Filter by date range
- Filter by location
- Search by event name

---

### 3. Event Detail Page

#### 3.1 Event Information
**Priority:** High  
**User Story:** As a user, I want to see complete event details including location and time.

**Requirements:**
- Event name (page title, H1)
- Date (prominent display)
- Time (if available)
- Location name
- Full description
- Back navigation to home or events list

**Acceptance Criteria:**
- [ ] All event details displayed clearly
- [ ] Date formatted for readability
- [ ] Time shown in local format
- [ ] Back link present and functional

#### 3.2 Location Map
**Priority:** Medium  
**User Story:** As a user, I want to see where the event is located.

**Requirements:**
- Display Google Map if coordinates available
- Show address below map
- Click address to open in external maps app
- Fallback: Show address text only if no coordinates

**Acceptance Criteria:**
- [ ] Map displays if coordinates exist
- [ ] Map is interactive (zoom, pan)
- [ ] Address shown below map
- [ ] Mobile: Map height 200px, desktop: 300px
- [ ] Graceful fallback without coordinates

#### 3.3 Associated Playlists
**Priority:** High  
**User Story:** As a choir member, I want to see which playlists are part of this event.

**Requirements:**
- List all visible playlists for the event
- Each playlist shows: name, description (if exists), song count
- Click navigates to playlist detail
- Empty state if no playlists

**Acceptance Criteria:**
- [ ] All visible playlists displayed
- [ ] Playlists sorted by position (if set)
- [ ] Each playlist card is tappable
- [ ] Shows song count
- [ ] Empty state: "No playlists available for this event"

---

### 4. Playlist Detail Page

#### 4.1 Playlist Information
**Priority:** High  
**User Story:** As a user, I want to see which songs are in this playlist.

**Requirements:**
- Playlist name (page title, H1)
- Description (if exists)
- Total song count
- Back navigation to event or home

**Acceptance Criteria:**
- [ ] Playlist name and description displayed
- [ ] Song count shown
- [ ] Back navigation present

#### 4.2 Song List
**Priority:** High  
**User Story:** As a choir member, I want to see all songs in order and navigate to lyrics.

**Requirements:**
- Numbered list (1, 2, 3...)
- Each song shows: title, artist (if exists)
- Click navigates to song lyrics
- Visual separation between songs
- Empty state if no songs

**Acceptance Criteria:**
- [ ] Songs numbered sequentially
- [ ] Each song row is tappable (min 44px height)
- [ ] Title and artist displayed
- [ ] Clear visual hierarchy
- [ ] Empty state: "No songs in this playlist"

---

### 5. Song Detail Page

#### 5.1 Song Information
**Priority:** High  
**User Story:** As a user, I want to see the song title and artist clearly.

**Requirements:**
- Song title (page title, H1)
- Artist/composer (if exists)
- Breadcrumb navigation (Event > Playlist > Song)

**Acceptance Criteria:**
- [ ] Title prominent and readable
- [ ] Artist shown if available
- [ ] Breadcrumbs present and functional

#### 5.2 Font Size Control
**Priority:** High  
**User Story:** As a choir member, I want to adjust text size so I can read lyrics from a distance.

**Requirements:**
- Slider control (range input)
- Range: 14px to 24px
- Default: 18px
- Display current size
- Persist in sessionStorage
- Apply immediately to lyrics

**Acceptance Criteria:**
- [ ] Slider visible and functional
- [ ] Range 14px - 24px
- [ ] Current size displayed
- [ ] Changes apply immediately
- [ ] Preference persists across page navigation
- [ ] Mobile: Slider easy to operate with thumb

#### 5.3 Lyrics Display
**Priority:** High  
**User Story:** As a choir member, I want to read lyrics clearly with proper formatting.

**Requirements:**
- Preserve line breaks from source
- Double line breaks create paragraph separation
- Apply user-selected font size
- High contrast text
- Adequate line height (1.6)
- Padding for readability
- Scrollable if content overflows

**Acceptance Criteria:**
- [ ] Line breaks preserved exactly
- [ ] Paragraphs visually separated
- [ ] Font size applies correctly
- [ ] Text readable in both light and dark mode
- [ ] No horizontal scrolling
- [ ] Smooth vertical scrolling

---

### 6. Navigation Components

#### 6.1 Header
**Priority:** High  
**Requirements:**
- Logo or app name (links to home)
- Consistent across all pages
- Sticky on scroll (optional)
- Mobile: Hamburger menu or simplified

**Acceptance Criteria:**
- [ ] Header present on all pages
- [ ] Logo/name links to `/`
- [ ] Mobile-friendly height (56-64px)

#### 6.2 Breadcrumbs
**Priority:** Medium  
**Requirements:**
- Show path: Home > Event > Playlist > Song
- Each segment is clickable
- Current page not clickable
- Truncate long names

**Acceptance Criteria:**
- [ ] Breadcrumbs on event, playlist, and song pages
- [ ] Each segment navigates correctly
- [ ] Visual separator between segments
- [ ] Mobile: May collapse or simplify

#### 6.3 Footer (Optional)
**Priority:** Low  
**Requirements:**
- Copyright info
- Links to choir website (if exists)
- Minimal design

---

### 7. Error Handling

#### 7.1 404 Not Found
**Priority:** High  
**Requirements:**
- Friendly message (not technical)
- Suggested actions: Go home, Browse events
- Maintain app styling

**Acceptance Criteria:**
- [ ] Friendly error message
- [ ] Navigation options provided
- [ ] Consistent styling with rest of app

#### 7.2 Generic Error Page
**Priority:** Medium  
**Requirements:**
- Friendly error message
- Retry option if applicable
- Navigation to home

---

## User Flows

### Flow 1: First-Time User at Performance

**Scenario:** Guest attends choir performance, wants to follow lyrics

1. User scans QR code or visits URL
2. Arrives at Home page
3. Sees Current Event banner
4. Clicks banner → Event page
5. Sees playlists for the event
6. Clicks main playlist → Playlist page
7. Sees song list
8. Clicks first song → Song page
9. Adjusts font size if needed
10. Follows lyrics during performance
11. Uses breadcrumbs to navigate between songs

**Key Interactions:**
- Current event banner prominent
- One-tap access to playlists
- Clear song navigation
- Easy font size adjustment

### Flow 2: Choir Member Practicing at Home

**Scenario:** Choir member wants to practice songs from upcoming event

1. User visits Home page
2. Sees upcoming events list
3. Clicks next rehearsal event → Event page
4. Reviews playlist → Playlist page
5. Selects song to practice → Song page
6. Adjusts font size for comfort
7. Practices lyrics
8. Returns to playlist to select another song

**Key Interactions:**
- Events list easily accessible
- Playlist navigation clear
- Font size persists during session
- Quick back-and-forth between songs

### Flow 3: Finding a Specific Song

**Scenario:** User knows the song title but not which playlist it's in

1. User visits Home page
2. Clicks "All Events" → Events list
3. Checks recent events
4. Clicks event → Event page
5. Checks playlists
6. Finds playlist with song
7. Clicks song → Song page

**Alternative (Future with Search):**
1. User uses search on home page
2. Types song title
3. Selects from results
4. Goes directly to song page

---

## UI/UX Design Guidelines

### Design Principles

1. **Mobile-First:** Design for smartphone use on stage
2. **Simplicity:** Minimal UI elements, clear hierarchy
3. **Readability:** High contrast, adjustable text size
4. **Accessibility:** WCAG 2.1 AA compliance
5. **Performance:** Fast loading, works offline after initial load

### Color Scheme

#### Light Mode
- Background: `bg-zinc-50` (zinc-50)
- Card Background: `bg-white`
- Text Primary: `text-zinc-900`
- Text Secondary: `text-zinc-600`
- Accent: `text-blue-600` or `text-indigo-600`
- Borders: `border-zinc-200`

#### Dark Mode
- Background: `dark:bg-black` or `dark:bg-zinc-950`
- Card Background: `dark:bg-zinc-900`
- Text Primary: `dark:text-zinc-50`
- Text Secondary: `dark:text-zinc-400`
- Accent: `dark:text-blue-400`
- Borders: `dark:border-zinc-800`

### Typography

- **Font Family:** System default (sans-serif)
- **Base Size:** 16px (browser default)
- **Headings:** 
  - H1: `text-2xl sm:text-3xl font-bold`
  - H2: `text-xl sm:text-2xl font-semibold`
  - H3: `text-lg font-medium`
- **Body:** `text-base` or `text-sm`
- **Lyrics:** User-adjustable (14px - 24px)

### Spacing

- **Page Padding:** `p-4 sm:p-6 lg:p-8`
- **Card Padding:** `p-4` or `p-6`
- **Section Spacing:** `mb-6` or `mb-8`
- **Element Spacing:** `gap-4` or `gap-6`

### Touch Targets

- **Minimum Size:** 44x44px
- **Button Height:** 40-48px
- **List Items:** Min 44px height
- **Spacing Between:** Min 8px

### Responsive Breakpoints

- **Mobile:** Default (< 640px)
- **Tablet:** `sm:` (640px+)
- **Desktop:** `lg:` (1024px+)

### Components

#### Buttons
- Primary: Solid background, white text
- Secondary: Outlined or ghost style
- Touch target: Min 44px height

#### Cards
- Background: White (light) / zinc-900 (dark)
- Border Radius: `rounded-lg`
- Shadow: `shadow-sm` or `shadow-md`
- Padding: `p-4` or `p-6`

#### Lists
- Dividers: `divide-y divide-zinc-200`
- Item Padding: `py-3` or `py-4`
- Hover State: `hover:bg-zinc-50`

---

## Technical Requirements

### Architecture

- **Framework:** Next.js 16 (App Router)
- **Route Group:** `(public)`
- **Components:** Server components for data fetching, client components for interactivity
- **Styling:** Tailwind CSS 4
- **UI Library:** shadcn/ui components

### Data Fetching

- Use Server Components for initial data fetch
- Cache data appropriately (ISR or SSR)
- Handle loading states gracefully
- Error boundaries for error handling

### State Management

- **Font Size:** sessionStorage
- **Dark Mode:** CSS variables + system preference
- **Navigation State:** URL-based

### Performance Targets

- **Time to First Byte (TTFB):** < 200ms
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Lyrics Load Time:** < 2 seconds
- **Bundle Size:** Minimal JavaScript for public pages

### Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators visible

### SEO

- Meta titles and descriptions for each page
- Open Graph tags for social sharing
- Structured data (JSON-LD) for events
- Sitemap generation

---

## MVP Scope

### Must Have (MVP)

1. **Home Page**
   - Current event banner
   - Upcoming events list (5-10 events)
   - Navigation to events

2. **Events List Page**
   - All upcoming events
   - Chronological sorting
   - Event cards with key info

3. **Event Detail Page**
   - Event information
   - Location map (if coordinates)
   - Associated playlists
   - Back navigation

4. **Playlist Detail Page**
   - Playlist info
   - Numbered song list
   - Navigation to songs

5. **Song Detail Page**
   - Song info
   - Font size control
   - Lyrics display
   - Breadcrumb navigation

6. **Navigation**
   - Header with home link
   - Breadcrumbs on detail pages
   - Consistent layout

7. **Error Handling**
   - 404 page
   - Friendly error messages

### Nice to Have (Post-MVP)

1. Search functionality
2. Past events archive
3. Recently viewed section
4. Share buttons (social media)
5. QR code generation
6. Offline mode/PWA
7. User accounts (favorites)
8. Print-friendly lyrics view

---

## Future Roadmap

### Phase 2: Enhanced Discovery
- Search functionality
- Filter events by date/location
- Recently viewed songs
- "Favorite" songs (local storage)

### Phase 3: Social Features
- Share events to social media
- QR code generation for events/playlists/songs
- Email event details
- Calendar integration (add to calendar)

### Phase 4: AI Assistant
- Natural language search
- "Find songs by lyrics" feature
- Smart recommendations
- Voice navigation (accessibility)

### Phase 5: Advanced Features
- Offline mode/PWA
- Push notifications for event updates
- User accounts and personalization
- Multi-language support

---

## Acceptance Criteria Summary

### Global
- [ ] Mobile-first responsive design
- [ ] Dark mode support
- [ ] WCAG 2.1 AA accessibility
- [ ] Touch targets min 44px
- [ ] Performance: < 2s load time
- [ ] Error handling with friendly messages

### Home Page
- [ ] Current event banner (if exists)
- [ ] Upcoming events list
- [ ] Navigation to all events

### Events
- [ ] List all upcoming events
- [ ] Sort by date
- [ ] Show date, time, location
- [ ] Navigate to event detail

### Event Detail
- [ ] Show all event info
- [ ] Display map if coordinates
- [ ] List playlists
- [ ] Navigate to playlists

### Playlist
- [ ] Show playlist info
- [ ] Numbered song list
- [ ] Navigate to songs

### Song
- [ ] Show title and artist
- [ ] Font size slider (14-24px)
- [ ] Persist font size
- [ ] Display lyrics with formatting
- [ ] Breadcrumb navigation

---

## Appendix

### A. Database Schema (Public-Facing)

**Events Table:**
- id, name, event_date, event_time, place, description, is_visible, is_current, latitude, longitude

**Playlists Table:**
- id, name, description, status (visible/hidden), is_archived

**Songs Table:**
- id, title, artist_composer, lyrics, is_visible, is_archived

**Event_Playlists Table:**
- event_id, playlist_id, position

**Playlist_Songs Table:**
- playlist_id, song_id, position

### B. API Endpoints (Public)

- `GET /api/events` - List visible events
- `GET /api/events/[id]` - Get event details
- `GET /api/playlists/[id]` - Get playlist with songs
- `GET /api/songs/[id]` - Get song with lyrics

### C. Third-Party Integrations

- **Google Maps:** For event location display
- **Supabase:** Database and authentication (admin only)

---

**Document Owner:** Development Team  
**Reviewers:** Product Owner, UX Designer, Tech Lead  
**Last Updated:** February 2026
