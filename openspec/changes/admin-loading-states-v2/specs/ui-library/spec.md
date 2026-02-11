## ADDED Requirements

### Requirement: Skeleton Loading Components
The system SHALL provide skeleton loading components for all data lists and cards.

#### Scenario: Admin opens events page
- **GIVEN** an admin navigates to the events page
- **WHEN** the events are loading from the server
- **THEN** skeleton cards are displayed
- **AND** the skeletons match the visual structure of event cards
- **AND** pulse animation indicates loading activity
- **AND** content fades in when loaded

#### Scenario: Admin opens songs page
- **GIVEN** an admin navigates to the songs page
- **WHEN** the songs are loading
- **THEN** skeleton rows are displayed in the DataTable
- **AND** column headers are visible
- **AND** skeletons match the row structure

#### Scenario: Dark mode skeleton display
- **GIVEN** the user has dark mode enabled
- **WHEN** skeletons are displayed
- **THEN** skeletons use appropriate dark mode colors
- **AND** contrast remains accessible

### Requirement: Button Loading States
The system SHALL display loading indicators on buttons during asynchronous operations.

#### Scenario: Admin saves form
- **GIVEN** an admin submits a form
- **WHEN** the form is being processed
- **THEN** the submit button shows a spinner
- **AND** button text changes to "Saving..."
- **AND** button is disabled during operation
- **AND** button returns to normal state when complete

#### Scenario: Bulk archive operation
- **GIVEN** an admin initiates a bulk archive
- **WHEN** the operation is in progress
- **THEN** the archive button shows loading state
- **AND** checkboxes are disabled
- **AND** success/error toast appears when complete

### Requirement: Loading Accessibility
The system SHALL provide accessible loading indicators for screen readers.

#### Scenario: Screen reader user waits for loading
- **GIVEN** a user with screen reader is on the page
- **WHEN** content is loading
- **THEN** aria-busy is set on the loading region
- **AND** aria-live announces when loading completes
- **AND** loading state is keyboard accessible

#### Scenario: Reduced motion preference
- **GIVEN** a user has prefers-reduced-motion enabled
- **WHEN** loading states are displayed
- **THEN** animations are disabled or reduced
- **AND** content remains accessible

## MODIFIED Requirements

### Requirement: Enhanced Button Component
The system SHALL support loading state props on the Button component.

#### Scenario: Developer uses loading button
- **GIVEN** a developer implements a button
- **WHEN** they add isLoading prop
- **THEN** button automatically shows spinner
- **AND** button disables during loading
- **AND** text can be customized for loading state

## RENAMED Requirements

*None*

## REMOVED Requirements

*None - this is an additive change*

## Notes

This change standardizes loading states across the admin interface for V2.

### Scope
All admin pages:
- Events list and forms
- Songs list and forms
- Playlists list and forms
- Dashboard
- Archive views

### Pattern Examples

**Skeleton Card:**
```tsx
<div className="animate-pulse rounded-lg border p-4">
  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
</div>
```

**Loading Button:**
```tsx
<Button disabled={isLoading}>
  {isLoading ? <><Spinner /> Loading...</> : "Save"}
</Button>
```

### Implementation Priority
1. Events skeletons (most used)
2. Form submit buttons (critical UX)
3. Songs/Playlists skeletons
4. Dashboard skeletons
5. Accessibility enhancements
