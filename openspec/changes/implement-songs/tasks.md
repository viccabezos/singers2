## 1. Database Schema
- [x] 1.1 Create Songs table migration in Supabase
- [x] 1.2 Add indexes for search and filtering
- [x] 1.3 Set up Row Level Security (RLS) policies
- [x] 1.4 Create updated_at trigger

## 2. Shared Types and Utilities
- [x] 2.1 Create Song TypeScript type in shared/types
- [x] 2.2 Create database query utilities in shared/lib
- [x] 2.3 Create song validation utilities

## 3. Admin Interface - Songs List
- [x] 3.1 Create /admin/songs page (list view)
- [x] 3.2 Implement search functionality
- [x] 3.3 Implement filters (title, artist, language, visibility)
- [x] 3.4 Implement bulk visibility toggle
- [x] 3.5 Add mobile-first responsive design

## 4. Admin Interface - Song Form
- [x] 4.1 Create /admin/songs/new page (create form)
- [x] 4.2 Create /admin/songs/[id] page (edit form)
- [x] 4.3 Implement form validation
- [x] 4.4 Add copy/duplicate functionality
- [x] 4.5 Use textarea for lyrics input (preserves line breaks)

## 5. Admin Interface - Archive
- [x] 5.1 Create /admin/songs/archive page
- [x] 5.2 Implement soft delete (archive) functionality
- [x] 5.3 Implement hard delete from archive
- [x] 5.4 Add restore from archive functionality

## 6. Public Website - Lyrics Display
- [x] 6.1 Create /song/[id] route
- [x] 6.2 Implement lyrics display with preserved line breaks
- [x] 6.3 Create font size slider component (14px-24px)
- [x] 6.4 Implement sessionStorage for font size
- [x] 6.5 Add dark mode support
- [x] 6.6 Ensure mobile-first responsive design

## 7. Navigation and Integration
- [x] 7.1 Add Songs link to admin dashboard navigation
- [x] 7.2 Add breadcrumbs to admin pages
- [x] 7.3 Ensure proper error handling and loading states

## 8. Testing and Validation
- [ ] 8.1 Test song creation/editing flow
- [ ] 8.2 Test search and filter functionality
- [ ] 8.3 Test bulk visibility toggle
- [ ] 8.4 Test copy/duplicate functionality
- [ ] 8.5 Test soft/hard delete flow
- [ ] 8.6 Test lyrics display and font size on mobile devices
- [ ] 8.7 Test session storage persistence

