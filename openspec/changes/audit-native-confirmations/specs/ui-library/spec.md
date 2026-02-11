## ADDED Requirements

### Requirement: No Native Browser Confirmations
The system SHALL NOT use native browser dialogs (confirm, alert, prompt) for user interactions in any form or action.

#### Scenario: Admin deletes an item
- **GIVEN** an admin is viewing a list with delete actions
- **WHEN** they click delete on an item
- **THEN** a custom AlertDialog is displayed
- **AND** NOT a native browser confirm dialog
- **AND** the dialog is styled consistently with the application theme
- **AND** the dialog works in both light and dark modes

#### Scenario: Admin performs bulk action
- **GIVEN** an admin has selected multiple items for a bulk action
- **WHEN** they click the bulk action button
- **THEN** a confirmation AlertDialog is shown
- **AND** NOT a native browser confirm dialog
- **AND** the dialog clearly states how many items will be affected

### Requirement: Consistent Notification System
The system SHALL use toast notifications (sonner) instead of native alert() for all success and error messages.

#### Scenario: Action completes successfully
- **GIVEN** an admin performs an action (create, update, delete)
- **WHEN** the action completes successfully
- **THEN** a toast.success notification is displayed
- **AND** NOT a native browser alert
- **AND** the toast auto-dismisses after a few seconds

#### Scenario: Action fails
- **GIVEN** an admin performs an action
- **WHEN** the action fails
- **THEN** a toast.error notification is displayed
- **AND** NOT a native browser alert
- **AND** the error message is descriptive

## MODIFIED Requirements

### Requirement: UI Component Library Standards
The system SHALL standardize on shadcn/ui components for all dialogs, confirmations, and notifications.

#### Scenario: New feature needs confirmation
- **GIVEN** a developer adds a new destructive action
- **WHEN** they implement confirmation
- **THEN** they use AlertDialog from @/components/ui/alert-dialog
- **AND** they follow the established pattern
- **AND** they do NOT use native confirm()

## RENAMED Requirements

*None*

## REMOVED Requirements

*None - all existing requirements remain, this change adds constraints*

## Notes

This change documents the technical debt audit needed to ensure UI consistency across the application.

### Scope
- All admin interfaces (app/(admin)/admin/)
- All public interfaces (app/(public)/)
- All shared UI components (shared/ui/)
- All widgets (widgets/)

### Priority Files
Based on initial scan:
- app/(admin)/admin/photos/photo-list.tsx (uses confirm())
- Any file with confirm(), alert(), or prompt()

### Implementation Pattern

**Before (to be removed):**
```typescript
if (confirm("Are you sure?")) {
  await deleteItem();
}
alert("Deleted!");
```

**After (standard):**
```typescript
// State management
const [showDialog, setShowDialog] = useState(false);

// Render
<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleAction}>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// After action
toast.success("Action completed");
```
