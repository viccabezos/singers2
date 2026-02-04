## 1. Data Layer
- [x] 1.1 Add `getCurrentEvent()` function to fetch event marked as current
- [x] 1.2 Add `getUpcomingEvents(limit: number)` function to fetch upcoming events
- [x] 1.3 Ensure functions filter for visible events only
- [x] 1.4 Add proper error handling for database queries

## 2. Components
- [x] 2.1 Create `EventCard` component with props: event data
- [x] 2.2 Style EventCard for mobile-first (single column)
- [x] 2.3 Add hover states and click handling
- [x] 2.4 Ensure EventCard works in both light and dark mode
- [x] 2.5 Create `CurrentEventBanner` component
- [x] 2.6 Style banner to be prominent and clickable

## 3. Page Implementation
- [x] 3.1 Rewrite `app/(public)/page.tsx` with new home page
- [x] 3.2 Implement server-side data fetching
- [x] 3.3 Add current event banner section
- [x] 3.4 Add upcoming events list section
- [x] 3.5 Add "View All Events" link
- [x] 3.6 Implement empty states
- [x] 3.7 Add responsive grid layout for events

## 4. Styling
- [x] 4.1 Apply mobile-first responsive styles
- [x] 4.2 Ensure 44px minimum touch targets
- [x] 4.3 Add dark mode color classes
- [x] 4.4 Test visual hierarchy and spacing
- [x] 4.5 Ensure consistent typography

## 5. Testing
- [x] 5.1 Test with current event set
- [x] 5.2 Test without current event
- [x] 5.3 Test with no upcoming events
- [x] 5.4 Test on mobile viewport
- [x] 5.5 Test on tablet viewport
- [x] 5.6 Test on desktop viewport
- [x] 5.7 Test dark mode
- [x] 5.8 Test navigation links

## 6. Validation
- [x] 6.1 Run `npm run lint` - no errors (pre-existing warnings only)
- [x] 6.2 Run `npm run build` - builds successfully
- [x] 6.3 Verify all acceptance criteria met
- [x] 6.4 Test accessibility (keyboard navigation)
