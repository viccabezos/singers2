# ui-feedback Specification

## Purpose
TBD - created by archiving change add-sonner-toasts. Update Purpose after archive.
## Requirements
### Requirement: Toast Notifications for CRUD Operations
The system SHALL provide toast notifications for all song CRUD operations to give users immediate feedback.

#### Scenario: Create song success
- **WHEN** an admin successfully creates a song
- **THEN** a success toast notification appears
- **AND** the toast displays "Song created successfully"
- **AND** the toast disappears after 3 seconds

#### Scenario: Create song error
- **WHEN** an admin fails to create a song
- **THEN** an error toast notification appears
- **AND** the toast displays the error message
- **AND** the toast disappears after 5 seconds

#### Scenario: Update song success
- **WHEN** an admin successfully updates a song
- **THEN** a success toast notification appears
- **AND** the toast displays "Song updated successfully"
- **AND** the toast disappears after 3 seconds

#### Scenario: Archive song success
- **WHEN** an admin successfully archives a song
- **THEN** a success toast notification appears
- **AND** the toast displays "Song archived successfully"
- **AND** the toast disappears after 3 seconds

#### Scenario: Restore song success
- **WHEN** an admin successfully restores a song from archive
- **THEN** a success toast notification appears
- **AND** the toast displays "Song restored successfully"
- **AND** the toast disappears after 3 seconds

#### Scenario: Delete song success
- **WHEN** an admin successfully permanently deletes a song
- **THEN** a success toast notification appears
- **AND** the toast displays "Song deleted permanently"
- **AND** the toast disappears after 3 seconds

#### Scenario: Bulk visibility toggle success
- **WHEN** an admin successfully toggles visibility for multiple songs
- **THEN** a success toast notification appears
- **AND** the toast displays "[N] song(s) visibility updated"
- **AND** the toast disappears after 3 seconds

#### Scenario: Duplicate song success
- **WHEN** an admin successfully duplicates a song
- **THEN** a success toast notification appears
- **AND** the toast displays "Song duplicated successfully"
- **AND** the toast disappears after 3 seconds

### Requirement: Toast Positioning
The system SHALL position toast notifications appropriately for mobile and desktop devices.

#### Scenario: Desktop toast positioning
- **WHEN** a toast notification appears on desktop
- **THEN** it appears in the bottom-right corner
- **AND** it does not interfere with the UI

#### Scenario: Mobile toast positioning
- **WHEN** a toast notification appears on mobile
- **THEN** it appears in the bottom-center
- **AND** it is easily dismissible
- **AND** it does not interfere with mobile UI elements

### Requirement: Toast Accessibility
The system SHALL ensure toast notifications are accessible.

#### Scenario: Screen reader support
- **WHEN** a toast notification appears
- **THEN** it is announced to screen readers
- **AND** it includes appropriate ARIA attributes

