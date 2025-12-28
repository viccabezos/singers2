# Change: Add Sonner Toast Notifications for CRUD Operations

## Why
Users need visual feedback when performing CRUD operations (create, update, delete) on songs. Toast notifications provide clear, non-intrusive feedback for success and error states.

## What Changes
- Install and configure Sonner (shadcn toast component)
- Add toast provider to root layout
- Add success/error toasts for all song CRUD operations:
  - Create song
  - Update song
  - Delete/archive song
  - Restore song
  - Bulk visibility toggle
  - Duplicate song
- Ensure toasts are mobile-first and accessible

## Impact
- Affected specs: `ui-feedback` (new capability)
- Affected code: Root layout, all admin song pages, song form, archive page, bulk operations
- User experience: Improved feedback for all admin actions

