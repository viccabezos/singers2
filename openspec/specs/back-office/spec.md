# back-office Specification

## Purpose
TBD - created by archiving change define-project-structure. Update Purpose after archive.
## Requirements
### Requirement: Back Office Application
The system SHALL provide a private back office application for content management, built with Next.js, Tailwind CSS, and shadcn components.

#### Scenario: Admin access
- **WHEN** an admin accesses back office routes
- **THEN** they must authenticate with the single password

#### Scenario: Content management
- **WHEN** an authenticated admin accesses the back office
- **THEN** they can manage website content

### Requirement: Back Office Routing
The back office SHALL use Next.js App Router with routes organized under the `(admin)` route group with `/admin/*` URL prefix.

#### Scenario: Admin route access
- **WHEN** an admin navigates to `/admin` or admin routes
- **THEN** authentication is required before access is granted

#### Scenario: Protected routes
- **WHEN** an unauthenticated user attempts to access admin routes
- **THEN** they are redirected to the login page

### Requirement: Mobile-First Back Office
The back office application SHALL be designed and developed using a mobile-first approach.

#### Scenario: Mobile-first admin interface
- **WHEN** an admin accesses the back office on a mobile device
- **THEN** the interface is optimized for mobile viewing and interaction
- **WHEN** an admin accesses the back office on a tablet or desktop
- **THEN** the interface progressively enhances with additional features and layout improvements
- **AND** all responsive adaptations use Tailwind CSS mobile-first breakpoints

### Requirement: Dashboard Event Calendar
The back office dashboard SHALL display an event calendar using shadcn Calendar component with custom day rendering and a monthly event list sidebar. The dashboard layout SHALL prioritize main content widgets over informational notices.

#### Scenario: Dashboard layout order
- **WHEN** an admin views the dashboard
- **THEN** navigation cards are displayed at the top
- **AND** the Recent Activity widget and Event Calendar are displayed below navigation cards
- **AND** any informational notices (such as unpublished items alert) are displayed at the bottom of the dashboard
- **AND** the layout maintains visual hierarchy from actionable to informational content

#### Scenario: Calendar displays events with color coding
- **WHEN** an admin views the dashboard
- **THEN** a monthly calendar is displayed showing the current month
- **AND** today is always highlighted with primary color
- **AND** dates with upcoming events display a blue background
- **AND** dates with past events display a grey/muted background
- **AND** the calendar uses French locale for month and day names

#### Scenario: Event navigation from calendar
- **WHEN** an admin clicks on a date that has an event
- **THEN** they are navigated to the event detail page
- **WHEN** an admin clicks on a date without events
- **THEN** they are navigated to the new event form with the date pre-filled

#### Scenario: Month navigation
- **WHEN** an admin uses the calendar navigation controls
- **THEN** they can navigate to previous and next months
- **AND** event indicators update to reflect events in the displayed month

#### Scenario: Monthly event list
- **WHEN** an admin views the dashboard
- **THEN** a sidebar displays all events for the currently selected month
- **AND** events are sorted with today's events first, then upcoming, then past
- **AND** each event shows name, description, date, time, and location
- **AND** clicking an event navigates to its detail page
- **AND** a chevron icon appears on hover to indicate clickability

#### Scenario: Mobile calendar display
- **WHEN** an admin views the dashboard on a mobile device
- **THEN** the calendar and event list stack vertically
- **AND** touch interactions work correctly for navigation and event selection

### Requirement: Persistent Admin Navigation
The back office SHALL provide persistent navigation via a sidebar on desktop/tablet and a bottom drawer on mobile. The primary focus  navigation is on MOBILE as it is the one that will be used the most .

#### Scenario: Desktop sidebar navigation
- **WHEN** an admin views any admin page on desktop or tablet
- **THEN** a collapsible sidebar is displayed on the left
- **AND** the sidebar contains links to Dashboard, Songs, Playlists, and Events
- **AND** the sidebar contains quick actions for creating new content
- **AND** the sidebar can be collapsed to icon-only mode

#### Scenario: Mobile drawer navigation
- **WHEN** an admin views any admin page on mobile
- **THEN** a floating action button is displayed in the bottom-right corner
- **AND** tapping the button opens a bottom drawer with navigation options
- **AND** the drawer contains quick actions and main navigation links
- **AND** the drawer contains a logout link

#### Scenario: Navigation excluded from auth pages
- **WHEN** an admin is on the login or logout page
- **THEN** the navigation sidebar/drawer is not displayed
- **AND** only the page content is shown

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

### Requirement: Choir Settings Table
The system SHALL provide a database table for storing choir settings.

#### Scenario: Settings table exists
- **WHEN** the database is migrated
- **THEN** a `choir_settings` table is created
- **AND** the table has columns for tagline, about_text, social URLs, and contact email
- **AND** a single row with id=1 is seeded

#### Scenario: Singleton pattern enforced
- **GIVEN** the choir_settings table exists
- **WHEN** attempting to insert a row with id != 1
- **THEN** the database rejects the insert
- **AND** only one settings row can exist

### Requirement: Settings Management Page
The admin SHALL provide a page to manage choir settings.

#### Scenario: Admin navigates to settings
- **GIVEN** an admin is logged in
- **WHEN** they navigate to /admin/settings
- **THEN** a settings form is displayed
- **AND** current settings are pre-populated in the form

#### Scenario: Admin updates settings
- **GIVEN** an admin is on the settings page
- **WHEN** they update fields and click save
- **THEN** settings are saved to database
- **AND** a success message is displayed
- **AND** the form shows updated values

#### Scenario: Validation errors
- **GIVEN** an admin enters invalid data
- **WHEN** they submit the form
- **THEN** validation errors are displayed
- **AND** settings are not saved
- **AND** the form retains entered values

### Requirement: Settings in Admin Navigation
The admin navigation SHALL include a link to settings.

#### Scenario: Settings link in nav
- **WHEN** an admin views the admin navigation
- **THEN** a "Settings" link is visible
- **AND** clicking it navigates to /admin/settings

### Requirement: Dynamic Hero Section
The hero section SHALL display choir-configured tagline.

#### Scenario: Tagline configured
- **GIVEN** a tagline is set in choir settings
- **WHEN** the hero section renders
- **THEN** the configured tagline is displayed

#### Scenario: No tagline configured
- **GIVEN** no tagline is set in choir settings
- **WHEN** the hero section renders
- **THEN** a default tagline is displayed

### Requirement: Dynamic About Section
The about section SHALL display choir-configured about text.

#### Scenario: About text configured
- **GIVEN** about text is set in choir settings
- **WHEN** the about section renders
- **THEN** the configured text is displayed
- **AND** line breaks are preserved

#### Scenario: No about text configured
- **GIVEN** no about text is set in choir settings
- **WHEN** the about section renders
- **THEN** placeholder text is displayed

### Requirement: Dynamic Social Links
The footer SHALL display configured social media links.

#### Scenario: Social URLs configured
- **GIVEN** social media URLs are set in choir settings
- **WHEN** the footer renders
- **THEN** social media icons are displayed
- **AND** clicking an icon navigates to the configured URL

#### Scenario: Social URL not configured
- **GIVEN** a social media URL is not set
- **WHEN** the footer renders
- **THEN** the corresponding icon is hidden

#### Scenario: All social URLs empty
- **GIVEN** no social media URLs are set
- **WHEN** the footer renders
- **THEN** the social media section is hidden

### Requirement: Dynamic Contact Email
The CTA section SHALL use configured contact email.

#### Scenario: Contact email configured
- **GIVEN** contact email is set in choir settings
- **WHEN** the CTA section renders
- **THEN** the "Join the Choir" button uses the configured email
- **AND** clicking opens email client with configured address

#### Scenario: No contact email configured
- **GIVEN** contact email is not set
- **WHEN** the CTA section renders
- **THEN** a placeholder email is used

### Requirement: Settings Form Validation
The settings form SHALL validate user input.

#### Scenario: URL validation
- **GIVEN** an admin enters a social media URL
- **WHEN** the URL is not valid format
- **THEN** a validation error is shown
- **AND** the form cannot be submitted

#### Scenario: Email validation
- **GIVEN** an admin enters a contact email
- **WHEN** the email is not valid format
- **THEN** a validation error is shown
- **AND** the form cannot be submitted

#### Scenario: Optional fields
- **GIVEN** an admin leaves optional fields empty
- **WHEN** they submit the form
- **THEN** the form is accepted
- **AND** empty values are saved

### Requirement: Settings Graceful Degradation
Widgets SHALL gracefully handle missing or empty choir settings data.

#### Scenario: Settings not loaded
- **GIVEN** settings cannot be fetched from database
- **WHEN** a widget renders
- **THEN** placeholder/default content is shown
- **AND** no errors are displayed to the user

#### Scenario: Empty settings
- **GIVEN** all settings fields are empty
- **WHEN** widgets render
- **THEN** default/placeholder content is shown
- **AND** the site remains functional

