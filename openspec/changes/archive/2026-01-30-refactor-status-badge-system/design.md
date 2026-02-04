# Design: Refactor Status Badge System

## Context

The dashboard has three main entities (Songs, Playlists, Events) with different status representations:
- Songs: Boolean flags (`is_visible`, `is_archived`)
- Playlists: String status enum (`"visible" | "hidden" | "in_progress" | "archived"`)
- Events: Multiple boolean flags (`is_visible`, `is_current`, `is_archived`) + date-based "past" status

This inconsistency makes the StatusBadge component complex and error-prone.

## Goals

1. Create a unified status system that covers all entities
2. Provide clear entity-to-status mapping functions
3. Maintain visual consistency across the dashboard
4. Support all current use cases without breaking changes

## Non-Goals

- Changing database schemas
- Changing API contracts
- Adding new status values not currently used

## Decisions

### Decision 1: Unified DashboardStatus Type

**What**: Create a single type that encompasses all possible status states.

```typescript
type DashboardStatus = 
  | "visible"      // Published and visible to public
  | "hidden"       // Published but hidden from public
  | "in_progress"  // Work in progress (playlists)
  | "draft"        // Draft state (implied by hidden)
  | "archived"     // Soft-deleted/archived
  | "current"      // Current event
  | "past"         // Past event (by date)
  | "upcoming";    // Future event (by date)
```

**Rationale**: 
- Single source of truth for all statuses
- Easy to extend in the future
- Clear semantic meaning for each status

### Decision 2: Entity-to-Status Mapping Functions

**What**: Create pure functions that convert entity state to DashboardStatus.

**Song mapping**:
```typescript
function getSongStatus(song: Song): DashboardStatus {
  if (song.is_archived) return "archived";
  return song.is_visible ? "visible" : "hidden";
}
```

**Playlist mapping**:
```typescript
function getPlaylistStatus(playlist: Playlist): DashboardStatus {
  return playlist.status; // Already DashboardStatus compatible
}
```

**Event mapping**:
```typescript
function getEventStatus(event: Event): DashboardStatus {
  if (event.is_archived) return "archived";
  if (event.is_current) return "current";
  if (isPastEvent(event.event_date)) return "past";
  return event.is_visible ? "visible" : "hidden";
}
```

**Rationale**:
- Centralizes status logic
- Makes components simpler
- Easy to test and maintain

### Decision 3: StatusBadge Styling

**Visual design**:
| Status | Color | Icon | Use Case |
|--------|-------|------|----------|
| visible | Green | Eye | Public content |
| hidden | Red/Orange | EyeOff | Hidden content |
| in_progress | Blue | Clock/Loader | WIP playlists |
| draft | Amber | FileEdit | Draft content |
| archived | Gray | Archive | Archived items |
| current | Amber | Star | Current event |
| past | Gray | History | Past events |
| upcoming | Blue | Calendar | Future events |

**Rationale**:
- Consistent color coding (green=active, red=inactive, blue=process, gray=inactive)
- Icons provide quick visual recognition
- Accessible with tooltips

### Decision 4: Backward Compatibility

**What**: Keep existing props working while adding new unified props.

```typescript
interface StatusBadgeProps {
  // New unified prop (preferred)
  status?: DashboardStatus;
  // Legacy props (deprecated but supported)
  variant?: LegacyStatus;
  isVisible?: boolean;
  // Display options
  showIcon?: boolean;
  iconOnly?: boolean;
  compactOnMobile?: boolean;
  className?: string;
}
```

**Rationale**:
- Gradual migration possible
- No breaking changes
- Can deprecate old props over time

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking existing components | Maintain backward compatibility layer |
| Status ambiguity (e.g., hidden vs draft) | Clear documentation and semantic meaning |
| Too many status variants | Group by category (visibility, workflow, time) |

## Migration Plan

1. Create status-helpers.ts with mapping functions
2. Refactor StatusBadge with unified type
3. Update one component at a time
4. Test each change
5. Remove deprecated props in future release

## Open Questions

1. Should we add `draft` as a distinct status or treat it as `hidden`?
   - **Decision**: Add `draft` as distinct for clarity, but it maps to `hidden` visibility
2. Should upcoming events show as "upcoming" or just "visible"?
   - **Decision**: Show "visible" by default, "upcoming" only when specifically needed
