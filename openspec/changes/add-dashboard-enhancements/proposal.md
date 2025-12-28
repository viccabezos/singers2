# Change: Dashboard Enhancements

## Why

The admin dashboard currently shows navigation cards and an event calendar, but lacks useful at-a-glance information like content counts and current event status. Adding stats widgets would make the dashboard more informative and actionable.

## What Changes

- Add stats widgets showing counts (songs, playlists, events)
- Display current event info prominently
- Test and verify dark mode across all admin pages

## Impact

- Affected specs: back-office
- Affected code:
  - `app/(admin)/admin/dashboard/page.tsx`
  - Potentially new shared widget components

