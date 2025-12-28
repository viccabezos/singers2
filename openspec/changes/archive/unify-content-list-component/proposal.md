# Proposal: Unify Content List Component with Draggable Table

## Summary

Create a unified, reusable content list component using shadcn Table with drag-and-drop reordering for managing ordered items within forms (songs in playlists, playlists in events).

## Problem Statement

Currently, the **Playlist Form** and **Event Form** have different implementations for managing their content lists:

### Playlist Form (Songs)
- Simple divider-based list layout
- Up/down arrow buttons (text characters: ↑↓)
- Search input with dropdown picker
- Shows: position number, title, artist
- Remove button with text "Remove"

### Event Form (Playlists)
- Similar divider-based list layout
- Up/down arrow icons (Lucide icons)
- Search input with results list
- Shows: position badge, name, status
- Remove button with X icon

**Issues:**
1. **Inconsistent UI patterns** - Different visual styles, icons, and layouts
2. **Poor reordering UX** - Manual up/down clicking is tedious for long lists
3. **Code duplication** - Similar logic duplicated across both forms
4. **Not using shadcn components** - Missing opportunity to leverage existing UI library

## Proposed Changes

### 1. Create `SortableContentTable` Component

A new shared component in `shared/ui/` that provides:

- **shadcn Table** for consistent styling
- **dnd-kit** integration for drag-and-drop reordering
- **Drag handle** column with grip icon
- **Position number** column (auto-calculated)
- **Configurable content columns** (title, subtitle, badges)
- **Remove action** column
- **Empty state** when no items
- **Search/picker** for adding new items

### 2. Install dnd-kit

Add `@dnd-kit/core` and `@dnd-kit/sortable` packages for drag-and-drop functionality.

### 3. Refactor Both Forms

Update `playlist-form.tsx` and `event-form.tsx` to use the new unified component.

## Expected Impact

- **~200 lines of code reduction** across the two forms
- **Consistent UX** for content management
- **Better reordering experience** with drag-and-drop
- **Accessible** - dnd-kit provides keyboard navigation
- **Mobile-friendly** - Touch support built-in

## Scope

- **In Scope:**
  - New `SortableContentTable` component
  - dnd-kit package installation
  - Refactoring playlist-form.tsx
  - Refactoring event-form.tsx

- **Out of Scope:**
  - Changes to data models or API actions
  - Changes to other list components (songs list, events list, etc.)
  - Form field components (name, description, etc.)

## Risks

- **Low**: dnd-kit is a mature, widely-used library
- **Low**: Changes are isolated to form components
- **Medium**: Touch interactions need testing on mobile devices

