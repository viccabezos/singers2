# Change: Improve Public Website UX

## Why

After a comprehensive UX audit of the public website, I've identified several **systemic** UX issues that affect usability. The target users (choir members, often retired and not tech-savvy) require simple, clear interfaces. The current implementation has gaps that undermine the user experience, particularly where real-time event access is critical for on-stage use.

## What Changes

### 1. **Public Website Homepage Not Functional** (Critical)
- The public homepage (`app/(public)/page.tsx`) still shows the default Next.js template
- Users have no way to discover events, playlists, or songs from the homepage
- **Solution**: Build a functional homepage that displays the current/upcoming event with quick access to playlists and songs

### 2. **No Navigation on Public Website** (Critical)
- Public pages lack a consistent header/navigation
- Users cannot easily return to the homepage or navigate between sections
- The playlist and song pages lack breadcrumb navigation back to the parent event
- **Solution**: Add a consistent public header with home link and contextual breadcrumbs

### 3. **Missing Dark Mode Toggle** (High)
- Dark mode is mentioned in specs as a requirement for the public website
- No visible toggle exists for users to switch between light/dark mode
- **Solution**: Add a dark mode toggle to the public header

### 4. **No Back Navigation on Lyrics Page** (High)
- When viewing song lyrics, users have no way to return to the playlist
- The lyrics page is a dead end requiring browser back button
- **Solution**: Add contextual back navigation to playlist/event

### 5. **Inconsistent Public Page Headers** (Medium)
- Event page has a header with back link, but playlist and song pages don't
- This creates confusion about navigation patterns
- **Solution**: Standardize public page layout with consistent header component

### 6. **No Loading States on Public Pages** (Medium)
- Public pages show blank content while loading, which can feel broken
- Critical for choir members using phones on stage during events
- **Solution**: Add skeleton loading states for public content

### 7. **Font Size Slider Lacks Accessibility** (Low)
- The range slider for lyrics font size lacks proper ARIA labels
- Slider thumb is small and hard to tap on mobile
- **Solution**: Improve slider accessibility with larger touch targets and proper labels

## Impact

- Affected specs: public-website, ui-library
- Affected code:
  - `app/(public)/page.tsx` - Complete rebuild
  - `app/(public)/layout.tsx` - Add public header
  - `app/(public)/playlist/[id]/playlist-display.tsx` - Add navigation
  - `app/(public)/song/[id]/lyrics-display.tsx` - Add navigation and accessibility
  - New: `shared/ui/public-header.tsx` - Shared public header component
  - New: `shared/ui/theme-toggle.tsx` - Dark mode toggle

## Out of Scope

- Admin panel improvements (separate proposal: `improve-admin-navigation`)
- Performance optimizations
- New features (QR codes, social sharing, etc.)
