## MODIFIED Requirements

### Requirement: Songs Data Model
The system SHALL support Songs as a core content entity with required and optional fields, stored in a Supabase database.

#### Scenario: Database schema
- **WHEN** the database is initialized
- **THEN** a songs table exists with fields: id, title, lyrics, artist_composer, language, genre, year, is_visible, is_archived, created_at, updated_at
- **AND** title and lyrics are NOT NULL constraints
- **AND** indexes exist on is_visible, title, artist_composer, and language

#### Scenario: Create song with required fields
- **WHEN** an admin creates a new song via the admin interface
- **THEN** the song is saved to the database with title and lyrics
- **AND** the song can optionally have artist/composer, language, genre, and year
- **AND** the song is created with is_visible=true and is_archived=false

### Requirement: Admin Songs List Interface
The system SHALL provide an admin interface for viewing and managing songs.

#### Scenario: View songs list
- **WHEN** an admin navigates to /admin/songs
- **THEN** they see a list of all non-archived songs
- **AND** the list displays title, artist, language, and visibility status
- **AND** the interface is mobile-first responsive

#### Scenario: Search songs
- **WHEN** an admin searches for songs by title
- **THEN** songs matching the search term are displayed
- **AND** the search is performed server-side using database queries

#### Scenario: Filter songs
- **WHEN** an admin filters songs by artist, language, or visibility status
- **THEN** only songs matching the filter criteria are displayed
- **AND** filters can be combined

### Requirement: Admin Song Form
The system SHALL provide forms for creating and editing songs.

#### Scenario: Create new song
- **WHEN** an admin navigates to /admin/songs/new
- **THEN** they see a form with fields: title (required), lyrics (required), artist/composer, language, genre, year
- **AND** the lyrics field is a textarea that preserves line breaks
- **AND** when submitted, the song is saved to the database

#### Scenario: Edit existing song
- **WHEN** an admin navigates to /admin/songs/[id]
- **THEN** they see a form pre-filled with the song's data
- **AND** they can modify any field
- **AND** when submitted, the song is updated in the database

#### Scenario: Copy/duplicate song
- **WHEN** an admin selects to duplicate a song
- **THEN** a new song is created with the same data
- **AND** the title has "Copy" appended
- **AND** the new song has is_visible=false by default
- **AND** the admin is redirected to edit the new song

### Requirement: Bulk Visibility Toggle
The system SHALL allow admins to toggle visibility for multiple songs at once.

#### Scenario: Bulk hide songs
- **WHEN** an admin selects multiple songs and toggles visibility to hidden
- **THEN** a confirmation dialog is shown
- **AND** when confirmed, all selected songs have is_visible set to false
- **AND** the songs are updated in the database

#### Scenario: Bulk show songs
- **WHEN** an admin selects multiple songs and toggles visibility to visible
- **THEN** a confirmation dialog is shown
- **AND** when confirmed, all selected songs have is_visible set to true
- **AND** the songs are updated in the database

### Requirement: Song Archive Management
The system SHALL support soft delete (archive) and hard delete for songs.

#### Scenario: Archive song
- **WHEN** an admin archives a song from the songs list
- **THEN** a confirmation alert is shown indicating the song will be removed from all playlists
- **AND** when confirmed, the song's is_archived is set to true
- **AND** the song no longer appears in the main songs list

#### Scenario: View archived songs
- **WHEN** an admin navigates to /admin/songs/archive
- **THEN** they see a list of all archived songs
- **AND** they can restore or permanently delete songs

#### Scenario: Restore archived song
- **WHEN** an admin restores a song from archive
- **THEN** the song's is_archived is set to false
- **AND** the song appears in the main songs list again

#### Scenario: Permanently delete archived song
- **WHEN** an admin permanently deletes a song from archive
- **THEN** a confirmation dialog is shown
- **AND** when confirmed, the song is permanently deleted from the database
- **AND** the song cannot be restored

### Requirement: Public Lyrics Display
The system SHALL display song lyrics on the public website with font size control.

#### Scenario: View song lyrics
- **WHEN** a user navigates to /song/[id]
- **THEN** they see the song title and lyrics
- **AND** line breaks are preserved and displayed
- **AND** double line breaks create paragraph/verse separations
- **AND** the interface is mobile-first responsive

#### Scenario: Adjust font size with slider
- **WHEN** a user views lyrics on the public website
- **THEN** they see a font size slider
- **AND** the slider range is 14px to 24px
- **AND** adjusting the slider changes the lyrics font size immediately
- **AND** font size applies to lyrics text only (not navigation, title, etc.)

#### Scenario: Font size persistence
- **WHEN** a user adjusts font size
- **THEN** the font size preference is stored in browser sessionStorage
- **AND** when the user navigates to another song, the font size preference is maintained
- **AND** the font size preference is cleared when the browser session ends

