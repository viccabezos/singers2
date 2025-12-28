# Change: Add Quick Actions to Desktop Sidebar

## Why
The mobile navigation drawer already includes quick action buttons for creating new content (Song, Playlist, Event) at the top for easy access. Desktop users currently lack this convenience feature, requiring them to navigate to individual pages first before creating new items. Adding quick actions to the desktop sidebar will improve productivity and provide consistent UX across all device sizes.

## What Changes
- Add a "Quick Actions" section to the desktop sidebar footer, positioned above the logout button
- Include three quick action buttons:
  - New Song → `/admin/songs/new`
  - New Playlist → `/admin/playlists/new`
  - New Event → `/admin/events/new`
- Style the quick actions to integrate seamlessly with the existing sidebar design
- Ensure quick actions are visible in both expanded and collapsed sidebar states (using tooltips when collapsed)

## Impact
- Affected specs: New capability `admin-navigation` (admin sidebar component)
- Affected code: `widgets/admin-nav/ui/admin-nav.tsx` (desktop sidebar footer section)
- Affected users: Admin users on desktop/tablet devices
