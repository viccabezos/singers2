# Change: Implement Public Home Page

## Why
The public application currently shows a default Next.js template on the home page (`/`). According to the PRD, the home page is the primary entry point for users and needs to display:
1. A prominent current event banner (if an event is marked as "current")
2. A list of upcoming events
3. Navigation to the full events list

This is critical for choir members and guests who need quick access to event information and lyrics during performances.

## What Changes
- Replace the default Next.js template in `app/(public)/page.tsx`
- Create a home page that displays:
  - Current event banner (prominent, clickable)
  - Upcoming events list (5-10 events, sorted by date)
  - "View All Events" link
  - Proper empty states
- Implement responsive design (mobile-first)
- Add dark mode support
- Create reusable EventCard component

## Impact
- **Files Modified:**
  - `app/(public)/page.tsx` - Complete rewrite
  - `app/(public)/layout.tsx` - May need updates for consistent structure
- **Files Created:**
  - `widgets/event-card/` - Reusable event card component
  - `shared/lib/events.ts` - New function `getCurrentEvent()` and `getUpcomingEvents(limit)`
- **Affected Specs:** public-website
- **Dependencies:** None (can be implemented independently)

## Acceptance Criteria
- [ ] Home page displays current event banner when a current event exists
- [ ] Home page displays upcoming events list (sorted chronologically)
- [ ] Events show name, date, time (if available), and location
- [ ] Clicking event navigates to event detail page
- [ ] "View All Events" link navigates to /events
- [ ] Empty state shown when no events exist
- [ ] Mobile-first responsive design
- [ ] Dark mode support
- [ ] Touch targets minimum 44px
