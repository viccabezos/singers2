# events Specification

## Purpose
TBD - created by archiving change define-events-scope. Update Purpose after archive.
## Requirements
### Requirement: Event Data Model
The system SHALL store events with name, optional description, date, optional time, optional place, and visibility settings.

#### Scenario: Create event with required fields
- **GIVEN** an admin is creating a new event
- **WHEN** they provide a name and date
- **THEN** the event is created with is_visible=false, is_current=false, is_archived=false by default

#### Scenario: Create event with all fields
- **GIVEN** an admin is creating a new event
- **WHEN** they provide name, description, date, time, and place
- **THEN** the event is created with all provided values

### Requirement: Event Visibility
The system SHALL support visibility control for events.

#### Scenario: Visible event
- **GIVEN** an event with is_visible=true and is_archived=false
- **AND** the event date is within the past 14 days or in the future
- **WHEN** a user accesses the public event page
- **THEN** the event is displayed

#### Scenario: Hidden event
- **GIVEN** an event with is_visible=false
- **WHEN** a user accesses the public event page
- **THEN** the system returns a 404 error

#### Scenario: Past event grace period
- **GIVEN** an event with is_visible=true
- **AND** the event date is more than 14 days in the past
- **WHEN** a user accesses the public event page
- **THEN** the system returns a 404 error

### Requirement: Event-Playlist Relationship
The system SHALL support a many-to-many relationship between events and playlists.

#### Scenario: Add playlist to event
- **GIVEN** an existing event and playlist
- **WHEN** an admin adds the playlist to the event
- **THEN** the playlist appears in the event
- **AND** the playlist is assigned the next available position

#### Scenario: Same playlist in multiple events
- **GIVEN** a playlist already in event A
- **WHEN** an admin adds the playlist to event B
- **THEN** the playlist appears in both events

#### Scenario: Playlist appears once per event
- **GIVEN** a playlist already in an event
- **WHEN** an admin tries to add the same playlist again
- **THEN** the system prevents the duplicate

### Requirement: Playlist Ordering in Events
The system SHALL maintain playlist order within each event.

#### Scenario: Playlists displayed in order
- **GIVEN** an event with playlists at positions 1, 2, 3
- **WHEN** the event is displayed
- **THEN** playlists appear in position order

#### Scenario: Reorder playlists
- **GIVEN** an event with playlists A(1), B(2), C(3)
- **WHEN** an admin moves playlist C to position 1
- **THEN** the order becomes C(1), A(2), B(3)

### Requirement: Event Archive
The system SHALL support soft delete (archive) for events.

#### Scenario: Archive event
- **GIVEN** an existing event with playlists
- **WHEN** an admin archives the event
- **THEN** the event is_archived becomes true
- **AND** the playlists remain in the system unchanged

#### Scenario: Restore archived event
- **GIVEN** an archived event
- **WHEN** an admin restores the event
- **THEN** the event is_archived becomes false
- **AND** all playlists are still linked

#### Scenario: Permanently delete event
- **GIVEN** an archived event
- **WHEN** an admin permanently deletes it
- **THEN** the event is removed from the database
- **AND** the event-playlist links are removed
- **AND** the playlists remain in the system

### Requirement: Current Event Selection
The system SHALL support automatic and manual current event selection.

#### Scenario: Auto-select current event
- **GIVEN** multiple visible events with future dates
- **AND** no event has is_current=true
- **WHEN** the system determines the current event
- **THEN** the closest upcoming event is selected

#### Scenario: Manual current event override
- **GIVEN** an admin sets is_current=true on an event
- **WHEN** the system determines the current event
- **THEN** the manually selected event is returned
- **AND** auto-selection is bypassed

#### Scenario: Only one current event
- **GIVEN** event A has is_current=true
- **WHEN** an admin sets is_current=true on event B
- **THEN** event A's is_current becomes false
- **AND** event B's is_current becomes true

### Requirement: Past Event Auto-Hide
The system SHALL automatically hide events more than 14 days past their date.

#### Scenario: Event within grace period
- **GIVEN** an event with date 10 days ago
- **AND** is_visible=true
- **WHEN** a user accesses the public event page
- **THEN** the event is displayed

#### Scenario: Event past grace period
- **GIVEN** an event with date 15 days ago
- **AND** is_visible=true
- **WHEN** a user accesses the public event page
- **THEN** the system returns a 404 error

### Requirement: Public Event Page
The system SHALL provide a public page for visible events.

#### Scenario: View visible event
- **GIVEN** a visible event with playlists
- **WHEN** a user visits /event/[id]
- **THEN** the event name, description, date, time, and place are displayed
- **AND** the playlists are listed in order
- **AND** each playlist links to its public page

