# Proposal: Unify Form Layout Component

## Summary

Create a unified form layout component system that provides consistent structure, styling, feedback patterns, and action buttons across all admin forms.

## Problem Statement

Currently, the three main forms (Songs, Playlists, Events) have inconsistent implementations:

### Structural Differences

| Aspect | Song Form | Playlist Form | Event Form |
|--------|-----------|---------------|------------|
| **Wrapper** | Single `<form>` with card | `<div>` → `<form>` card + separate card | `<form>` with multiple cards |
| **Sections** | None (flat) | Form section + Songs section | Details card + Playlists card + Actions |
| **Actions position** | Inside form card (left-aligned) | Inside form card (left-aligned) | Outside cards (right-aligned) |

### Feedback Differences

| Aspect | Song Form | Playlist Form | Event Form |
|--------|-----------|---------------|------------|
| **Success** | Toast + redirect | Toast + redirect | Toast + refresh (no redirect) |
| **Error** | Toast + inline error | Toast + inline error | Toast only (no inline) |
| **Validation** | Custom validation | Custom validation | No validation |

### Button Differences

| Aspect | Song Form | Playlist Form | Event Form |
|--------|-----------|---------------|------------|
| **Primary** | "Create Song" / "Update Song" | "Create Playlist" / "Update Playlist" | "Create Event" / "Save Changes" |
| **Secondary** | "Cancel" (router.back) | "Cancel" (router.back) | "Cancel" (router.back) |
| **Extra** | "Duplicate" (edit mode only) | None | None |
| **Order** | Primary → Cancel → Extra | Primary → Cancel | Cancel → Primary |

### Input Styling

All forms use raw `<input>`, `<textarea>`, `<select>` with inline Tailwind classes instead of the existing shadcn components (`Input`, `Textarea`, `Select`) or the `FormField` components in `shared/ui/form-field.tsx`.

## Proposed Solution

### 1. `FormLayout` Component

A wrapper component that provides:
- Consistent card styling with optional sections
- Configurable action button placement (top, bottom, or both)
- Built-in error display area
- Loading/pending state handling

### 2. `FormSection` Component

A section within the form for grouping related fields:
- Optional title
- Consistent spacing and styling
- Can be used for main form fields or related content (like songs in playlist)

### 3. `FormActions` Component

Standardized action buttons:
- Primary action (submit)
- Secondary action (cancel)
- Optional extra actions (duplicate, delete, etc.)
- Consistent button styling using shadcn Button
- Loading states

### 4. `useFormFeedback` Hook

Unified feedback handling:
- Success toast + optional redirect
- Error toast + inline error state
- Configurable behavior per form

### 5. Migrate Existing Forms

Refactor all forms to use:
- `FormLayout` / `FormSection` / `FormActions`
- Existing `TextField`, `TextAreaField`, `SelectField`, `CheckboxField` from `shared/ui/form-field.tsx`
- Consistent feedback patterns

## Expected Impact

- **~40% code reduction** across form components
- **Consistent UX** for all CRUD operations
- **Better maintainability** - changes in one place affect all forms
- **Accessibility** - consistent labeling and error handling

## Scope

**In Scope:**
- New `FormLayout`, `FormSection`, `FormActions` components
- `useFormFeedback` hook
- Refactoring song-form.tsx
- Refactoring playlist-form.tsx
- Refactoring event-form.tsx

**Out of Scope:**
- Login form (different context, server action based)
- Server actions (no changes needed)
- Data validation logic (keep existing)

## Risks

- **Low**: Changes are isolated to form components
- **Low**: Existing functionality preserved, just unified structure
- **Medium**: Regression testing needed for all form behaviors

