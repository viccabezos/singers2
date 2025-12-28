## ADDED Requirements

### Requirement: Songs Data Model
The system SHALL support Songs as a core content entity with required and optional fields.

#### Scenario: Create song with required fields
- **WHEN** an admin creates a new song
- **THEN** the song MUST have a title
- **AND** the song MUST have lyrics
- **AND** the song can optionally have artist/composer, language, genre, and year

#### Scenario: Create song with optional fields
- **WHEN** an admin creates a song
- **THEN** they can optionally add artist/composer
- **AND** they can optionally add language
- **AND** they can optionally add genre
- **AND** they can optionally add year

### Requirement: Lyrics Storage Format
The system SHALL store lyrics as plain text with preserved line breaks.

#### Scenario: Paste lyrics from external source
- **WHEN** an admin pastes lyrics from an internet source into the lyrics field
- **THEN** all line breaks are preserved
- **AND** double line breaks create paragraph/verse separations
- **AND** single line breaks create new lines within verses

#### Scenario: Display lyrics
- **WHEN** lyrics are displayed on the public website
- **THEN** line breaks are rendered as displayed
- **AND** verses are naturally separated by blank lines (double line breaks)

### Requirement: Song Copy/Duplicate
The system SHALL allow admins to copy/duplicate existing songs.

#### Scenario: Duplicate song
- **WHEN** an admin selects to duplicate a song
- **THEN** a new song is created with the same title (with "Copy" suffix), artist, lyrics, and metadata
- **AND** the new song has visibility set to hidden by default
- **AND** the admin can edit the duplicated song

### Requirement: Song Search and Filter
The system SHALL provide search and filter capabilities for songs in the admin interface.

#### Scenario: Search songs by title
- **WHEN** an admin searches for songs by title
- **THEN** songs matching the search term are displayed

#### Scenario: Filter songs by artist
- **WHEN** an admin filters songs by artist
- **THEN** only songs with matching artist are displayed

#### Scenario: Filter songs by language
- **WHEN** an admin filters songs by language
- **THEN** only songs with matching language are displayed

#### Scenario: Filter songs by visibility status
- **WHEN** an admin filters songs by visibility status
- **THEN** only songs with matching visibility status (visible/hidden) are displayed

### Requirement: Bulk Visibility Toggle
The system SHALL allow admins to toggle visibility for multiple songs at once.

#### Scenario: Bulk hide songs
- **WHEN** an admin selects multiple songs and toggles visibility to hidden
- **THEN** a confirmation dialog is shown
- **AND** when confirmed, all selected songs are set to hidden
- **AND** hidden songs do not appear on the public website

#### Scenario: Bulk show songs
- **WHEN** an admin selects multiple songs and toggles visibility to visible
- **THEN** a confirmation dialog is shown
- **AND** when confirmed, all selected songs are set to visible
- **AND** visible songs appear on the public website

### Requirement: Song Visibility
The system SHALL support show/hide visibility toggle for songs.

#### Scenario: Hide song
- **WHEN** an admin hides a song
- **THEN** the song does not appear in any playlist on the public website
- **AND** the song appears greyed out in admin playlists for editing/preview purposes

#### Scenario: Show song
- **WHEN** an admin shows a song
- **THEN** the song appears in playlists on the public website (if playlist is visible)

### Requirement: Song Deletion from Songs List
The system SHALL support soft delete (archive) and hard delete for songs.

#### Scenario: Delete song from songs list
- **WHEN** an admin deletes a song from the songs list
- **THEN** a confirmation alert is shown indicating the song will be removed from all playlists
- **AND** when confirmed, the song is archived (soft delete)
- **AND** the song is removed from all playlists
- **AND** the song can be restored from the archive

#### Scenario: Permanently delete archived song
- **WHEN** an admin permanently deletes a song from the archive
- **THEN** a confirmation dialog is shown
- **AND** when confirmed, the song is permanently deleted from the system
- **AND** the song cannot be restored

### Requirement: Song Deletion from Playlist
The system SHALL allow removing songs from playlists without deleting the song.

#### Scenario: Remove song from playlist
- **WHEN** an admin removes a song from a playlist
- **THEN** the song is removed from that playlist only
- **AND** the song remains in the songs list
- **AND** the song remains in other playlists (if present)

### Requirement: Songs Relationships
The system SHALL support songs belonging to multiple playlists.

#### Scenario: Song in multiple playlists
- **WHEN** a song exists
- **THEN** it can be added to multiple playlists
- **AND** changes to the song (title, lyrics, etc.) are reflected in all playlists containing it
- **AND** visibility changes affect the song in all playlists

### Requirement: Lyrics Font Size Control
The system SHALL provide font size control for lyrics display on the public website.

#### Scenario: Adjust font size with slider
- **WHEN** a user views lyrics on the public website
- **THEN** they can adjust font size using a slider
- **AND** the font size range is 14px to 24px
- **AND** font size applies to lyrics text only (not navigation, title, etc.)

#### Scenario: Font size persistence
- **WHEN** a user adjusts font size
- **THEN** the font size preference is stored in browser session
- **AND** when the user navigates to another song, the font size preference is maintained
- **AND** the font size preference is cleared when the browser session ends
