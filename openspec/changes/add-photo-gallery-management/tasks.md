## 1. Database Schema and Storage Setup

- [ ] 1.1 Create Supabase migration for choir_photos table
  - Create table with columns (id, image_url, caption, display_order, timestamps)
  - Add indexes for display_order
- [ ] 1.2 Create Supabase Storage bucket
  - Create `choir-photos` bucket in Supabase Dashboard
  - Set as public bucket
  - Configure allowed file types (image/jpeg, image/png, image/webp)
  - Set max file size (5MB)
- [ ] 1.3 Test migration and storage
  - Apply migration to local Supabase
  - Verify table created
  - Verify bucket accessible
- [ ] 1.4 Update TypeScript types
  - Add Photo type to shared/types/photo.ts
  - Export type for use in components

## 2. Shared Library Functions

- [ ] 2.1 Create shared/lib/photos.ts
  - Implement getPhotos() - fetch all photos ordered by display_order
  - Implement uploadPhoto() - upload to Storage and create DB record
  - Implement deletePhoto() - delete from Storage and DB
  - Implement reorderPhotos() - update display_order
  - Implement updatePhotoCaption() - update caption
  - Add error handling and validation

## 3. Admin Interface - Photos Page

- [ ] 3.1 Create admin photos page
  - Create /app/(admin)/admin/photos/page.tsx
  - Server component that fetches current photos
  - Renders photo upload and list
- [ ] 3.2 Create photo upload component
  - Create photo-upload.tsx client component
  - File input with drag-and-drop support
  - Image preview before upload
  - File type and size validation
  - Upload progress indicator
  - Success/error toast notifications
- [ ] 3.3 Create photo list component
  - Create photo-list.tsx client component
  - Grid display of photos
  - Drag-to-reorder functionality (dnd-kit or similar)
  - Delete button on each photo
  - Edit caption inline or via modal
  - Loading states
- [ ] 3.4 Create server actions
  - Create actions.ts with photo CRUD actions
  - uploadPhoto action
  - deletePhoto action
  - reorderPhotos action
  - updateCaption action
  - Revalidate paths after updates
- [ ] 3.5 Add photos to admin navigation
  - Update admin nav to include Photos link
  - Add photos icon (ImageIcon)

## 4. Widget Integration

- [ ] 4.1 Update photo-gallery widget
  - Fetch choir photos in server component
  - Use next/image for optimization
  - Display up to 6 photos
  - Show caption on hover or below
  - Responsive grid (2 cols mobile, 3 cols desktop)
  - Fallback to skeleton if no photos

## 5. Testing

- [ ] 5.1 Test photo upload
  - Upload single photo
  - Upload multiple photos
  - Test file type validation (reject .txt, accept .jpg, .png, .webp)
  - Test file size validation (reject >5MB)
  - Verify image stored in Supabase Storage
  - Verify DB record created
- [ ] 5.2 Test photo management
  - Delete photo (verify removed from Storage and DB)
  - Reorder photos (drag and drop)
  - Edit captions
  - Verify display_order updates correctly
- [ ] 5.3 Test widget integration
  - Verify gallery shows real photos
  - Verify captions display
  - Test responsive layout
  - Test with 0 photos (skeleton shows)
  - Test with <6 photos (shows what's available)
  - Test with >6 photos (shows first 6)
- [ ] 5.4 Test admin navigation
  - Photos link appears in nav
  - Navigation to photos page works
- [ ] 5.5 Test on mobile
  - Upload works on mobile
  - Drag-to-reorder works on mobile (or use alternative UI)
  - Gallery displays correctly

## 6. Polish

- [ ] 6.1 Add image optimization
  - Consider automatic image resizing on upload
  - Generate thumbnails for admin grid
  - Optimize for web display
- [ ] 6.2 Add helpful UI
  - Empty state with upload prompt
  - Upload guidelines (file types, size, dimensions)
  - Preview modal for larger view
- [ ] 6.3 Verify dark mode
  - Photos page works in dark mode
  - Gallery widget works in dark mode
