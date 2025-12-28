# Design: Playlists Scope

## Context
Playlists group songs together for choir performances. They are the second core entity after Songs and will later be linked to Events. This document defines the data model, visibility states, and interface requirements.

## Decisions

### Decision: Playlist Data Model
**What**: Playlists have a name (required), optional description, and visibility status.

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| name | TEXT | Yes | Playlist name |
| description | TEXT | No | Optional description |
| status | ENUM | Yes | visible, hidden, in_progress, archived |
| created_at | TIMESTAMPTZ | Yes | Creation timestamp |
| updated_at | TIMESTAMPTZ | Yes | Last update timestamp |

**Status Values**:
- `visible`: Shown on public website
- `hidden`: Not shown on public website, but accessible in admin
- `in_progress`: Hidden from public, shown with special badge in admin (for work-in-progress playlists)
- `archived`: Soft deleted, only visible in archive section

### Decision: Many-to-Many Relationship with Songs
**What**: Songs can belong to multiple playlists, and playlists can contain multiple songs.

**Junction Table**: `playlist_songs`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| playlist_id | UUID | Yes | Foreign key to playlists |
| song_id | UUID | Yes | Foreign key to songs |
| position | INTEGER | Yes | Order position in playlist (1-based) |
| created_at | TIMESTAMPTZ | Yes | When song was added |

**Unique Constraint**: `(playlist_id, song_id)` - a song can only appear once per playlist.

### Decision: Song Ordering
**What**: Songs have a specific order within each playlist.

**Why**: Choir performances follow a set order. Admins need control over song sequence.

**Implementation**:
- `position` field in junction table (1-based integer)
- Drag-and-drop reordering in admin interface
- When adding a song, it goes to the end (highest position + 1)
- When removing a song, positions are recalculated

### Decision: Visibility Status with "In Progress" Badge
**What**: "In Progress" playlists are hidden from public but show a distinct badge in admin.

**Why**: Allows admins to pause work on a playlist and easily find it later.

**Behavior**:
- `in_progress` playlists are NOT visible on public website
- `in_progress` playlists show a special badge/color in admin list
- Admins CANNOT preview `in_progress` playlists on public site
- `in_progress` is a distinct status, not a combination of hidden + flag

### Decision: Empty Playlists Allowed
**What**: Playlists can have 0 songs.

**Why**: Useful for creating "in progress" playlists where songs will be added later.

### Decision: Playlist Deletion Preserves Songs
**What**: When a playlist is archived/deleted, songs remain in the system.

**Why**: Songs are independent entities that may be used in other playlists.

**Behavior**:
- Archiving a playlist sets `status = 'archived'`
- Junction table entries are preserved (for potential restore)
- Songs are not affected
- Hard delete removes playlist and junction entries, but not songs

### Decision: Public URL Access
**What**: Playlists are accessible directly via `/playlist/[id]`.

**Why**: Allows sharing playlist links independently of events.

**Behavior**:
- Only `visible` playlists are accessible on public URL
- `hidden`, `in_progress`, and `archived` playlists return 404
- Public page shows playlist name, description, and list of songs
- Each song links to its lyrics page (`/song/[id]`)

## Database Schema

```sql
-- Playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'hidden' CHECK (status IN ('visible', 'hidden', 'in_progress', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for playlist-song relationship
CREATE TABLE playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);

-- Indexes
CREATE INDEX idx_playlists_status ON playlists(status);
CREATE INDEX idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX idx_playlist_songs_song ON playlist_songs(song_id);
CREATE INDEX idx_playlist_songs_position ON playlist_songs(playlist_id, position);

-- Updated_at trigger
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Public can read visible playlists
CREATE POLICY "Public can read visible playlists"
  ON playlists FOR SELECT
  USING (status = 'visible');

-- Public can read playlist_songs for visible playlists
CREATE POLICY "Public can read playlist songs for visible playlists"
  ON playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.status = 'visible'
    )
  );

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access to playlists"
  ON playlists FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to playlist_songs"
  ON playlist_songs FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Admin Interface

### Playlists List (`/admin/playlists`)
- Table/list view of all playlists (excluding archived)
- Columns: Name, Song Count, Status (with badge), Actions
- Status badges:
  - `visible`: Green badge "Visible"
  - `hidden`: Orange badge "Hidden"
  - `in_progress`: Blue badge "In Progress"
- Filters: Status (all, visible, hidden, in_progress)
- Search by name
- Actions: Edit, Archive
- Link to archive page

### Playlist Form (`/admin/playlists/new`, `/admin/playlists/[id]`)
- Name (required)
- Description (optional, textarea)
- Status dropdown (visible, hidden, in_progress)
- Song management:
  - List of current songs with drag-and-drop reordering
  - Add songs (search/select from available songs)
  - Remove songs
  - Show song count

### Archive (`/admin/playlists/archive`)
- List of archived playlists
- Actions: Restore, Permanently Delete

## Public Interface

### Playlist Page (`/playlist/[id]`)
- Only accessible for `visible` playlists
- Shows: Playlist name, description (if any), list of songs
- Each song links to `/song/[id]`
- Mobile-first, high contrast design
- Dark mode support

## Risks / Trade-offs

- **Position Gaps**: After deletions, positions may have gaps. We'll normalize on read or periodically.
- **Performance**: Many-to-many with ordering adds complexity. Acceptable for expected scale.
- **No Preview**: Admins can't preview "in progress" playlists publicly. Simplifies implementation.

