## Context

### Current State
There is no dedicated page to list all events. The home page shows only 5-10 upcoming events, but users may want to see more or browse further into the future.

### User Needs
- **Choir Members:** Want to see all upcoming performances to plan attendance
- **Guests:** Want to discover all available choir events
- **Both:** Need easy browsing on mobile devices

### Technical Context
- Events already have visibility control in admin
- Event data includes: name, date, time, location, description
- Existing event detail pages work well

## Goals / Non-Goals

### Goals
- Create comprehensive events list page
- Support browsing all upcoming events
- Maintain consistency with home page design
- Ensure excellent mobile experience

### Non-Goals
- Past events archive (future scope)
- Event filtering/search (future scope)
- Calendar view (future scope)
- Event categories/tags (future scope)

## Technical Decisions

### Layout Strategy
- Use CSS Grid for responsive layout
- Grid columns: 1 (mobile), 2 (tablet), 3 (desktop)
- Consistent gap spacing
- Reuse EventCard component

### Data Strategy
- Fetch all upcoming visible events
- Sort by event_date ascending
- No pagination for MVP (assume < 50 events)

### Performance
- Server-side rendering for SEO
- Static generation with revalidation (optional)
- Image optimization for event images (future)

## Risks / Trade-offs

### Risk: Too many events on one page
- **Mitigation:** For MVP, assume reasonable number; add pagination later if needed

### Risk: Slow loading with many events
- **Mitigation:** Server-side rendering, efficient queries

### Risk: Confusion between home page and events page
- **Mitigation:** Clear labeling, home shows featured + recent, events shows all
