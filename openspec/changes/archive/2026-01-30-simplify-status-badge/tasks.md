# Tasks: Simplify Status Badge to Icon-Only with Tooltips

## 1. Simplify StatusBadge Component
- [x] 1.1 Remove `showIcon`, `compactOnMobile`, `iconOnly` props from interface
- [x] 1.2 Simplify component to single rendering path (icon-only)
- [x] 1.3 Ensure all status variants use consistent 24px circular container
- [x] 1.4 Keep `title` attribute for native browser tooltips
- [x] 1.5 Remove VisibilityBadge component

## 2. Update Songs List
- [x] 2.1 Remove props from StatusBadge usage
- [x] 2.2 Use getSongStatus() helper

## 3. Update Playlists List
- [x] 3.1 Remove props from StatusBadge usage
- [x] 3.2 Use getPlaylistStatus() helper

## 4. Update Events List
- [x] 4.1 Remove props from StatusBadge usage
- [x] 4.2 Use getEventStatus() helper

## 5. Update Event Form
- [x] 5.1 Update playlist status display to use simplified StatusBadge

## 6. Update Recent Activity Widget
- [x] 6.1 Update getStatusBadge to use simplified StatusBadge
- [x] 6.2 Remove VisibilityBadge usage

## 7. Update Shared UI Index
- [x] 7.1 Remove VisibilityBadge from exports

## 8. Validation
- [x] 8.1 Verify all status badges render as icon-only
- [x] 8.2 Test tooltips appear on hover
- [x] 8.3 Test on mobile and desktop
- [x] 8.4 Run full build
