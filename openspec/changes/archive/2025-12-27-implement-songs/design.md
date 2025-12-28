# Design: Songs Implementation

## Context
Based on the `define-songs-scope` proposal, we need to implement:
- Database schema for Songs
- Admin interface for managing songs
- Public website lyrics display

## Database Schema

### Songs Table
```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  artist_composer TEXT,
  language TEXT,
  genre TEXT,
  year INTEGER,
  is_visible BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_songs_visible ON songs(is_visible) WHERE is_archived = false;
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist_composer);
CREATE INDEX idx_songs_language ON songs(language);
```

## Admin Interface Structure

### Routes
- `/admin/songs` - Songs list page (with search, filters, bulk actions)
- `/admin/songs/new` - Create new song
- `/admin/songs/[id]` - Edit song
- `/admin/songs/archive` - Archived songs list

### Features
- List view with search and filters
- Create/Edit form (title, lyrics, optional fields)
- Bulk visibility toggle
- Copy/Duplicate action
- Soft delete (archive)
- Hard delete from archive

## Public Website Structure

### Routes
- `/song/[id]` - Display song lyrics (with font size control)

### Features
- Lyrics display with preserved line breaks
- Font size slider (14px-24px)
- Session-based font size storage
- Dark mode support

## Decisions

### Database
- Use UUID for primary keys (Supabase standard)
- Use boolean flags for visibility and archive status
- Index on commonly filtered/searched fields

### Admin Interface
- Mobile-first design
- Use shadcn components for forms and tables
- Server-side filtering and search (Supabase queries)

### Public Display
- Client component for font size slider (needs interactivity)
- Server component for lyrics display (can be cached)
- Use browser sessionStorage for font size persistence

## Alternatives Considered

### Font Size Storage
- **SessionStorage**: Chosen - simple, clears on browser close
- **LocalStorage**: Rejected - would persist across sessions (not desired)
- **Server session**: Rejected - unnecessary complexity

### Search Implementation
- **Server-side search**: Chosen - better performance, uses database indexes
- **Client-side search**: Rejected - would require loading all songs

## Risks / Trade-offs

### Database Performance
- **Risk**: Large number of songs could slow queries
- **Mitigation**: Proper indexing on filtered fields
- **Trade-off**: Indexes use storage but improve query performance

### Font Size Slider
- **Risk**: Slider may be hard to use on very small screens
- **Mitigation**: Mobile-first design, test and adjust if needed
- **Trade-off**: Flexibility vs ease of use - flexibility chosen

