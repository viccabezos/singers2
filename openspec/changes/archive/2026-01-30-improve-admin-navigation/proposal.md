# Change: Improve Admin Navigation

## Why

The admin panel has an `AdminNav` widget that provides persistent sidebar navigation on desktop and a mobile-friendly drawer, but it's not connected to the admin layout. Currently, admins navigate only via breadcrumbs and direct links, which is less efficient than having persistent navigation.

## What Changes

### 1. **Integrate AdminNav into Admin Layout** (Primary)
- The `AdminNav` widget exists at `widgets/admin-nav/` but isn't used
- Update `app/(admin)/layout.tsx` to wrap children with `AdminNav`
- This provides:
  - Collapsible sidebar on desktop/tablet
  - Bottom drawer with FAB on mobile
  - Quick actions for creating songs, playlists, events
  - Logout link in consistent location

## Impact

- Affected specs: back-office
- Affected code:
  - `app/(admin)/layout.tsx` - Integrate AdminNav wrapper

## Out of Scope

- Public website UX improvements (separate proposal: `improve-ux-systemic-issues`)
- Admin form redesign (forms already work well)
- New admin features
