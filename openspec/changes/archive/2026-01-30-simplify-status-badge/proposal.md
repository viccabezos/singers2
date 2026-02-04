# Change: Simplify Status Badge to Icon-Only with Tooltips

## Why

The current StatusBadge component has multiple display modes that create inconsistency across the dashboard:
- Some places show icon + text
- Some places show icon-only  
- Some places show different layouts for mobile vs desktop
- Multiple props control display: `showIcon`, `compactOnMobile`, `iconOnly`

This complexity makes the UI inconsistent and harder to maintain. A simpler approach using icon-only badges with tooltips will provide:
1. **Visual consistency** across all screens
2. **Space efficiency** in data tables and lists
3. **Clean, modern look** that matches the events page pattern
4. **Accessibility** via tooltips showing the label on hover

## Current State

The StatusBadge component has complex rendering logic with multiple branches:
- Icon-only mode for visibility variants
- Compact mobile mode with short labels
- Full badge mode with icon + text
- Different behavior based on `iconOnly`, `compactOnMobile`, `showIcon` props

## What Changes

### 1. Simplify StatusBadge Component
- Remove `showIcon`, `compactOnMobile`, `iconOnly` props
- Always render icon-only circular badges
- Use `title` attribute for native tooltips
- Consistent sizing across all statuses
- Single, simple rendering path

### 2. Update All Consumers
- Remove all display-related props from StatusBadge usage
- Remove VisibilityBadge component (no longer needed)
- Update all list pages (songs, playlists, events)
- Update Recent Activity widget
- Update Event Form

### 3. Consistent Styling
- All badges: 24px circular container
- All icons: 14px size
- Background colors based on status
- Tooltip shows status label

## Impact

- Affected specs: ui-library, back-office
- Affected code:
  - `shared/ui/status-badge.tsx` - Simplified to icon-only
  - `shared/ui/index.ts` - Remove VisibilityBadge export
  - All admin list pages - Remove props
  - Event form - Update status display
  - Recent Activity widget - Update status display

## Out of Scope

- Status colors and icons (keep existing)
- DashboardStatus type (keep existing)
- Status helper functions (keep existing)
