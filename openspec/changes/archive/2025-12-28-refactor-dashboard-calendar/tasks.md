## 1. Setup

- [x] 1.1 Install shadcn Calendar component (`bunx shadcn@latest add calendar`)
- [x] 1.2 Verify react-day-picker and date-fns are added as dependencies

## 2. Implementation

- [x] 2.1 Update `widgets/event-calendar/ui/event-calendar.tsx` to use shadcn Calendar
- [x] 2.2 Implement custom day cell rendering with color-coded backgrounds (today=primary, upcoming=blue, past=grey)
- [x] 2.3 Add click handler: day with event → event detail, day without event → new event form
- [x] 2.4 Configure French locale using date-fns locale
- [x] 2.5 Add monthly event list sidebar with sorted events (today first, then upcoming, then past)
- [x] 2.6 Add hover chevron icon on event list items
- [x] 2.7 Update dashboard to fetch all non-archived events (not just upcoming)

## 3. Cleanup

- [x] 3.1 Remove `@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`, `@fullcalendar/timegrid` from package.json
- [x] 3.2 Run `bun install` to update lockfile

## 4. Verification

- [x] 4.1 Test calendar displays correctly on mobile (mobile-first)
- [x] 4.2 Test today is always highlighted with primary color
- [x] 4.3 Test past/upcoming events show correct colors
- [x] 4.4 Test clicking event day navigates to event detail
- [x] 4.5 Test clicking empty day navigates to new event form with date pre-filled
- [x] 4.6 Test month navigation works correctly
- [x] 4.7 Verify French locale displays correctly (month names, day names)
- [x] 4.8 Test event list shows today's events first
