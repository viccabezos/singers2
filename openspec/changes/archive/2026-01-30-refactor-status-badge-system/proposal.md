# Change: Refactor Status Badge System

## Why

The current StatusBadge component has grown organically and has several issues:
1. **Inconsistent status representation**: Songs use boolean `is_visible`, playlists use string status, events use multiple boolean flags
2. **Missing unified type system**: No clear mapping between entity types and their status variants
3. **Incomplete status coverage**: Missing "draft" status used in DraftAlert widget
4. **Confusing type unions**: `VisibilityStatus | PlaylistStatus | EventStatus` creates overlapping types

We need to refactor the StatusBadge to have a unified, comprehensive status system that covers all entities in the dashboard.

## Current Status Analysis

### Entity-Status Mapping

| Entity | Status Type | Current Values | Used In |
|--------|-------------|----------------|---------|
| **Song** | `is_visible: boolean` | true/false | Songs list, Recent Activity |
| **Playlist** | `status: PlaylistStatus` | "visible", "hidden", "in_progress", "archived" | Playlists list, Recent Activity, Event form |
| **Event** | Multiple booleans | `is_visible`, `is_current`, `is_archived` | Events list, Recent Activity |
| **Draft Alert** | Implied status | "hidden" (songs), "hidden"/"in_progress" (playlists), "hidden" (events) | Dashboard |

### Current StatusBadge Variants
- `visible` - Green, EyeIcon
- `hidden` - Orange/Red, EyeOffIcon
- `in_progress` - Blue, text only
- `archived` - Gray, text only
- `current` - Amber, StarIcon
- `past` - Gray, text only

### Missing Statuses
- `draft` - Not explicitly defined but used conceptually in DraftAlert

## What Changes

### 1. Create Unified Status Type System
Define a comprehensive `DashboardStatus` type that covers all status scenarios:

```typescript
type DashboardStatus = 
  // Visibility states (applies to songs, playlists, events)
  | "visible" 
  | "hidden"
  // Workflow states (playlists)
  | "in_progress"
  | "draft"
  // Archive state (all entities)
  | "archived"
  // Event-specific states
  | "current"
  | "past"
  | "upcoming";
```

### 2. Create Entity-to-Status Mapping Functions
Helper functions to convert entity state to status badge variant:
- `getSongStatus(song): DashboardStatus` → "visible" | "hidden" | "archived"
- `getPlaylistStatus(playlist): DashboardStatus` → "visible" | "hidden" | "in_progress" | "archived"
- `getEventStatus(event): DashboardStatus` → "visible" | "hidden" | "current" | "past" | "archived"

### 3. Update StatusBadge Component
- Replace union types with unified `DashboardStatus`
- Add `draft` status variant
- Improve icon assignments for all statuses
- Maintain backward compatibility

### 4. Update All Consumers
- Songs list: Use `getSongStatus()` helper
- Playlists list: Use `getPlaylistStatus()` helper
- Events list: Use `getEventStatus()` helper
- Recent Activity: Use appropriate helper based on entity type
- Event form: Update playlist status display

## Impact

- Affected specs: ui-library, back-office
- Affected code:
  - `shared/ui/status-badge.tsx` - Complete refactor
  - `shared/lib/status-helpers.ts` - New file with mapping functions
  - `app/(admin)/admin/songs/songs-list-client.tsx` - Use helper
  - `app/(admin)/admin/playlists/playlists-list-client.tsx` - Use helper
  - `app/(admin)/admin/events/events-list-client.tsx` - Use helper
  - `app/(admin)/admin/events/event-form.tsx` - Update status display
  - `widgets/recent-activity/ui/recent-activity.tsx` - Use helpers

## Out of Scope

- Database schema changes
- API changes
- Public website status indicators
