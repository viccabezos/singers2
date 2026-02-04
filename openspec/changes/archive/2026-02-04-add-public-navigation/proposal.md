# Change: Add Public Navigation Components

## Why
The public app currently lacks consistent navigation across pages. Each page has its own ad-hoc navigation (e.g., "Back to home" links), but there's no shared header or breadcrumb system. This makes it hard for users to understand where they are and navigate efficiently, especially when deep in the hierarchy (Event > Playlist > Song).

## What Changes
- Create shared Header component with logo/app name
- Add Header to all public pages via layout
- Create Breadcrumb component for navigation hierarchy
- Add breadcrumbs to Event, Playlist, and Song pages
- Update existing pages to use shared navigation
- Ensure consistent styling across all pages
- Support dark mode

## Impact
- **Files Created:**
  - `widgets/public-header/` - Shared header component
  - `widgets/public-breadcrumbs/` - Breadcrumb navigation component
- **Files Modified:**
  - `app/(public)/layout.tsx` - Add header
  - `app/(public)/page.tsx` - May need adjustments
  - `app/(public)/events/page.tsx` - Add breadcrumbs
  - `app/(public)/event/[id]/event-display.tsx` - Add breadcrumbs
  - `app/(public)/playlist/[id]/playlist-display.tsx` - Add breadcrumbs
  - `app/(public)/song/[id]/lyrics-display.tsx` - Add breadcrumbs
- **Affected Specs:** public-website
- **Dependencies:** 
  - Change 1 (Home Page) - for home link
  - Change 2 (Events List) - for events link in breadcrumbs

## Acceptance Criteria
- [ ] Header appears on all public pages
- [ ] Header includes logo/app name linking to home
- [ ] Header is consistent across all pages
- [ ] Breadcrumbs show on Event, Playlist, and Song pages
- [ ] Breadcrumbs show correct hierarchy (Home > Event > Playlist > Song)
- [ ] Each breadcrumb segment is clickable
- [ ] Current page shown in breadcrumbs but not clickable
- [ ] Mobile-friendly header (hamburger menu or simplified)
- [ ] Dark mode support
