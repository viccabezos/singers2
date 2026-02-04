# Change: Unify Visibility Icons Across Dashboard

## Why

The events page uses a clean icon-only approach for visibility status (EyeIcon for visible, EyeOffIcon for hidden) with colored circular backgrounds. This is more space-efficient and visually consistent than the text-based badges used in other parts of the admin panel. We need to audit and update all visibility status indicators across the dashboard to use this unified icon approach.

## Current State Analysis

### Events Page (Reference Implementation)
- Uses icon-only visibility indicators
- Green circular background with EyeIcon for visible
- Red circular background with EyeOffIcon for hidden
- Clean, space-efficient, consistent with the design

### Songs Page
- Uses `VisibilityBadge` component with `compactOnMobile` prop
- Shows icon-only on mobile, text badge on desktop
- **Inconsistent**: Different from events page approach

### Playlists Page
- Uses `StatusBadge` component for playlist status
- Shows text labels ("Visible", "Hidden", "In Progress")
- **Inconsistent**: No icon-only option for visibility states

### Recent Activity Widget (Dashboard)
- Shows text badges for visibility status
- **Inconsistent**: Uses text instead of icons

## What Changes

### 1. Update StatusBadge Component
- Add icon-only mode for visibility variants (visible/hidden)
- Match the events page styling (colored circular backgrounds)
- Maintain backward compatibility for other status types

### 2. Update Songs List
- Replace `VisibilityBadge` usage with icon-only visibility indicators
- Match events page implementation

### 3. Update Playlists List
- For visibility states (visible/hidden), use icon-only indicators
- Keep text labels for non-visibility states (in_progress, archived)

### 4. Update Recent Activity Widget
- Replace text visibility badges with icon-only indicators
- Maintain consistency with events page

### 5. Update Draft Alert Widget
- If showing visibility counts, use icon indicators

## Impact

- Affected specs: ui-library, back-office
- Affected code:
  - `shared/ui/status-badge.tsx` - Add icon-only mode
  - `app/(admin)/admin/songs/songs-list-client.tsx` - Update visibility column
  - `app/(admin)/admin/playlists/playlists-list-client.tsx` - Update status column
  - `widgets/recent-activity/ui/recent-activity.tsx` - Update visibility badges
  - `widgets/draft-alert/ui/draft-alert.tsx` - Update if needed

## Out of Scope

- Form visibility toggles (checkboxes are appropriate there)
- Public website visibility indicators
- Archive page visibility indicators (keep as-is for now)
