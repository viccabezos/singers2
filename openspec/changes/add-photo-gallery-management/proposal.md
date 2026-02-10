# Change: Add Photo Gallery Management

## Why

The public homepage includes a photo gallery widget that currently shows skeleton/placeholder images. To make the site more engaging and showcase the choir, we need:
- Database storage for photo metadata (URL, caption, display order)
- Supabase Storage integration for actual image files
- Admin interface to upload, manage, and reorder photos
- Integration to display real photos in the photo gallery widget

This allows choir administrators to upload and manage photos without needing file system access or deployments.

## What Changes

### Database Schema
- **New table**: `choir_photos`
  - `id` (uuid, primary key)
  - `image_url` (text) - Supabase Storage URL
  - `caption` (text, nullable) - Optional photo caption
  - `display_order` (integer) - Order for display (1, 2, 3...)
  - `created_at`, `updated_at` (timestamps)

### Supabase Storage
- **New bucket**: `choir-photos` (public bucket for images)
- Image upload with optimization recommendations
- Allowed file types: JPG, PNG, WebP
- Max file size: 5MB

### Admin Interface
- **New page**: `/admin/photos`
  - Photo grid showing all uploaded photos
  - Upload button (opens file picker)
  - Drag-to-reorder functionality
  - Delete button on each photo
  - Edit caption inline or via modal
- **Navigation**: Add "Photos" link to admin nav

### Shared Library
- **New file**: `shared/lib/photos.ts`
  - `getPhotos()` - Fetch all photos ordered by display_order
  - `uploadPhoto()` - Upload to Supabase Storage and create DB record
  - `deletePhoto()` - Delete from storage and database
  - `reorderPhotos()` - Update display_order for multiple photos
  - `updatePhotoCaption()` - Update caption
- **Update**: `shared/types/` - Add Photo type

### Widget Integration
- Update `photo-gallery` widget to fetch and display real photos
- Use next/image for optimization
- Show captions on hover or below images
- Limit to 6 photos (most recent or best display_order)

## Impact

### Affected Specs
- **back-office**: Add photo management requirements
- **public-website**: Update photo gallery to use real photos

### Affected Code
- `/app/(admin)/admin/photos/page.tsx` - New photos management page
- `/app/(admin)/admin/photos/photo-upload.tsx` - Upload component
- `/app/(admin)/admin/photos/photo-list.tsx` - Display and reorder
- `/app/(admin)/admin/photos/actions.ts` - Server actions
- `/widgets/admin-nav/` - Add photos link
- `/widgets/photo-gallery/photo-gallery.tsx` - Fetch and display real photos
- `/shared/lib/photos.ts` - New library file
- `/shared/types/photo.ts` - New type definitions
- `supabase/migrations/` - New migration file
- Supabase Storage bucket configuration

### Database Schema Changes
- New `choir_photos` table
- New `choir-photos` Supabase Storage bucket (public)

### Migration Considerations
- Migration creates table
- Bucket must be created manually in Supabase Dashboard (one-time setup)
- All photos optional (graceful degradation if none uploaded)
- Widget falls back to skeletons if no photos

### User Impact
- **Admins**: New photo management interface
- **Public users**: See real choir photos instead of skeletons
- **No disruption**: Site works with or without photos
