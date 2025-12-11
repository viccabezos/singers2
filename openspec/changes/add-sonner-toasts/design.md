# Design: Sonner Toast Notifications

## Context
Users need immediate feedback when performing CRUD operations. Toast notifications are the standard pattern for this - they appear temporarily, don't block the UI, and provide clear success/error messages.

## Decisions

### Decision: Use Sonner from shadcn/ui
**What**: Use Sonner toast library, integrated via shadcn/ui components.

**Why**:
- Part of shadcn/ui ecosystem (already using shadcn)
- Lightweight and performant
- Accessible by default
- Mobile-friendly
- Easy to customize with Tailwind

**Alternatives considered**:
- react-hot-toast: Good but not part of shadcn ecosystem
- Custom toast solution: Unnecessary complexity
- Browser alerts: Poor UX, blocks interaction

### Decision: Toast Placement
**What**: Toasts appear in bottom-right corner on desktop, bottom-center on mobile.

**Why**:
- Bottom-right is standard for desktop
- Bottom-center is better for mobile (easier to reach/dismiss)
- Sonner supports responsive positioning

### Decision: Toast Duration
**What**: Success toasts: 3 seconds, Error toasts: 5 seconds.

**Why**:
- Success messages need less time (user can see action completed)
- Error messages need more time (user may need to read and understand)
- Standard durations for toast notifications

## Toast Messages

### Song Creation
- Success: "Song created successfully"
- Error: "Failed to create song: [error message]"

### Song Update
- Success: "Song updated successfully"
- Error: "Failed to update song: [error message]"

### Song Archive
- Success: "Song archived successfully"
- Error: "Failed to archive song: [error message]"

### Song Restore
- Success: "Song restored successfully"
- Error: "Failed to restore song: [error message]"

### Song Delete
- Success: "Song deleted permanently"
- Error: "Failed to delete song: [error message]"

### Bulk Visibility Toggle
- Success: "[N] song(s) visibility updated"
- Error: "Failed to update visibility: [error message]"

### Song Duplicate
- Success: "Song duplicated successfully"
- Error: "Failed to duplicate song: [error message]"

## Implementation

1. Install Sonner via shadcn CLI
2. Add Toaster component to root layout
3. Update all server actions to return success/error states
4. Update client components to show toasts based on action results
5. Ensure mobile-first responsive positioning

## Risks / Trade-offs

- **Performance**: Minimal - Sonner is lightweight
- **Accessibility**: Sonner handles ARIA attributes automatically
- **Mobile UX**: Bottom-center positioning ensures toasts don't interfere with mobile UI

