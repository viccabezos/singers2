# Change: Implement Songs Feature

## Why
Songs are the core content entity. We need to implement the database schema, admin interface for managing songs, and public website display for lyrics before implementing Playlists (which will reference Songs).

## What Changes
- Create Songs database schema in Supabase
- Implement admin interface for Songs management (CRUD operations)
- Implement search and filter functionality for Songs
- Implement bulk visibility toggle
- Implement copy/duplicate functionality
- Implement soft delete (archive) and hard delete
- Implement public website lyrics display with font size control
- Implement session-based font size storage

## Impact
- Affected specs: `songs` (implementation of defined requirements)
- Affected code: Database schema, admin routes, public routes, shared components
- Dependencies: Songs must be implemented before Playlists (Playlists reference Songs)

