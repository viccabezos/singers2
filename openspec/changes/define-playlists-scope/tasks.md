## 1. Database Schema
- [x] 1.1 Create playlists table migration
- [x] 1.2 Create playlist_songs junction table migration
- [x] 1.3 Add indexes for performance
- [x] 1.4 Set up RLS policies
- [x] 1.5 Create updated_at trigger

## 2. Shared Types and Utilities
- [x] 2.1 Create Playlist TypeScript type
- [x] 2.2 Create PlaylistSong TypeScript type
- [x] 2.3 Create playlist query utilities (CRUD)
- [x] 2.4 Create playlist-song management utilities (add, remove, reorder)
- [x] 2.5 Create playlist validation utilities

## 3. Admin Interface - Playlists List
- [x] 3.1 Create /admin/playlists page
- [x] 3.2 Implement status filter (all, visible, hidden, in_progress)
- [x] 3.3 Implement search by name
- [x] 3.4 Add status badges (visible=green, hidden=orange, in_progress=blue)
- [x] 3.5 Show song count per playlist
- [x] 3.6 Add breadcrumbs

## 4. Admin Interface - Playlist Form
- [x] 4.1 Create /admin/playlists/new page
- [x] 4.2 Create /admin/playlists/[id] page
- [x] 4.3 Implement name and description fields
- [x] 4.4 Implement status dropdown
- [x] 4.5 Implement song list with current songs
- [x] 4.6 Implement add song functionality (search/select)
- [x] 4.7 Implement remove song functionality
- [x] 4.8 Implement up/down reordering (drag-and-drop can be added later)
- [x] 4.9 Add toast notifications

## 5. Admin Interface - Archive
- [x] 5.1 Create /admin/playlists/archive page
- [x] 5.2 Implement restore functionality
- [x] 5.3 Implement permanent delete functionality

## 6. Public Website - Playlist Display
- [x] 6.1 Create /playlist/[id] route
- [x] 6.2 Display playlist name and description
- [x] 6.3 Display songs in order with links to lyrics
- [x] 6.4 Return 404 for non-visible playlists
- [x] 6.5 Ensure mobile-first responsive design
- [x] 6.6 Add dark mode support

## 7. Navigation and Integration
- [x] 7.1 Add Playlists link to admin dashboard
- [x] 7.2 Add breadcrumbs to all playlist pages
- [x] 7.3 Ensure proper error handling

## 8. Testing
- [ ] 8.1 Test playlist CRUD operations
- [ ] 8.2 Test song add/remove/reorder
- [ ] 8.3 Test status filtering
- [ ] 8.4 Test archive/restore/delete flow
- [ ] 8.5 Test public playlist page access control

