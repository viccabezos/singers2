# Spec: Sortable Content Table Component

## Overview

A reusable table component with drag-and-drop reordering for managing ordered content lists within forms.

## ADDED Requirements

### Requirement: Sortable table displays items in order

The sortable content table displays items in a table format with consistent styling.

#### Scenario: Table renders with items

**Given** a list of items is provided  
**When** the component renders  
**Then** items are displayed in a table with columns:
  - Drag handle (grip icon)
  - Position number (1, 2, 3...)
  - Content columns (configurable)
  - Remove action button

#### Scenario: Empty state is shown

**Given** an empty list of items  
**When** the component renders  
**Then** an empty state message is displayed with optional icon

---

### Requirement: Items can be reordered via drag-and-drop

Users can reorder items by dragging them to new positions.

#### Scenario: User drags item to new position

**Given** a list with multiple items  
**When** user drags an item and drops it at a new position  
**Then** the `onReorder` callback is called with the new item order  
**And** position numbers update to reflect new order

#### Scenario: Drag is cancelled

**Given** user starts dragging an item  
**When** user presses Escape or drops outside valid area  
**Then** items remain in original order  
**And** no callback is triggered

#### Scenario: Keyboard reordering

**Given** focus is on a drag handle  
**When** user presses Space to pick up, arrow keys to move, Space to drop  
**Then** the item is reordered  
**And** `onReorder` callback is called

---

### Requirement: Items can be removed

Users can remove items from the list.

#### Scenario: User clicks remove button

**Given** a list with items  
**When** user clicks the remove button on an item  
**Then** the `onRemove` callback is called with the item's ID

#### Scenario: Remove button is disabled

**Given** the component has `disabled={true}`  
**When** user attempts to click remove  
**Then** the button is not clickable

---

### Requirement: Content picker allows adding items

An optional picker UI allows searching and adding new items.

#### Scenario: User opens picker

**Given** picker configuration is provided  
**When** user clicks "Add" button  
**Then** a search input is displayed

#### Scenario: User searches for items

**Given** picker is open  
**When** user types in search input  
**Then** `onSearch` callback is called with query  
**And** results are displayed when returned

#### Scenario: User adds item from results

**Given** search results are displayed  
**When** user clicks on a result item  
**Then** `onAdd` callback is called with the item  
**And** picker closes and search clears

#### Scenario: No picker configured

**Given** no picker configuration  
**When** component renders  
**Then** no "Add" button is displayed

---

### Requirement: Component is accessible

The component follows accessibility best practices.

#### Scenario: Screen reader announces drag operations

**Given** screen reader is active  
**When** user interacts with drag handles  
**Then** appropriate announcements are made for pick up, move, and drop

#### Scenario: Focus is managed during drag

**Given** user is dragging with keyboard  
**When** drag operation completes  
**Then** focus returns to the drag handle

---

### Requirement: Component supports mobile interactions

The component works on touch devices.

#### Scenario: Touch drag on mobile

**Given** user is on a touch device  
**When** user touches and drags the grip handle  
**Then** the item follows the touch position  
**And** reordering works as expected

#### Scenario: Drag handle has adequate touch target

**Given** user is on a touch device  
**Then** drag handle has minimum 44x44px touch target

---

## Visual Design

### Table Structure

```
┌──────────┬─────┬──────────────────────────────┬──────────┐
│ (grip)   │ #   │ Content                      │ Actions  │
├──────────┼─────┼──────────────────────────────┼──────────┤
│ ⠿        │ 1   │ [Configurable columns]       │ Remove   │
│ ⠿        │ 2   │ [Configurable columns]       │ Remove   │
└──────────┴─────┴──────────────────────────────┴──────────┘
```

### States

- **Default**: Normal table appearance
- **Dragging**: Row is lifted with shadow, placeholder shows drop position
- **Disabled**: All interactions disabled, reduced opacity
- **Empty**: Centered empty state message

### Styling

- Uses shadcn Table components
- Consistent with existing admin UI
- Dark mode support
- Mobile-first responsive design

