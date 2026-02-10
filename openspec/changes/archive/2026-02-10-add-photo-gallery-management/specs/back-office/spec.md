## ADDED Requirements

### Requirement: Photo Storage Table
The system SHALL provide a database table for storing choir photo metadata.

#### Scenario: Photos table exists
- **WHEN** the database is migrated
- **THEN** a `choir_photos` table is created
- **AND** the table has columns for image_url, caption, display_order, and timestamps

### Requirement: Photo Storage Bucket
The system SHALL provide cloud storage for photo files.

#### Scenario: Storage bucket configured
- **GIVEN** Supabase Storage is set up
- **WHEN** the storage bucket is created
- **THEN** a `choir-photos` bucket exists
- **AND** the bucket is publicly accessible
- **AND** the bucket accepts image files only

### Requirement: Photo Management Page
The admin SHALL provide a page to manage choir photos.

#### Scenario: Admin navigates to photos
- **GIVEN** an admin is logged in
- **WHEN** they navigate to /admin/photos
- **THEN** a photo management interface is displayed
- **AND** existing photos are shown in a grid
- **AND** an upload button is visible

### Requirement: Photo Upload
Admins SHALL be able to upload photos to the gallery.

#### Scenario: Admin uploads photo
- **GIVEN** an admin is on the photos page
- **WHEN** they select an image file and upload
- **THEN** the file is uploaded to Supabase Storage
- **AND** a database record is created
- **AND** a success message is displayed
- **AND** the photo appears in the grid

#### Scenario: File type validation
- **GIVEN** an admin attempts to upload a file
- **WHEN** the file is not an image (jpg, png, webp)
- **THEN** an error message is displayed
- **AND** the upload is rejected

#### Scenario: File size validation
- **GIVEN** an admin attempts to upload an image
- **WHEN** the file size exceeds 5MB
- **THEN** an error message is displayed
- **AND** the upload is rejected

### Requirement: Photo Deletion
Admins SHALL be able to delete photos from the gallery.

#### Scenario: Admin deletes photo
- **GIVEN** photos exist in the gallery
- **WHEN** an admin clicks delete on a photo
- **THEN** a confirmation dialog is shown
- **AND** upon confirmation, the photo is deleted from Storage
- **AND** the database record is deleted
- **AND** the photo is removed from the grid

### Requirement: Photo Reordering
Admins SHALL be able to reorder photos.

#### Scenario: Admin reorders photos
- **GIVEN** multiple photos exist
- **WHEN** an admin drags a photo to a new position
- **THEN** the display_order is updated
- **AND** the new order is persisted to the database
- **AND** the grid reflects the new order

#### Scenario: Display order maintained
- **GIVEN** photos have been reordered
- **WHEN** the admin refreshes the page
- **THEN** photos appear in the saved order

### Requirement: Photo Captions
Admins SHALL be able to add or edit photo captions.

#### Scenario: Admin adds caption
- **GIVEN** a photo without a caption
- **WHEN** an admin edits the caption
- **THEN** the caption is saved to the database
- **AND** the caption is displayed with the photo

#### Scenario: Caption optional
- **GIVEN** an admin uploads a photo
- **WHEN** they do not provide a caption
- **THEN** the photo is saved successfully
- **AND** no caption is displayed

### Requirement: Photos in Navigation
The admin navigation SHALL include a link to photo management.

#### Scenario: Photos link in nav
- **WHEN** an admin views the admin navigation
- **THEN** a "Photos" link is visible
- **AND** clicking it navigates to /admin/photos

### Requirement: Photo Gallery Display
The photo gallery widget SHALL display uploaded choir photos.

#### Scenario: Photos available
- **GIVEN** photos have been uploaded
- **WHEN** the photo gallery renders
- **THEN** up to 6 photos are displayed
- **AND** photos are shown in display_order
- **AND** photos use next/image for optimization

#### Scenario: No photos uploaded
- **GIVEN** no photos have been uploaded
- **WHEN** the photo gallery renders
- **THEN** skeleton placeholders are shown

#### Scenario: Captions displayed
- **GIVEN** photos have captions
- **WHEN** the photo gallery renders
- **THEN** captions are visible (on hover or below image)

#### Scenario: Responsive layout
- **GIVEN** the photo gallery is displayed
- **WHEN** viewed on mobile
- **THEN** photos display in 2 columns
- **WHEN** viewed on desktop
- **THEN** photos display in 3 columns

### Requirement: Image Optimization
Photos SHALL be optimized for web display.

#### Scenario: Next/image used
- **WHEN** photos are displayed on public site
- **THEN** next/image component is used
- **AND** images are lazy-loaded
- **AND** appropriate sizes are generated

### Requirement: Graceful Degradation
The photo gallery SHALL work with or without uploaded photos.

#### Scenario: No photos
- **GIVEN** no photos have been uploaded
- **WHEN** the public homepage loads
- **THEN** the photo gallery section still displays
- **AND** skeleton placeholders are shown
- **AND** no errors occur

#### Scenario: Partial photos
- **GIVEN** only 3 photos have been uploaded
- **WHEN** the photo gallery renders
- **THEN** 3 photos are displayed
- **AND** layout adapts to available photos
