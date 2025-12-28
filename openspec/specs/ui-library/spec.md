# ui-library Specification

## Purpose
TBD - created by archiving change refactor-shadcn-ui-library. Update Purpose after archive.
## Requirements
### Requirement: shadcn Base Components
The system SHALL include shadcn/ui base components installed via CLI for consistent, accessible UI primitives.

#### Scenario: Required shadcn components installed
- **WHEN** the UI library is set up
- **THEN** the following shadcn components SHALL be available in `components/ui/`:
  - Button (primary, secondary, destructive, ghost variants)
  - Input (text input with consistent styling)
  - Textarea (multi-line text input)
  - Select (dropdown selection)
  - Checkbox (toggle selection)
  - Card (container with header/content/footer)
  - Badge (status indicators)
  - Table (data display)
  - Dialog (modal confirmations)

### Requirement: Admin Page Layout Component
The system SHALL provide an `AdminPageLayout` component that standardizes page structure across all admin pages.

#### Scenario: Page layout with breadcrumbs and header
- **WHEN** an admin page renders
- **THEN** it SHALL display:
  - Breadcrumb navigation at the top
  - Page title (h1)
  - Optional description text
  - Optional primary action button (e.g., "Add New")
  - Content area for page-specific content

#### Scenario: Mobile-first responsive layout
- **WHEN** the page is viewed on mobile
- **THEN** the layout SHALL:
  - Stack header elements vertically
  - Use full-width action buttons
  - Maintain readable typography

### Requirement: Data Table Component
The system SHALL provide a generic `DataTable` component for displaying entity lists with consistent styling and behavior.

#### Scenario: Table with configurable columns
- **WHEN** a data table is rendered
- **THEN** it SHALL accept a columns configuration array defining:
  - Column header text
  - Data accessor or custom render function
  - Column width/span
  - Mobile visibility (show/hide on small screens)

#### Scenario: Selectable rows for bulk actions
- **WHEN** the table has bulk actions enabled
- **THEN** it SHALL:
  - Display a checkbox column
  - Support select all / deselect all
  - Track selected item IDs
  - Expose selection state to parent component

#### Scenario: Empty state display
- **WHEN** the data array is empty
- **THEN** the table SHALL display an empty state with:
  - Optional icon
  - "No items found" message
  - Optional call-to-action button

#### Scenario: Responsive table layout
- **WHEN** viewed on mobile
- **THEN** the table SHALL:
  - Hide non-essential columns
  - Stack row content vertically if needed
  - Maintain touch-friendly tap targets

### Requirement: Filter Panel Component
The system SHALL provide a `FilterPanel` component for configurable search and filter controls.

#### Scenario: Filter panel with search and dropdowns
- **WHEN** a filter panel is rendered
- **THEN** it SHALL accept a filters configuration defining:
  - Search input with label and placeholder
  - Select dropdowns with options
  - Apply button to trigger filtering

#### Scenario: Filter state management
- **WHEN** filters are applied
- **THEN** the component SHALL:
  - Call an onApply callback with current filter values
  - Support controlled filter state from parent

### Requirement: Status Badge Component
The system SHALL provide a `StatusBadge` component for displaying visibility and status indicators.

#### Scenario: Visibility badge variants
- **WHEN** displaying visibility status
- **THEN** the badge SHALL render:
  - "Visible" with green styling when visible
  - "Hidden" with orange/amber styling when hidden

#### Scenario: Playlist status badge variants
- **WHEN** displaying playlist status
- **THEN** the badge SHALL render appropriate styling for:
  - "Visible" (green)
  - "Hidden" (orange)
  - "In Progress" (blue)
  - "Archived" (gray)

#### Scenario: Badge with optional icon
- **WHEN** an icon is specified
- **THEN** the badge SHALL display the icon before the label text

### Requirement: Action Buttons Component
The system SHALL provide an `ActionButtons` component for consistent row-level actions.

#### Scenario: Standard action button set
- **WHEN** action buttons are rendered
- **THEN** they SHALL support common actions:
  - Edit (navigates to edit page)
  - Delete/Archive (triggers confirmation and action)
  - Custom actions via render prop

#### Scenario: Destructive action confirmation
- **WHEN** a destructive action (delete/archive) is triggered
- **THEN** the system SHALL:
  - Show a confirmation dialog
  - Require explicit confirmation before proceeding

### Requirement: Empty State Component
The system SHALL provide an `EmptyState` component for consistent "no data" displays.

#### Scenario: Empty state with icon and message
- **WHEN** an empty state is rendered
- **THEN** it SHALL display:
  - Optional icon (centered)
  - Title text
  - Description text
  - Optional action button

### Requirement: Form Field Component
The system SHALL provide a `FormField` component that wraps inputs with labels and error messages.

#### Scenario: Form field with label and error
- **WHEN** a form field is rendered
- **THEN** it SHALL display:
  - Label with optional required indicator (*)
  - Input/textarea/select child component
  - Error message when validation fails

### Requirement: Archive List Component
The system SHALL provide an `ArchiveList` component for displaying archived items with restore/delete actions.

#### Scenario: Archive list with standard actions
- **WHEN** an archive list is rendered
- **THEN** it SHALL:
  - Display items in a consistent list format
  - Provide Restore button (green)
  - Provide Delete button (red/destructive)
  - Show empty state when no archived items

#### Scenario: Archive action handlers
- **WHEN** restore or delete is clicked
- **THEN** the component SHALL:
  - Call the appropriate action handler
  - Show confirmation for permanent delete
  - Update local state optimistically

