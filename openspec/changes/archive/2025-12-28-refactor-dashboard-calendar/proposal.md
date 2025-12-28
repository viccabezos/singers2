# Change: Replace FullCalendar with shadcn Calendar

## Why

The dashboard calendar currently uses FullCalendar (`@fullcalendar/react`), a heavy library (~100KB+) designed for complex scheduling applications. For our use case of displaying single-day choir events on a month grid, this is over-engineered. Replacing it with shadcn Calendar provides visual consistency with the rest of the UI, a smaller bundle size (~4KB), and better mobile UX.

## What Changes

- Install shadcn Calendar component (based on `react-day-picker`)
- Replace `EventCalendar` widget implementation to use shadcn Calendar
- Add custom day cell rendering with color-coded backgrounds:
  - Today: Primary color (always highlighted)
  - Upcoming events: Blue background
  - Past events: Grey/muted background
- Add event list sidebar showing all events for the selected month
- Configure French locale support
- Click on day with event → navigate to event detail
- Click on day without event → navigate to new event form with pre-filled date
- Remove `@fullcalendar/*` dependencies from package.json

## Impact

- Affected specs: back-office
- Affected code:
  - `widgets/event-calendar/ui/event-calendar.tsx`
  - `widgets/event-calendar/index.ts`
  - `app/(admin)/admin/dashboard/page.tsx`
  - `package.json` (remove fullcalendar deps, add react-day-picker)
  - `components/ui/calendar.tsx` (new shadcn component)
