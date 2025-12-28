# playlists Specification

## Purpose
TBD - created by archiving change define-playlists-scope. Update Purpose after archive.
## Requirements
### Requirement: Playlist Data Model
The system SHALL store playlists with name, optional description, and status.

#### Scenario: Create playlist with required fields
- **GIVEN** an admin is creating a new playlist
- **WHEN** they provide a name
- **THEN** the playlist is created with status "hidden" by default
- **AND** created_at and updated_at are set

#### Scenario: Create playlist with all fields
- **GIVEN** an admin is creating a new playlist
- **WHEN** they provide name, description, and status
- **THEN** the playlist is created with all provided values

### Requirement: Playlist Status
The system SHALL support four playlist statuses: visible, hidden, in_progress, archived.

#### Scenario: Visible playlist
- **GIVEN** a playlist with status "visible"
- **WHEN** a user accesses the public playlist page
- **THEN** the playlist is displayed

#### Scenario: Hidden playlist
- **GIVEN** a playlist with status "hidden"
- **WHEN** a user accesses the public playlist page
- **THEN** the system returns a 404 error

#### Scenario: In Progress playlist
- **GIVEN** a playlist with status "in_progress"
- **WHEN** a user accesses the public playlist page
- **THEN** the system returns a 404 error
- **AND** the playlist appears with a special badge in admin

#### Scenario: Archived playlist
- **GIVEN** a playlist with status "archived"
- **WHEN** a user accesses the public playlist page
- **THEN** the system returns a 404 error
- **AND** the playlist only appears in the admin archive section

### Requirement: Playlist-Song Relationship
The system SHALL support a many-to-many relationship between playlists and songs.

#### Scenario: Add song to playlist
- **GIVEN** an existing playlist and song
- **WHEN** an admin adds the song to the playlist
- **THEN** the song appears in the playlist
- **AND** the song is assigned the next available position

#### Scenario: Same song in multiple playlists
- **GIVEN** a song already in playlist A
- **WHEN** an admin adds the song to playlist B
- **THEN** the song appears in both playlists

#### Scenario: Song appears once per playlist
- **GIVEN** a song already in a playlist
- **WHEN** an admin tries to add the same song again
- **THEN** the system prevents the duplicate

### Requirement: Song Ordering
The system SHALL maintain song order within each playlist.

#### Scenario: Songs displayed in order
- **GIVEN** a playlist with songs at positions 1, 2, 3
- **WHEN** the playlist is displayed
- **THEN** songs appear in position order

#### Scenario: Reorder songs
- **GIVEN** a playlist with songs A(1), B(2), C(3)
- **WHEN** an admin moves song C to position 1
- **THEN** the order becomes C(1), A(2), B(3)

#### Scenario: New song added to end
- **GIVEN** a playlist with songs at positions 1, 2, 3
- **WHEN** an admin adds a new song
- **THEN** the new song is assigned position 4

### Requirement: Empty Playlists
The system SHALL allow playlists with zero songs.

#### Scenario: Create empty playlist
- **GIVEN** an admin is creating a new playlist
- **WHEN** they save without adding songs
- **THEN** the playlist is created successfully

### Requirement: Playlist Deletion
The system SHALL support soft delete (archive) and hard delete for playlists.

#### Scenario: Archive playlist
- **GIVEN** an existing playlist with songs
- **WHEN** an admin archives the playlist
- **THEN** the playlist status becomes "archived"
- **AND** the songs remain in the system unchanged

#### Scenario: Restore archived playlist
- **GIVEN** an archived playlist
- **WHEN** an admin restores the playlist
- **THEN** the playlist status becomes "hidden"
- **AND** all songs are still linked

#### Scenario: Permanently delete playlist
- **GIVEN** an archived playlist
- **WHEN** an admin permanently deletes it
- **THEN** the playlist is removed from the database
- **AND** the playlist-song links are removed
- **AND** the songs remain in the system

### Requirement: Admin Status Badge
The system SHALL display a distinct badge for each playlist status in admin.

#### Scenario: Visible status badge
- **GIVEN** a playlist with status "visible"
- **WHEN** displayed in admin list
- **THEN** a green "Visible" badge is shown

#### Scenario: Hidden status badge
- **GIVEN** a playlist with status "hidden"
- **WHEN** displayed in admin list
- **THEN** an orange "Hidden" badge is shown

#### Scenario: In Progress status badge
- **GIVEN** a playlist with status "in_progress"
- **WHEN** displayed in admin list
- **THEN** a blue "In Progress" badge is shown

### Requirement: Public Playlist Page
The system SHALL provide a public page for visible playlists.

#### Scenario: View visible playlist
- **GIVEN** a playlist with status "visible" and songs
- **WHEN** a user visits /playlist/[id]
- **THEN** the playlist name and description are displayed
- **AND** the songs are listed in order
- **AND** each song links to its lyrics page

#### Scenario: View non-visible playlist
- **GIVEN** a playlist with status other than "visible"
- **WHEN** a user visits /playlist/[id]
- **THEN** the system returns a 404 error

