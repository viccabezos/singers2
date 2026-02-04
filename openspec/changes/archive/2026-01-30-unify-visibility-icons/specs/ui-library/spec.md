# ui-library Spec Delta

## MODIFIED Requirements

### Requirement: Status Badge Component
The UI library SHALL provide a StatusBadge component that displays status indicators with consistent styling across the application. For visibility states (visible/hidden), the component SHALL support an icon-only mode that matches the events page implementation.

#### Scenario: Icon-only visibility badge
- **WHEN** a visibility status needs to be displayed in a list or table
- **THEN** the StatusBadge component can render as icon-only
- **AND** visible status shows an EyeIcon with green background
- **AND** hidden status shows an EyeOffIcon with red/orange background
- **AND** the icon is displayed in a circular container
- **AND** a tooltip shows the status label on hover

#### Scenario: Responsive visibility badge
- **WHEN** the StatusBadge is used with compactOnMobile prop
- **THEN** on mobile screens, it displays icon-only
- **AND** on desktop screens, it displays the full badge with icon and text
- **AND** the styling matches the events page implementation

#### Scenario: Mixed status types in playlists
- **WHEN** a playlist list displays multiple status types
- **THEN** visibility states (visible/hidden) use icon-only indicators
- **AND** non-visibility states (in_progress, archived) use text badges
- **AND** all indicators maintain consistent sizing and alignment

#### Scenario: Accessibility for icon-only badges
- **WHEN** an icon-only status badge is rendered
- **THEN** it includes a title attribute for tooltip
- **AND** screen readers can access the status label
- **AND** the icon has appropriate aria-label

### Requirement: Visibility Badge Component
The UI library SHALL provide a VisibilityBadge component that wraps StatusBadge for boolean visibility states. The component SHALL default to icon-only mode for consistency with the events page.

#### Scenario: Boolean visibility display
- **WHEN** displaying a boolean is_visible property
- **THEN** VisibilityBadge shows EyeIcon for true (visible)
- **AND** EyeOffIcon for false (hidden)
- **AND** uses the same styling as the events page
- **AND** supports compactOnMobile prop for responsive behavior
