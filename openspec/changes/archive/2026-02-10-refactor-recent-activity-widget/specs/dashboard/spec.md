## ADDED Requirements

### Requirement: Widget Height Consistency
The RecentActivity widget SHALL match the height of the EventCalendar widget when displayed side-by-side on large screens.

#### Scenario: Desktop layout
- **GIVEN** the admin dashboard is displayed on a large screen (lg breakpoint and above)
- **WHEN** the RecentActivity and EventCalendar widgets are rendered side-by-side
- **THEN** both widgets SHALL have equal heights
- **AND** the RecentActivity widget content SHALL be scrollable if it exceeds available space

### Requirement: Improved Tab Interface
The RecentActivity widget SHALL display tabs with improved visual design and clear active state indicators.

#### Scenario: Tab selection
- **GIVEN** the RecentActivity widget is displayed
- **WHEN** a user clicks on a different tab (Songs, Playlists, or Events)
- **THEN** the active tab SHALL have clear visual distinction (background color, border, or shadow)
- **AND** tab icons SHALL be visible on all screen sizes
- **AND** tab labels SHALL be responsive (full text on desktop, icons only on mobile if needed)
- **AND** the tab list SHALL have consistent styling with the rest of the dashboard

### Requirement: Consistent Activity Item Layout
All activity items across Songs, Playlists, and Events tabs SHALL display with a standardized, consistent layout structure.

#### Scenario: Songs tab items
- **GIVEN** the Songs tab is active
- **WHEN** song items are rendered
- **THEN** each item SHALL display: title on the first line
- **AND** the status badge SHALL appear inline with the title
- **AND** artist/subtitle SHALL appear on the second line with muted styling
- **AND** timestamp SHALL be right-aligned
- **AND** NO number prefix SHALL be displayed

#### Scenario: Playlists tab items
- **GIVEN** the Playlists tab is active
- **WHEN** playlist items are rendered
- **THEN** each item SHALL display: title on the first line
- **AND** the status badge SHALL appear inline with the title
- **AND** description SHALL appear on the second line with muted styling (if present)
- **AND** timestamp SHALL be right-aligned
- **AND** NO number prefix SHALL be displayed

#### Scenario: Events tab items
- **GIVEN** the Events tab is active
- **WHEN** event items are rendered
- **THEN** each item SHALL display: title on the first line
- **AND** the status badge SHALL appear inline with the title
- **AND** event date SHALL appear on the second line with muted styling
- **AND** timestamp SHALL be right-aligned
- **AND** NO number prefix SHALL be displayed

### Requirement: Standardized Item Spacing and Typography
Each activity item SHALL have consistent spacing, typography, and visual hierarchy.

#### Scenario: Activity item rendering
- **GIVEN** the RecentActivity widget displays a list of items
- **WHEN** items are rendered
- **THEN** each item SHALL have consistent padding (py-2 or py-3)
- **AND** the title SHALL have font-medium and text-sm styling
- **AND** subtitles SHALL have text-xs text-muted-foreground styling
- **AND** status badges SHALL be consistently sized (h-4 w-4 or similar)
- **AND** there SHALL be consistent gap between title and badge (gap-1.5)
- **AND** hover states SHALL provide clear visual feedback (bg-accent/50)

### Requirement: Consistent Status Badge Placement
Status badges SHALL be consistently positioned inline with the item title across all tabs.

#### Scenario: Badge positioning
- **GIVEN** any tab is active with visible items
- **WHEN** items with status badges are rendered
- **THEN** the status badge SHALL appear immediately after the title
- **AND** the badge SHALL be aligned with the title baseline
- **AND** the badge SHALL NOT appear on a separate line or at the start of the item

### Requirement: Empty State Improvement
The RecentActivity widget SHALL display improved empty states when no activity exists for a tab.

#### Scenario: Empty tab content
- **GIVEN** a tab has no items to display
- **WHEN** the tab is active
- **THEN** an informative empty state message SHALL be displayed
- **AND** the empty state SHALL include appropriate iconography (MusicIcon, ListMusicIcon, or CalendarIcon)
- **AND** the empty state SHALL maintain consistent spacing with the widget layout
- **AND** the empty state text SHALL be centered vertically within the available space

### Requirement: Mobile Responsiveness
The RecentActivity widget SHALL adapt gracefully to mobile screen sizes.

#### Scenario: Mobile viewport
- **GIVEN** the dashboard is viewed on a mobile device
- **WHEN** the RecentActivity widget renders
- **THEN** tabs SHALL remain accessible and usable
- **AND** content SHALL be readable without horizontal scrolling
- **AND** touch targets SHALL meet minimum size requirements (44px)
- **AND** timestamps MAY be hidden or abbreviated on very small screens
