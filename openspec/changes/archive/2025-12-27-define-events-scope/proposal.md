# Change: Define Events Scope

## Why
Events are the third and final core entity in Les Chanteurs. They represent choir performances or gatherings and link to playlists. This completes the content model: Events → Playlists → Songs.

## What Changes
- Define Events data model (name, description, date, time, place, visibility)
- Define relationship with Playlists (one-to-many: event has 0 to N playlists)
- Define admin interface requirements (CRUD, playlist management)
- Define public website display requirements

## Impact
- New database table: `events`
- New junction table or foreign key for event-playlist relationship
- New admin pages: `/admin/events`, `/admin/events/new`, `/admin/events/[id]`
- Public event pages: `/event/[id]`

## Open Questions

### 1. Event-Playlist Relationship
Can a playlist belong to multiple events, or only one event at a time?
- **Option A**: One playlist can be in multiple events (many-to-many)


### 2. Playlist Order in Event
Should playlists within an event have a specific order?
- **Option A**: Yes, playlists have a specific order (like songs in playlists)


### 3. Date/Time Format
How should date and time be stored?


- **Option B**: Separate date and time fields (more flexibility for "all day" events or TBD times) mind we are in France (europe)

### 4. Archive/Delete Behavior
Should events support archive (soft delete) like songs and playlists?
- **Option A**: Yes, archive with restore option


### 5. "Current Event" Logic
The project mentions showing the "current event" on the public website. How should this work?

- **Option C**: Both (auto-select but allow manual override)

### 6. Past Events
Should past events (date < today) be automatically hidden from public?
- **Option A**: Yes, auto-hide past events after two weeks, then archive them




