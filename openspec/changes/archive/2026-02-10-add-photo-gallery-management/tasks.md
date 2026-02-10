## 1. Database Schema and Storage Setup

- [x] 1.1 Create Supabase migration for choir_photos table
  - Create table with columns (id, image_url, caption, display_order, timestamps)
  - Add indexes for display_order
- [x] 1.2 Create Supabase Storage bucket
  - Create `choir-photos` bucket in Supabase Dashboard
  - Set as public bucket
  - Configure allowed file types (image/jpeg, image/png, image/webp)
  - Set max file size (5MB)
- [x] 1.3 Test migration and storage
  - Apply migration to local Supabase
  - Verify table created
  - Verify bucket accessible
- [x] 1.4 Update TypeScript types
  - Add Photo type to shared/types/photo.ts
  - Export type for use in components
- [x] 1.5 Configure service role key for admin operations
  - Add SUPABASE_SERVICE_ROLE_KEY environment variable
  - Create server-only admin client (shared/lib/supabase-admin.ts)
  - Update photos.ts to use admin client for write operations

## 2. Shared Library Functions

- [x] 2.1 Create shared/lib/photos.ts
  - Implement getPhotos() - fetch all photos ordered by display_order
  - Implement uploadPhoto() - upload to Storage and create DB record
  - Implement deletePhoto() - delete from Storage and DB
  - Implement reorderPhotos() - update display_order
  - Implement updatePhotoCaption() - update caption
  - Add error handling and validation

## 3. Admin Interface - Photos Page

- [x] 3.1 Create admin photos page
  - Create /app/(admin)/admin/photos/page.tsx
  - Server component that fetches current photos
  - Renders photo upload and list
- [x] 3.2 Create photo upload component
  - Create photo-upload.tsx client component
  - File input with drag-and-drop support (ENHANCED: actual drag-drop handlers)
  - Image preview before upload (ENHANCED: multiple file previews)
  - File type and size validation
  - Upload progress indicator
  - Success/error toast notifications
  - ENHANCED: Multiple file upload support
  - ENHANCED: Individual captions per file
  - ENHANCED: Remove files before upload
- [x] 3.3 Create photo list component
  - Create photo-list.tsx client component
  - Grid display of photos
  - Drag-to-reorder functionality (native HTML5 drag-drop)
  - Delete button on each photo
  - Edit caption inline
  - Loading states
  - ENHANCED: Bulk delete with checkboxes
  - ENHANCED: Select all/deselect all
  - ENHANCED: Auto-sync when photos change
- [x] 3.4 Create server actions
  - Create actions.ts with photo CRUD actions
  - uploadPhoto action
  - deletePhoto action
  - reorderPhotos action
  - updateCaption action
  - Revalidate paths after updates
- [x] 3.5 Add photos to admin navigation
  - Update admin nav to include Photos link
  - Add photos icon (ImageIcon)

## 4. Widget Integration

- [x] 4.1 Update photo-gallery widget
  - Fetch choir photos in server component
  - Use next/image for optimization
  - Display up to 6 photos
  - Show caption on hover or below
  - Responsive grid (2 cols mobile, 3 cols desktop)
  - Fallback to skeleton if no photos

## 5. Testing

- [x] 5.1 Test photo upload
  - Upload single photo ✓
  - Upload multiple photos ✓
  - Test file type validation (reject .txt, accept .jpg, .png, .webp) ✓
  - Test file size validation (reject >5MB) ✓
  - Verify image stored in Supabase Storage ✓
  - Verify DB record created ✓
  - Drag-and-drop file upload ✓
  - Multiple file previews with captions ✓
- [x] 5.2 Test photo management
  - Delete photo (verify removed from Storage and DB) ✓
  - Reorder photos (drag and drop) ✓
  - Edit captions ✓
  - Verify display_order updates correctly ✓
  - Bulk delete with checkboxes ✓
  - Select all/deselect all functionality ✓
- [x] 5.3 Test widget integration
  - Verify gallery shows real photos ✓
  - Verify captions display on hover ✓
  - Test responsive layout ✓
  - Test with 0 photos (skeleton shows) ✓
  - Test with <6 photos (shows what's available) ✓
  - Test with >6 photos (shows first 6) ✓
- [x] 5.4 Test admin navigation
  - Photos link appears in nav ✓
  - Navigation to photos page works ✓
- [x] 5.5 Test on mobile
  - Upload works on mobile ✓
  - Drag-to-reorder works on mobile ✓
  - Gallery displays correctly ✓
  - Bulk selection accessible on mobile ✓

## 6. Polish (Completed for V1)

- [x] 6.1 User experience improvements
  - Empty state with upload prompt ✓
  - Upload guidelines (file types, size) shown in UI ✓
  - Clear visual feedback for selections ✓
  - Auto-refresh after uploads (no manual page reload) ✓
- [x] 6.2 Verify dark mode
  - Photos page works in dark mode ✓
  - Gallery widget works in dark mode ✓
  - All UI components properly themed ✓

## 7. Future Enhancements (V2 - Deferred)

- [ ] 7.1 Advanced image optimization
  - Automatic image resizing on upload
  - Generate thumbnails for admin grid
  - WebP conversion for better performance
- [ ] 7.2 Enhanced viewing
  - Lightbox/modal for full-size photo view
  - Image zoom functionality
  - Slideshow mode
- [ ] 7.3 Additional features
  - Photo categories/tags
  - Alt text for accessibility
  - Photo upload from URL
  - Batch caption editing
