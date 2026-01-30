# Change: Dashboard Enhancements

## Why

The admin dashboard currently shows navigation cards and an event calendar, but lacks useful at-a-glance information like content counts, recent activity, and draft alerts. Adding these would make the dashboard more informative and actionable.

## What Changes

- Add total counts to existing navigation cards (songs, playlists, events)
- Add a "Recently Updated" tabbed widget showing recent changes per content type
- Add draft/unpublished alert when items need attention (hidden songs, draft playlists, hidden events)

## Impact

- Affected specs: back-office
- Affected code:
  - `app/(admin)/admin/dashboard/page.tsx`
  - New widget: `widgets/recent-activity/` (tabbed recent updates)
  - New widget: `widgets/draft-alert/` (unpublished items alert)
