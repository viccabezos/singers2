# Tasks: Unify Visibility Icons Across Dashboard

## 1. Update StatusBadge Component
- [x] 1.1 Add `iconOnly` prop to StatusBadge for visibility variants
- [x] 1.2 Implement icon-only styling matching events page (colored circular backgrounds)
- [x] 1.3 Update VisibilityBadge to support icon-only mode
- [x] 1.4 Test component renders correctly with all variants

## 2. Update Songs List Page
- [x] 2.1 Replace VisibilityBadge usage in songs-list-client.tsx
- [x] 2.2 Use icon-only visibility indicators in data table
- [x] 2.3 Verify mobile and desktop rendering

## 3. Update Playlists List Page
- [x] 3.1 Update playlists-list-client.tsx to use icon-only for visible/hidden states
- [x] 3.2 Keep text labels for in_progress and archived states
- [x] 3.3 Verify rendering on all screen sizes

## 4. Update Recent Activity Widget
- [x] 4.1 Replace text visibility badges with icon-only indicators
- [x] 4.2 Ensure icons match the events page styling
- [x] 4.3 Test in dashboard context

## 5. Update Draft Alert Widget (if needed)
- [x] 5.1 Review draft-alert.tsx for visibility indicators
- [x] 5.2 No changes needed - shows content type icons, not visibility status

## 6. Validation
- [x] 6.1 Verify all visibility indicators use consistent icon approach
- [x] 6.2 Test on mobile devices
- [x] 6.3 Test on desktop
- [x] 6.4 Ensure accessibility (tooltips for icon-only indicators)
