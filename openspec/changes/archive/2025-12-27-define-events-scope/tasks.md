## 1. Database Schema
- [x] 1.1 Create events table migration
- [x] 1.2 Create event_playlists junction table migration
- [x] 1.3 Add indexes for performance
- [x] 1.4 Set up RLS policies
- [x] 1.5 Create updated_at trigger

## 2. Shared Types and Utilities
- [x] 2.1 Create Event TypeScript type
- [x] 2.2 Create EventPlaylist TypeScript type
- [x] 2.3 Create event query utilities (CRUD)
- [x] 2.4 Create event-playlist management utilities (add, remove, reorder)
- [x] 2.5 Create event validation utilities
- [x] 2.6 Create getCurrentEvent utility (auto-select + manual override)

## 3. Admin Interface - Events List
- [x] 3.1 Create /admin/events page
- [x] 3.2 Implement visibility filter (all, visible, hidden)
- [x] 3.3 Implement date filter (upcoming, past)
- [x] 3.4 Implement search by name
- [x] 3.5 Show playlist count per event
- [x] 3.6 Show "Current" badge
- [x] 3.7 Add "Set as Current" action
- [x] 3.8 Add breadcrumbs

## 4. Admin Interface - Event Form
- [x] 4.1 Create /admin/events/new page
- [x] 4.2 Create /admin/events/[id] page
- [x] 4.3 Implement name, description, date, time, place fields
- [x] 4.4 Implement visibility toggle
- [x] 4.5 Implement "Set as Current Event" checkbox
- [x] 4.6 Implement playlist list with current playlists
- [x] 4.7 Implement add playlist functionality (search/select)
- [x] 4.8 Implement remove playlist functionality
- [x] 4.9 Implement up/down reordering
- [x] 4.10 Add toast notifications

## 5. Admin Interface - Archive
- [x] 5.1 Create /admin/events/archive page
- [x] 5.2 Implement restore functionality
- [x] 5.3 Implement permanent delete functionality

## 6. Public Website - Event Display
- [x] 6.1 Create /event/[id] route
- [x] 6.2 Display event name, description, date, time, place
- [x] 6.3 Display playlists in order with links
- [x] 6.4 Return 404 for non-visible/archived/expired events
- [x] 6.5 Ensure mobile-first responsive design
- [x] 6.6 Add dark mode support

## 7. Navigation and Integration
- [x] 7.1 Add Events link to admin dashboard
- [x] 7.2 Add breadcrumbs to all event pages
- [x] 7.3 Ensure proper error handling

## 8. Testing
- [ ] 8.1 Test event CRUD operations
- [ ] 8.2 Test playlist add/remove/reorder
- [ ] 8.3 Test visibility and archive flow
- [ ] 8.4 Test current event selection logic
- [ ] 8.5 Test past event grace period
- [ ] 8.6 Test public event page access control

