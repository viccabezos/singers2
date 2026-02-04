# ui-library Spec Delta

## MODIFIED Requirements

### Requirement: Status Badge Component
The UI library SHALL provide a StatusBadge component that displays status indicators as icon-only badges with tooltips. The component SHALL use a simplified, consistent display across all screens.

#### Scenario: Icon-only display
- **WHEN** a StatusBadge is rendered
- **THEN** it displays only the status icon in a circular container
- **AND** the container is 24px in diameter
- **AND** the icon is 14px in size
- **AND** hovering shows the status label as a tooltip
- **AND** no text label is displayed

#### Scenario: All status variants
- **WHEN** any DashboardStatus is displayed
- **THEN** it uses the same icon-only format
- **AND** visible status shows EyeIcon with green background
- **AND** hidden status shows EyeOffIcon with red background
- **AND** in_progress status shows ClockIcon with blue background
- **AND** draft status shows FileEditIcon with amber background
- **AND** archived status shows ArchiveIcon with gray background
- **AND** current status shows StarIcon (outline) with amber background
- **AND** featured status shows StarIcon (filled) with yellow background
- **AND** past status shows HistoryIcon with gray background
- **AND** upcoming status shows CalendarIcon with blue background

#### Scenario: Tooltip accessibility
- **WHEN** a user hovers over a status badge
- **THEN** a tooltip displays the status label
- **AND** the tooltip uses the browser's native title attribute
- **AND** screen readers can access the status label

#### Scenario: Simplified API
- **WHEN** using StatusBadge component
- **THEN** only `status` and `className` props are needed
- **AND** `showIcon`, `compactOnMobile`, `iconOnly` props are removed
- **AND** `variant` prop is deprecated but still supported

### Requirement: Removed Components
The VisibilityBadge convenience component SHALL be removed from the UI library.

#### Scenario: Migration from VisibilityBadge
- **WHEN** code previously used VisibilityBadge
- **THEN** it uses StatusBadge with "visible" or "hidden" status instead
- **AND** the display remains icon-only with tooltip
