# Design: Events Scope

## Context
Events represent choir performances or gatherings. They are the top-level entity that links to playlists, completing the content model: Events → Playlists → Songs. This document defines the data model, visibility rules, and interface requirements.

## Decisions

### Decision: Event Data Model
**What**: Events have name (required), optional description, date, time, place, and visibility status.

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| name | TEXT | Yes | Event name |
| description | TEXT | No | Optional description |
| event_date | DATE | Yes | Event date (Europe/Paris timezone) |
| event_time | TIME | No | Event time (optional for TBD times) |
| place | TEXT | No | Event location |
| is_visible | BOOLEAN | Yes | Visibility on public site |
| is_current | BOOLEAN | Yes | Manual "current event" override |
| is_archived | BOOLEAN | Yes | Soft delete flag |
| created_at | TIMESTAMPTZ | Yes | Creation timestamp |
| updated_at | TIMESTAMPTZ | Yes | Last update timestamp |

**Notes**:
- Date and time are separate fields for flexibility (TBD times, all-day events)
- Timezone: Europe/Paris (France)
- `is_current` allows manual override of auto-selected current event

### Decision: Many-to-Many Relationship with Playlists
**What**: Playlists can belong to multiple events, and events can have multiple playlists.

**Why**: Reusing playlists across events is practical (e.g., same repertoire for different performances).

**Junction Table**: `event_playlists`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| event_id | UUID | Yes | Foreign key to events |
| playlist_id | UUID | Yes | Foreign key to playlists |
| position | INTEGER | Yes | Order position in event (1-based) |
| created_at | TIMESTAMPTZ | Yes | When playlist was added |

**Unique Constraint**: `(event_id, playlist_id)` - a playlist can only appear once per event.

### Decision: Playlist Ordering
**What**: Playlists have a specific order within each event.

**Why**: Events may have multiple sets/parts with specific playlist order.

**Implementation**: Same pattern as songs in playlists (position field, up/down reordering).

### Decision: Archive with Restore
**What**: Events support soft delete (archive) with restore option.

**Why**: Consistency with songs and playlists. Prevents accidental data loss.

### Decision: Current Event Logic
**What**: Auto-select closest upcoming event, with manual override option.

**Auto-selection logic**:
1. Find visible events with `event_date >= today`
2. Order by `event_date ASC, event_time ASC NULLS LAST`
3. Return the first one (closest upcoming)

**Manual override**:
- Admin can set `is_current = true` on any event
- If an event has `is_current = true`, it takes precedence over auto-selection
- Only one event can have `is_current = true` at a time

### Decision: Past Event Auto-Archive
**What**: Events are auto-hidden after 2 weeks past their date, then archived.

**Implementation**:
- Events with `event_date < today - 14 days` are automatically hidden from public
- A scheduled job or on-read logic can archive them
- For MVP: Handle this in the query logic (filter out old events)
- Future: Add a cron job to archive old events

**Visibility rules for public**:
1. `is_visible = true`
2. `is_archived = false`
3. `event_date >= today - 14 days` (grace period for recent events)

## Database Schema

```sql
-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  place TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT false,
  is_current BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for event-playlist relationship
CREATE TABLE event_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, playlist_id)
);

-- Indexes
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_visible ON events(is_visible) WHERE is_archived = false;
CREATE INDEX idx_events_current ON events(is_current) WHERE is_current = true;
CREATE INDEX idx_event_playlists_event ON event_playlists(event_id);
CREATE INDEX idx_event_playlists_playlist ON event_playlists(playlist_id);
CREATE INDEX idx_event_playlists_position ON event_playlists(event_id, position);

-- Updated_at trigger
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one current event (trigger or application logic)
-- For MVP: Handle in application code

-- RLS Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_playlists ENABLE ROW LEVEL SECURITY;

-- Public can read visible, non-archived events within grace period
CREATE POLICY "Public can read visible events"
  ON events FOR SELECT
  USING (
    is_visible = true 
    AND is_archived = false 
    AND event_date >= CURRENT_DATE - INTERVAL '14 days'
  );

-- Public can read event_playlists for visible events
CREATE POLICY "Public can read event playlists for visible events"
  ON event_playlists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_playlists.event_id
      AND events.is_visible = true
      AND events.is_archived = false
      AND events.event_date >= CURRENT_DATE - INTERVAL '14 days'
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to events"
  ON events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to event_playlists"
  ON event_playlists FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

## Admin Interface

### Events List (`/admin/events`)
- Table/list view of all events (excluding archived)
- Columns: Name, Date, Time, Place, Playlists Count, Visibility, Current, Actions
- Show "Current" badge for the current event
- Filters: Visibility (all, visible, hidden), Date range (upcoming, past)
- Search by name
- Actions: Edit, Archive, Set as Current
- Link to archive page

### Event Form (`/admin/events/new`, `/admin/events/[id]`)
- Name (required)
- Description (optional, textarea)
- Date (required, date picker)
- Time (optional, time picker)
- Place (optional)
- Visibility toggle
- "Set as Current Event" checkbox
- Playlist management:
  - List of current playlists with reordering
  - Add playlists (search/select from available)
  - Remove playlists

### Archive (`/admin/events/archive`)
- List of archived events
- Actions: Restore, Permanently Delete

## Public Interface

### Event Page (`/event/[id]`)
- Only accessible for visible, non-archived events within grace period
- Shows: Event name, description, date, time, place
- Lists playlists in order (each links to `/playlist/[id]`)
- Mobile-first, high contrast, dark mode support

### Current Event
- Homepage or dedicated section shows the "current event"
- Determined by: manual override (`is_current`) or auto-select (closest upcoming)

## Risks / Trade-offs

- **Auto-archive complexity**: For MVP, handle in queries. Add cron job later if needed.
- **Timezone handling**: Store dates without timezone, display in Europe/Paris.
- **Single current event**: Application logic ensures only one `is_current = true`.

