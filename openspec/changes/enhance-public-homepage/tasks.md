## 1. Database Schema and Migrations

- [ ] 1.1 Create migration for `choir_settings` table
  - Add columns: about_text, tagline, facebook_url, instagram_url, youtube_url, email
  - Make all columns nullable with sensible defaults
- [ ] 1.2 Create migration for `choir_photos` table
  - Add columns: id, image_url, caption, display_order, created_at
  - Set up foreign key constraints if needed
- [ ] 1.3 Add columns to `playlists` table
  - Add `featured` boolean (default false)
  - Add `featured_order` integer (nullable)
- [ ] 1.4 Run migrations on development environment
- [ ] 1.5 Test migrations with sample data
- [ ] 1.6 Verify rollback procedures work

## 2. Admin Interface - Settings Management

- [ ] 2.1 Create `/app/(admin)/admin/settings/page.tsx`
  - Settings page with form for choir settings
- [ ] 2.2 Create `/app/(admin)/admin/settings/settings-form.tsx`
  - Form with fields for about_text, tagline, social URLs, email
  - Client-side validation
- [ ] 2.3 Create `/app/(admin)/admin/settings/actions.ts`
  - Server action to update choir settings
  - Validation and error handling
- [ ] 2.4 Update admin navigation to include Settings link
- [ ] 2.5 Add settings icon and quick access in dashboard

## 3. Admin Interface - Photo Management

- [ ] 3.1 Create `/app/(admin)/admin/photos/page.tsx`
  - Photo gallery management page
- [ ] 3.2 Create `/app/(admin)/admin/photos/photo-upload.tsx`
  - Photo upload component with Supabase Storage integration
  - Image preview and validation
- [ ] 3.3 Create `/app/(admin)/admin/photos/photo-list.tsx`
  - Display uploaded photos in grid
  - Drag-to-reorder functionality
  - Delete photo button
- [ ] 3.4 Create `/app/(admin)/admin/photos/actions.ts`
  - Upload photo action (Supabase Storage)
  - Delete photo action
  - Reorder photos action
- [ ] 3.5 Add Photos link to admin navigation

## 4. Admin Interface - Featured Playlists

- [ ] 4.1 Update `/app/(admin)/admin/playlists/playlist-form.tsx`
  - Add featured toggle checkbox
  - Add featured_order input (only visible if featured)
- [ ] 4.2 Update `/app/(admin)/admin/playlists/[id]/actions.ts`
  - Include featured and featured_order in update action
- [ ] 4.3 Update playlists list to show featured badge
- [ ] 4.4 Add validation: max 3 featured playlists

## 5. Shared Library Functions

- [ ] 5.1 Create/update `/shared/lib/settings.ts`
  - `getChoirSettings()` - Fetch choir settings
  - `updateChoirSettings()` - Update settings
- [ ] 5.2 Create/update `/shared/lib/photos.ts`
  - `getPhotos()` - Fetch all photos ordered by display_order
  - `uploadPhoto()` - Upload to Supabase Storage
  - `deletePhoto()` - Delete from storage and database
  - `reorderPhotos()` - Update display_order
- [ ] 5.3 Update `/shared/lib/playlists.ts`
  - `getFeaturedPlaylists()` - Fetch featured playlists ordered by featured_order
  - Include featured filter in existing queries
- [ ] 5.4 Update `/shared/lib/songs.ts`
  - `getAllVisibleSongs()` - Fetch all visible songs for browse page
- [ ] 5.5 Update `/shared/types/database.ts`
  - Add types for choir_settings, choir_photos
  - Add featured fields to Playlist type

## 6. Public Website - Widgets

- [ ] 6.1 Create `/widgets/hero-section/`
  - `hero-section.tsx` - Display choir name and tagline
  - Fetch tagline from choir_settings
  - Responsive layout with visual appeal
- [ ] 6.2 Create `/widgets/about-section/`
  - `about-section.tsx` - Display about text
  - Fetch about_text from choir_settings
  - Format with preserved paragraphs
- [ ] 6.3 Create `/widgets/featured-playlists/`
  - `featured-playlists.tsx` - Display up to 3 featured playlists
  - Fetch from getFeaturedPlaylists()
  - Grid layout responsive to mobile/tablet/desktop
- [ ] 6.4 Create `/widgets/photo-gallery/`
  - `photo-gallery.tsx` - Display photos in grid
  - Fetch from getPhotos()
  - Use next/image for optimization
  - Responsive grid (1-2 cols mobile, 3 cols desktop)
- [ ] 6.5 Create `/widgets/cta-section/`
  - `cta-section.tsx` - Call-to-action buttons
  - "Join the Choir" and "Follow Us" CTAs
  - Link to email or social media
- [ ] 6.6 Create `/widgets/public-header/`
  - `public-header.tsx` - Enhanced navigation header
  - Links: Home, Events, Playlists, Songs
  - Mobile menu (hamburger or bottom drawer)
  - Logo link to home
- [ ] 6.7 Create `/widgets/public-footer/`
  - `public-footer.tsx` - Enhanced footer
  - Navigation links
  - Social media icons (from choir_settings)
  - Copyright information

## 7. Public Website - Homepage Updates

- [ ] 7.1 Update `/app/(public)/page.tsx`
  - Add hero section at top
  - Add current event banner (existing)
  - Add featured playlists section
  - Add upcoming events (existing)
  - Add about section
  - Add photo gallery
  - Add CTA sections
  - Ensure proper ordering and spacing
- [ ] 7.2 Update `/app/(public)/layout.tsx`
  - Replace simple header with PublicHeader widget
  - Replace simple footer with PublicFooter widget
- [ ] 7.3 Add metadata and SEO tags to homepage

## 8. Public Website - Browse Pages

- [ ] 8.1 Create `/app/(public)/songs/page.tsx`
  - Page to browse all visible songs
  - List or grid display with title, artist, language
  - Search input (filter by title)
  - Link to song detail page
- [ ] 8.2 Create `/app/(public)/playlists/page.tsx`
  - Page to browse all visible playlists
  - List or grid display with name, description, song count
  - Link to playlist detail page
- [ ] 8.3 Update navigation to include links to browse pages

## 9. Styling and Visual Improvements

- [ ] 9.1 Review and improve typography across homepage
  - Consistent heading hierarchy (h1, h2, h3)
  - Appropriate font sizes and weights
- [ ] 9.2 Improve spacing between sections
  - Adequate padding/margins
  - Visual separation with borders or background colors
- [ ] 9.3 Ensure dark mode support for all new components
  - Test all widgets in dark mode
  - Verify contrast ratios
- [ ] 9.4 Add visual appeal to hero section
  - Background gradient or subtle pattern
  - Consider background image option
- [ ] 9.5 Ensure responsive layouts for all new components
  - Test on mobile (375px width minimum)
  - Test on tablet (768px)
  - Test on desktop (1280px+)

## 10. Testing and Quality Assurance

- [ ] 10.1 Test admin settings form
  - Save and update settings
  - Validation for URLs and required fields
  - Error handling
- [ ] 10.2 Test photo upload and management
  - Upload photos of various sizes
  - Delete photos
  - Reorder photos
  - Verify Supabase Storage integration
- [ ] 10.3 Test featured playlists
  - Mark playlists as featured
  - Verify max 3 featured limit
  - Reorder featured playlists
  - Display on homepage
- [ ] 10.4 Test homepage sections
  - All sections display correctly
  - Sections hide gracefully when no content
  - Links work correctly
- [ ] 10.5 Test browse pages
  - Songs page displays all visible songs
  - Playlists page displays all visible playlists
  - Search/filter works
  - Links to detail pages work
- [ ] 10.6 Test navigation
  - Header navigation works on mobile and desktop
  - Footer links work
  - Breadcrumbs still work correctly
  - Social media links open in new tabs
- [ ] 10.7 Mobile testing
  - Test on actual mobile device
  - Verify touch targets ≥ 44px
  - Check scrolling and layout
  - Test dark mode on mobile
- [ ] 10.8 Performance testing
  - Homepage loads in < 2 seconds on 3G
  - No layout shift after initial render
  - Images are optimized
  - Check Lighthouse score (target ≥ 90)
- [ ] 10.9 Accessibility testing
  - Check keyboard navigation
  - Verify ARIA labels on icons
  - Test with screen reader (VoiceOver/NVDA)
  - Verify color contrast ratios

## 11. Documentation and Content

- [ ] 11.1 Update `openspec/project.md` with new public site features
  - Document all new sections and capabilities
  - Update user flows and personas
- [ ] 11.2 Create admin documentation
  - How to update choir settings
  - How to upload and manage photos
  - How to set featured playlists
  - Best practices for homepage content
- [ ] 11.3 Populate sample/default content
  - Default tagline and about text
  - Example social media links (if available)
  - Placeholder photos or guidelines

## 12. Deployment Preparation

- [ ] 12.1 Review all database migrations
  - Ensure migrations are idempotent
  - Test rollback procedures
- [ ] 12.2 Create deployment checklist
  - Migration steps
  - Environment variables (if any new ones)
  - Supabase Storage bucket configuration
- [ ] 12.3 Update environment documentation
  - Document new Supabase Storage requirements
  - Document Google Maps API usage (already in use)
- [ ] 12.4 Plan content population
  - Coordinate with admins to populate settings
  - Plan photo uploads
  - Select featured playlists

## Dependencies and Notes

**Dependencies**:
- Task 2, 3, 4 depend on Task 1 (database schema)
- Task 6 depends on Task 5 (shared library functions)
- Task 7, 8 depend on Task 6 (widgets)
- Task 9 can run in parallel with other tasks
- Task 10 depends on all implementation tasks (1-9)
- Task 11, 12 can happen near the end

**Parallelizable Tasks**:
- Tasks 2, 3, 4 can be done in parallel after Task 1
- Widgets in Task 6 can be built in parallel
- Browse pages in Task 8 can be built in parallel
- Styling in Task 9 can be done concurrently with implementation

**Critical Path**:
1. Database schema (Task 1)
2. Shared library functions (Task 5)
3. Widgets (Task 6)
4. Homepage updates (Task 7)
5. Testing (Task 10)

**Estimated Effort**:
- Total: ~40-50 hours of development work
- Database + Admin: ~8-10 hours
- Widgets + Public Pages: ~15-20 hours
- Styling + Polish: ~5-7 hours
- Testing: ~8-10 hours
- Documentation: ~4-5 hours
