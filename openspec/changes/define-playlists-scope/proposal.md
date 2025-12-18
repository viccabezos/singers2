# Change: Define Playlists Scope

## Why
Playlists are the second core entity in Les Chanteurs. They group songs together and will later be linked to events. We need to define the data model, visibility states, and admin interface before implementation.

## What Changes
- Define Playlists data model (name, description, songs, visibility states)
- Define visibility states: visible, hidden, in_progress, archived
- Define relationship with Songs (many-to-many)
- Define admin interface requirements (CRUD, song management, reordering)
- Define public website display requirements

## Impact
- New database table: `playlists`
- New junction table: `playlist_songs` (for song ordering)
- New admin pages: `/admin/playlists`, `/admin/playlists/new`, `/admin/playlists/[id]`, `/admin/playlists/archive`
- Future: Public playlist display pages

## Open Questions

### 1. Song Order in Playlist
When songs are added to a playlist, should they have a specific order?
- **Option A**: Yes, songs have a specific order (drag-and-drop reordering)


### 2. Playlist-Song Relationship
Can the same song appear in multiple playlists?
- **Option A**: Yes, a song can be in many playlists (many-to-many)


### 3. "In Progress" State Behavior
You mentioned "in progress" playlists are hidden but show a special visibility indicator. Should there be any other behavior?
- Can admins preview "in progress" playlists on the public site? NO
- Should "in progress" playlists have a different color/badge in the admin list? YES

### 4. Playlist Deletion
When a playlist is deleted (archived), what happens to the songs in it?
- **Option A**: Songs remain in the system (only the playlist-song links are removed)


### 5. Empty Playlists
Should empty playlists (0 songs) be allowed?
- **Option A**: Yes, allow empty playlists (useful for "in progress" playlists)


### 6. Public Website Display
How should playlists appear on the public website?
- Will playlists be accessed directly via URL (e.g., `/playlist/[id]`) yes


Please answer these questions so I can finalize the design document.

