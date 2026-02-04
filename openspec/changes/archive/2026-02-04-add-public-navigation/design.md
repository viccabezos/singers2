## Context

### Current State
The public app currently has inconsistent navigation:
- Home page has its own header
- Events page has a "Back to Home" link
- Event, Playlist, and Song pages have ad-hoc navigation
- No shared header component
- No breadcrumb navigation

### User Impact
- Users don't have consistent way to navigate
- Hard to understand current location in hierarchy
- No easy way to go back up the hierarchy

### Technical Context
- Next.js App Router with (public) route group
- Each page currently handles its own navigation
- Need shared components for consistency

## Goals / Non-Goals

### Goals
- Create shared Header component
- Add breadcrumbs for hierarchy navigation
- Ensure consistency across all pages
- Mobile-friendly navigation

### Non-Goals
- Complex navigation menus
- User authentication in header
- Search functionality in header

## Technical Decisions

### Header Strategy
- Simple header with logo/app name
- Links to home
- Consistent across all pages
- Added via layout.tsx

### Breadcrumb Strategy
- Show hierarchy: Home > Event > Playlist > Song
- Each segment clickable except current
- Context-aware (knows parent relationships)

## Risks / Trade-offs

### Risk: Breadcrumbs need context
- **Mitigation:** Pass parent info through components or fetch it

### Risk: Header takes up space on mobile
- **Mitigation:** Keep it minimal, single row
