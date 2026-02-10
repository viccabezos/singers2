# Design: Events Management Improvements

## Context

The current events system uses an `is_current` flag to mark one event as the "current" event for display on the public site. However, this has several issues:

1. **Confusing Terminology**: "Current" implies "happening now" but it's used to mean "featured/highlighted"
2. **No Auto-Cleanup**: Past events accumulate indefinitely in the active list
3. **Poor Default View**: Admin sees all events or must filter manually
4. **Missing Visual Indicators**: No clear indication of event status relative to today

## Goals

1. Make event management more intuitive with better default views
2. Automatically clean up old events to reduce clutter
3. Clarify the purpose of the featured event
4. Provide better visual feedback about event status

## Decisions

### 1. Auto-Archive Approach

**Decision**: Implement server-side auto-archiving with daily checks

**Options Considered**:
- **Option A**: Client-side check on admin page load
  - Pros: Simple to implement, no external dependencies
  - Cons: Only runs when admin visits page, not reliable
  
- **Option B**: Database trigger on SELECT/UPDATE
  - Pros: Automatic, database-level
  - Cons: Not supported by Supabase, could impact performance
  
- **Option C**: Scheduled job (cron/edge function)
  - Pros: Reliable, runs daily regardless of user activity
  - Cons: Requires infrastructure (Vercel Cron or similar)

**Recommendation**: Start with Option A for MVP, migrate to Option C for production

### 2. Featured vs Current Naming

**Decision**: Rename "Current Event" to "Featured Event"

**Rationale**:
- "Current" is ambiguous (current time vs current selection)
- "Featured" clearly indicates it's being highlighted
- Consistent with "Featured Playlists" terminology already in use
- Better describes the actual functionality

**Implementation**:
- Phase 1: Update UI labels only (backward compatible)
- Phase 2: Rename database column (requires migration)

### 3. Default Admin View

**Decision**: Show events from today backwards, sorted newest first

**Rationale**:
- Admins primarily manage ongoing and recent past events
- Future events are already planned and need less attention
- Reduces cognitive load by showing relevant events first
- Still allows viewing all events via filter

**Default Filters**:
- `event_date <= today`
- `is_archived = false`
- Sort: `event_date DESC`

### 4. Auto-Archive Timing

**Decision**: Archive events approximately 14 days after event date

**Calculation**:
- Event on Jan 1 → Auto-archive around Jan 15
- Grace period: ~14 days after event (approximate)
- **Future V2**: Add configurable archive delay in settings

**Clarification**: 14 days is approximate. The system will check daily and archive events >14 days old.

### 5. Database Schema Changes

**Decision**: Add `auto_archive_exempt` boolean column

**Migration**:
```sql
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS auto_archive_exempt BOOLEAN DEFAULT FALSE;

-- Optional: Rename is_current to is_featured
-- ALTER TABLE events RENAME COLUMN is_current TO is_featured;
```

**Types Update**:
```typescript
interface Event {
  // ... existing fields
  auto_archive_exempt?: boolean;
  is_current: boolean; // or is_featured if renamed
}
```

## Architecture

### Auto-Archive Flow

```
Daily Trigger (or Page Load)
    ↓
Find events where:
  - event_date < today - 14 days
  - is_archived = false
  - auto_archive_exempt = false
    ↓
For each event:
  - Set is_archived = true
  - Set is_current = false (if featured)
  - Log action
    ↓
Notify admin (toast/banner)
```

### Admin UI Changes

**Event Card Enhancements**:
- Status badge (Today, Tomorrow, Past, etc.)
- Days until auto-archive indicator
- Featured star badge
- Quick action buttons (Set Featured, Archive)

**Filter Panel**:
- Default: "Recent" (today + past)
- Options: All, Today, This Week, Upcoming, Past, Archived
- Date range picker

**Bulk Actions**:
- Checkbox selection
- Bulk archive button
- "Archive Before Date" action

## Risks and Mitigations

### Risk 1: Accidental Archiving
**Mitigation**: 
- 14-day grace period is generous
- Exempt flag allows preserving important events
- Archive is soft-delete (can be restored)
- Admin notification shows what was archived

### Risk 2: Performance Impact
**Mitigation**:
- Auto-archive runs once daily, not on every request
- Indexed date column for fast queries
- Limited to non-archived events only

### Risk 3: User Confusion
**Mitigation**:
- Clear visual indicators
- Helpful empty states
- Documentation updates
- Toast notifications for actions

## Implementation Phases

### Phase 1: Quick Wins (2-3 hours)
1. Update default sorting (descending)
2. Add default filter (today + past)
3. Rename "Current" to "Featured" in UI
4. Add featured badge to event cards

### Phase 2: Auto-Archive (3-4 hours)
1. Add auto_archive_exempt column
2. Implement auto-archive function
3. Add client-side daily check
4. Add admin notification

### Phase 3: Enhanced UI (4-5 hours)
1. Add status badges
2. Add days-until-archive indicator
3. Implement bulk actions
4. Add date range archiving
5. Improve archive view

### Phase 4: Testing & Polish (2-3 hours)
1. Test all scenarios
2. Mobile responsiveness
3. Edge cases
4. Documentation

## Open Questions

1. **Auto-archive trigger**: Client-side daily check or server-side cron job?
2. **Database rename**: Should we rename `is_current` to `is_featured`?
3. **Notification style**: Toast, banner, or archive view only?
4. **Bulk actions UI**: Checkboxes or select mode?

These need to be answered before implementation begins.
