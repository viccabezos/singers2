## 1. Analysis and Clarification

- [x] 1.1 Review current events implementation in detail
  - Examine getEvents() function and filtering logic
  - Review admin events list UI
  - Check current event handling
- [x] 1.2 Get answers to clarifying questions
  - Auto-archive timing: Events > 14 days old are auto-archived
  - Featured vs Current: Keep "is_current" field, update UI text only
  - Default admin view: All non-archived events, sorted newest first
  - Notification: Toast notification on page load
  - Manual archive prevention: auto_archive_exempt column added

## 2. Database Schema Updates

- [x] 2.1 Add auto_archive_exempt column
  - Migration: Add boolean column to events table
  - Default: false
  - Update TypeScript types
- [x] 2.2 Consider renaming is_current to is_featured
  - Decision: Keep is_current field name for backward compatibility
  - UI text updated to use "Featured" terminology
  - TypeScript types updated

## 3. Admin Events Display Improvements

- [x] 3.1 Update default event sorting
  - [x] Change from ascending to descending (newest first)
  - [x] Default filter: Show all non-archived events
- [x] 3.2 Add new filter options
  - [x] "Recent" filter (last 30 days)
  - [x] "This Month" filter
  - [x] "Last Month" filter
  - [x] "Today" status badge on events
- [x] 3.3 Add event status badges
  - [x] "Today" badge for events happening today (green)
  - [x] "Tomorrow" badge (blue)
  - [x] "This Week" badge (purple)
  - [x] "Past" badge with days ago indicator
  - [x] "Featured" badge with star icon
  - [x] "Saved" badge for exempt events
- [x] 3.4 Add grace period indicator
  - [x] Show days remaining before auto-archive
  - [x] Visual indicator with color coding (red/orange/gray)
  - [x] Warning indicator for events about to be archived (<= 3 days critical)

## 4. Auto-Archive Implementation

- [x] 4.1 Create/update auto-archive function
  - [x] Find events older than 14 days
  - [x] Exclude events with auto_archive_exempt=true
  - [x] Archive events (set is_archived=true)
  - [x] Un-feature events (set is_current=false)
- [x] 4.2 Schedule auto-archive job
  - [x] Runs on every admin events page load
  - [x] Shows notification of archived events
- [x] 4.3 Add admin notification
  - [x] Show toast message when events were auto-archived
  - [x] List count of recently archived events
  - [x] Add "View Archive" link in notification

## 5. Current/Featured Event Improvements

- [x] 5.1 Keep "is_current" field name (not renaming)
  - [x] UI text updated to use "Featured" terminology
  - [x] Variable names kept as is_current for compatibility
- [x] 5.2 Improve featured event UI
  - [x] Prominent "Featured" badge with star icon
  - [x] Highlight featured event card (amber border/background)
  - [x] Star button on non-featured events to set as featured
- [x] 5.3 Add quick actions
  - [x] One-click set/unset featured from list view
  - [x] Toast notifications on action
  - [x] Clear visual feedback on action

## 6. Bulk Actions and Archive Management

- [x] 6.1 Add bulk archive action
  - [x] Checkbox selection on event cards
  - [x] Bulk actions bar when items selected
  - [x] "Archive Selected" button with confirmation
  - [x] Handles multiple events at once
- [ ] 6.2 Add date range archiving
  - [ ] "Archive All Before [Date]" button
  - [ ] Preview what will be archived
  - [ ] Confirm dialog
- [ ] 6.3 Improve archive view
  - [ ] Better archived events display
  - [ ] Restore functionality (already exists)
  - [ ] Permanent delete option
  - [ ] Filter archived events by date

## 7. Enhanced Filtering and Search

- [x] 7.1 Add quick filter buttons
  - [x] Filter dropdown includes: Recent, This Month, Last Month
  - [x] "Today" status visible via badges
- [x] 7.2 Improve date filtering
  - [x] "Recent" filter (30 days)
  - [x] "This Month" filter
  - [x] "Last Month" filter
- [ ] 7.3 Add event status filters
  - [ ] Filter by: Featured, Visible, Hidden, Archived
  - [ ] Multi-select filters

## 8. UI/UX Polish

- [x] 8.1 Improve event card design
  - [x] Better visual hierarchy with badges
  - [x] Clearer action buttons (star, visibility)
  - [x] Mobile-optimized layout
  - [x] Date badge with month/day
  - [x] Alternating row colors
- [ ] 8.2 Add empty states
  - [ ] "No events today" state
  - [ ] "No recent events" state
  - [ ] "All caught up!" positive reinforcement
- [ ] 8.3 Add loading states
  - [ ] Skeleton loaders for event list
  - [ ] Loading indicators for bulk actions

## 9. Testing

- [ ] 9.1 Test auto-archive logic
  - [ ] Create events with various dates
  - [ ] Verify correct events are archived
  - [ ] Verify exempt events are skipped
- [ ] 9.2 Test featured event functionality
  - [ ] Set/unset featured
  - [ ] Verify UI updates
  - [ ] Test replacement of featured event
- [ ] 9.3 Test filtering and sorting
  - [ ] All filter combinations
  - [ ] Default view on page load
  - [ ] Mobile responsiveness
- [ ] 9.4 Test edge cases
  - [ ] Event exactly 14 days old
  - [ ] Event with auto_archive_exempt
  - [ ] Multiple featured events (shouldn't happen)

## 10. Documentation

- [x] 10.1 Update admin documentation (in code)
  - [x] Auto-archive notification explains what happened
  - [x] Badge tooltips explain statuses
  - [x] Bulk actions have clear labels
- [x] 10.2 Update specs
  - [x] Updated events spec with new requirements
  - [x] Documented auto-archive behavior
  - [x] Added scenarios for all new features
- [x] 10.3 Migration guide
  - [x] SQL migration created (/tmp/add_auto_archive_exempt.sql)
  - [x] No breaking changes
  - [x] Backward compatible with existing events

## Dependencies

- [x] Database migration executed (auto_archive_exempt column added)
- [x] Code changes deployed
- Auto-archive job: Runs on page load (no cron needed)

## Implementation Summary

### Completed (Production Ready):
1. ✅ Database: auto_archive_exempt column added
2. ✅ TypeScript: Types updated with new field
3. ✅ Filters: Recent, This Month, Last Month
4. ✅ Auto-archive: Respects exempt flag, shows notifications
5. ✅ Status Badges: Today, Tomorrow, This Week, Past
6. ✅ Grace Period: Visual indicator with warning colors
7. ✅ Bulk Actions: Checkboxes + archive selected
8. ✅ Featured Event: Enhanced UI with star badge

### Remaining (Future Iteration):
- Date range archiving ("Archive All Before Date")
- Enhanced archive view (delete, filters)
- Multi-select status filters
- Empty states for "No events"
- Skeleton loading states
- Comprehensive test suite

## Files Modified

- `shared/types/event.ts` - Added auto_archive_exempt field
- `shared/lib/events.ts` - Updated filters and helper functions
- `app/(admin)/admin/events/page.tsx` - New filter params
- `app/(admin)/admin/events/events-list-client.tsx` - Full UI overhaul
- `app/(admin)/admin/events/[id]/actions.ts` - Bulk archive action
