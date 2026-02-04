# ui-library Spec Delta

## MODIFIED Requirements

### Requirement: Status Badge Component
The UI library SHALL provide a StatusBadge component that displays status indicators using a unified status system. The component SHALL support all entity statuses across the dashboard (songs, playlists, events) with consistent visual styling.

#### Scenario: Unified status type
- **WHEN** the StatusBadge component is used
- **THEN** it accepts a unified `DashboardStatus` type
- **AND** the type includes: visible, hidden, in_progress, draft, archived, current, past, upcoming
- **AND** each status has consistent colors and icons

#### Scenario: Entity-to-status mapping
- **WHEN** displaying status for a song
- **THEN** the `getSongStatus()` helper converts `is_visible` and `is_archived` to DashboardStatus
- **WHEN** displaying status for a playlist
- **THEN** the `getPlaylistStatus()` helper returns the playlist status directly
- **WHEN** displaying status for an event
- **THEN** the `getEventStatus()` helper converts boolean flags and date to DashboardStatus

#### Scenario: Status badge variants
- **WHEN** status is "visible"
- **THEN** badge shows green background with EyeIcon
- **WHEN** status is "hidden"
- **THEN** badge shows red/orange background with EyeOffIcon
- **WHEN** status is "in_progress"
- **THEN** badge shows blue background with Clock icon
- **WHEN** status is "draft"
- **THEN** badge shows amber background with FileEdit icon
- **WHEN** status is "archived"
- **THEN** badge shows gray background with Archive icon
- **WHEN** status is "current"
- **THEN** badge shows amber background with StarIcon
- **WHEN** status is "past"
- **THEN** badge shows gray background with History icon

#### Scenario: Icon-only mode
- **WHEN** iconOnly prop is true
- **THEN** only the icon is displayed in a circular container
- **AND** the status label is available as a tooltip
- **AND** this mode works for visibility-related statuses

#### Scenario: Backward compatibility
- **WHEN** legacy props (variant, isVisible) are used
- **THEN** the component still renders correctly
- **AND** a deprecation warning is logged in development
- **AND** the new `status` prop is preferred

### Requirement: Status Helper Functions
The shared library SHALL provide helper functions to convert entity state to DashboardStatus for consistent status display across the application.

#### Scenario: Song status helper
- **WHEN** `getSongStatus(song)` is called
- **THEN** it returns "archived" if `is_archived` is true
- **AND** it returns "visible" if `is_visible` is true
- **AND** it returns "hidden" if `is_visible` is false

#### Scenario: Playlist status helper
- **WHEN** `getPlaylistStatus(playlist)` is called
- **THEN** it returns the playlist's status directly
- **AND** the status is one of: visible, hidden, in_progress, archived

#### Scenario: Event status helper
- **WHEN** `getEventStatus(event)` is called
- **THEN** it returns "archived" if `is_archived` is true
- **AND** it returns "current" if `is_current` is true
- **AND** it returns "past" if event date is in the past
- **AND** it returns "visible" or "hidden" based on `is_visible`

#### Scenario: Helper function exports
- **WHEN** status helpers are needed
- **THEN** they are exported from `shared/lib/status-helpers`
- **AND** they are fully typed with TypeScript
- **AND** they include JSDoc documentation
