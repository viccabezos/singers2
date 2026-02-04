## Context

### Current State
The home page (`app/(public)/page.tsx`) currently displays the default Next.js template with placeholder content. This needs to be replaced with a functional home page that serves as the entry point for choir members and guests.

### User Needs
- **Choir Members:** Need quick access to the current event and its playlists
- **Guests:** Want to discover upcoming performances
- **Both:** Need simple, clear navigation on mobile devices

### Technical Context
- Next.js App Router with `(public)` route group
- Supabase database for events
- Tailwind CSS for styling
- Dark mode already supported in existing pages

## Goals / Non-Goals

### Goals
- Create functional home page with current event banner
- Display upcoming events list
- Implement proper navigation
- Ensure mobile-first responsive design
- Maintain dark mode support

### Non-Goals
- Search functionality (future scope)
- Past events archive (future scope)
- User authentication (not needed for public)
- Event filtering (future scope)

## Technical Decisions

### Data Fetching Strategy
- Use Server Components for data fetching
- Fetch current event and upcoming events in parallel
- Cache data appropriately

### Component Architecture
- Create reusable `EventCard` component for consistency
- Use existing UI components from shadcn/ui
- Follow Feature-Sliced Design patterns

### Responsive Design
- Mobile-first approach (default styles for mobile)
- Breakpoints: sm (640px), lg (1024px)
- Single column on mobile, grid on larger screens

## Risks / Trade-offs

### Risk: Performance with many events
- **Mitigation:** Limit upcoming events to 5-10, implement pagination later

### Risk: No current event set
- **Mitigation:** Gracefully handle empty state, show upcoming events only

### Risk: Mobile usability
- **Mitigation:** Large touch targets, clear typography, tested on actual devices

## Open Questions

1. Should we show past events in a separate section on the home page?
2. How many upcoming events should we display (5, 10, or configurable)?
3. Should the current event banner auto-redirect to the event page?
