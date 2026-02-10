# Change: Improve Events Management and Auto-Archiving

## Why

The current events management system has several usability issues and missing automation features that make it difficult to maintain a clean, organized event list:

1. **Admin Display Issues**: The admin events page doesn't show events in a practical order for managing ongoing/past events. Currently it shows all events or requires filtering, but admins need to see today's events and recent past events by default to manage them effectively.

2. **Current Event Confusion**: The "current event" feature (is_current flag) is not intuitive to use. There's confusion between "current" (the event happening now) and "featured" (the event to highlight). The UI doesn't make it clear what setting an event as "current" actually does.

3. **Missing Auto-Archiving**: Past events accumulate in the active list indefinitely. There's no automatic cleanup of old events, requiring manual archiving which is tedious and error-prone.

4. **No Grace Period Handling**: While the spec mentions a 14-day grace period for public visibility, there's no automatic enforcement or clear admin-side indication of which events are approaching auto-hide.

These issues make event management time-consuming and lead to a cluttered admin interface with outdated events.

## What Changes

### 1. Improved Admin Event Display
- **Default View**: Show events from today backwards (today's date + past events) sorted by date descending (newest first)
- **Better Filtering**: Add "Recent" filter (last 30 days), "This Month", "Last Month" options
- **Visual Indicators**: Show days remaining before auto-archive, grace period status
- **Default Sort**: Change from ascending to descending (newest events first)

### 2. Clarify Current Event Feature
- **Rename to "Featured Event"**: Change terminology from "current" to "featured" to better reflect its purpose
- **Visual Improvements**: Better highlighting of featured event in the list
- **Quick Actions**: One-click set/unset featured from the events list
- **Clear Indication**: Show "Featured Event" badge prominently

### 3. Auto-Archive Past Events
- **Automatic Archiving**: Events older than 14 days are automatically archived
- **Unfeatured on Archive**: When auto-archived, events are also un-featured
- **Admin Notification**: Show which events were recently auto-archived
- **Manual Override**: Allow admins to prevent auto-archive for specific events

### 4. Enhanced Event Management UI
- **Bulk Actions**: Archive multiple events at once
- **Date Range Archiving**: Archive all events before a certain date
- **Archive Preview**: Show what will be archived before confirming
- **Grace Period Indicator**: Visual indicator of how many days until auto-archive

### 5. Additional Improvements
- **Event Status Badges**: Show "Today", "Tomorrow", "This Week", "Past" badges
- **Quick Filters**: One-click filters for "Today's Event", "This Week", "Needs Attention"
- **Archive Management**: Better archive view with restore functionality

## Impact

### Affected Specs
- **events**: Major updates to requirements
- **back-office**: Admin UI improvements
- **public-website**: Auto-hide behavior enforcement

### Affected Code
- `/app/(admin)/admin/events/page.tsx` - Updated default filters and sorting
- `/app/(admin)/admin/events/events-list-client.tsx` - Enhanced UI with badges and actions
- `/shared/lib/events.ts` - Auto-archive logic and new filtering
- `/app/(admin)/admin/events/[id]/actions.ts` - Bulk actions and auto-archive
- Database schema (potentially): Add `auto_archive_exempt` flag

### Database Changes
- May add `auto_archive_exempt` boolean column to events table (default false)
- Update existing `is_current` references to `is_featured` if renaming

### User Impact
- **Admins**: Much easier event management with automatic cleanup
- **Public Users**: No change - existing auto-hide behavior remains
- **No Breaking Changes**: All changes are additive or improve existing functionality

## Clarifying Questions

Before implementation, please clarify:

1. **Auto-archive timing**: Should it be exactly 14 days after the event date, or 14 days including the event date?

2. **Featured vs Current**: Should we rename "current event" to "featured event", or keep both concepts separate?

3. **Admin default view**: Should the default admin view show "today + past" or "all recent" (last 30 days)?

4. **Auto-archive notification**: How should admins be notified? Toast message, banner, or just visible in the archive view?

5. **Manual archive prevention**: Do you need a way to prevent specific events from auto-archiving (e.g., for special recurring events)?
