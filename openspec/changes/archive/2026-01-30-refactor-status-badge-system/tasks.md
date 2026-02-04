# Tasks: Refactor Status Badge System

## 1. Create Status Helper Functions
- [x] 1.1 Create `shared/lib/status-helpers.ts` with entity-to-status mapping functions
- [x] 1.2 Implement `getSongStatus(song)` → returns DashboardStatus
- [x] 1.3 Implement `getPlaylistStatus(playlist)` → returns DashboardStatus
- [x] 1.4 Implement `getEventStatus(event)` → returns DashboardStatus
- [x] 1.5 Add comprehensive JSDoc comments

## 2. Refactor StatusBadge Component
- [x] 2.1 Define unified `DashboardStatus` type
- [x] 2.2 Add `draft` status variant with appropriate styling
- [x] 2.3 Update `statusConfig` with all statuses and icons
- [x] 2.4 Replace union types with `DashboardStatus`
- [x] 2.5 Update `VisibilityBadge` to use new system
- [x] 2.6 Ensure backward compatibility

## 3. Update Songs List
- [x] 3.1 Import status helpers
- [x] 3.2 Replace direct `is_visible` checks with `getSongStatus()`
- [x] 3.3 Test all visibility states render correctly

## 4. Update Playlists List
- [x] 4.1 Import status helpers
- [x] 4.2 Replace direct status mapping with `getPlaylistStatus()`
- [x] 4.3 Test all status variants render correctly

## 5. Update Events List
- [x] 5.1 Import status helpers
- [x] 5.2 Replace boolean checks with `getEventStatus()`
- [x] 5.3 Test current/past/visible/hidden states

## 6. Update Event Form
- [x] 6.1 Update playlist status display in event form
- [x] 6.2 Use new status badge variants

## 7. Update Recent Activity Widget
- [x] 7.1 Import status helpers
- [x] 7.2 Update getStatusBadge to use helpers
- [x] 7.3 Ensure all entity types display correct status

## 8. Validation
- [x] 8.1 Verify all status badges render correctly
- [x] 8.2 Test dark mode compatibility
- [x] 8.3 Test responsive behavior
- [x] 8.4 Run full build and check for errors
