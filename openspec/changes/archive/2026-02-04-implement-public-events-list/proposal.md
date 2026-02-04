# Change: Implement Public Events List Page

## Why
Users need a way to browse all upcoming choir events, not just the few shown on the home page. The events list page provides a comprehensive view of all scheduled performances, allowing choir members and guests to plan their attendance. This page is linked from the home page "View All Events" button.

## What Changes
- Create `/events` route and page
- Display all upcoming visible events in a responsive grid
- Each event shows: name, date, time, location, brief description
- Implement responsive layout (1 col mobile, 2 col tablet, 3 col desktop)
- Add chronological sorting (nearest date first)
- Reuse EventCard component from home page
- Add empty state for when no events exist
- Support dark mode

## Impact
- **Files Created:**
  - `app/(public)/events/page.tsx` - Events list page
- **Files Modified:**
  - May reuse `widgets/event-card/` from home page change
- **Affected Specs:** public-website, events
- **Dependencies:** Change 1 (Home Page) - for shared EventCard component

## Acceptance Criteria
- [ ] Events list page accessible at `/events`
- [ ] All upcoming visible events displayed
- [ ] Events sorted chronologically (nearest first)
- [ ] Each event shows name, date, time (if available), location
- [ ] Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Clicking event navigates to event detail page
- [ ] Empty state shown when no events exist
- [ ] Mobile-first responsive design
- [ ] Dark mode support
