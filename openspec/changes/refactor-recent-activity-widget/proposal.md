# Change: Refactor RecentActivity Widget

## Why
The RecentActivity widget on the admin dashboard needs a complete refactor to improve user experience and visual consistency. Based on screenshots of the current implementation, there are several specific UI issues:

1. **Height mismatch** - The RecentActivity widget is noticeably shorter than the EventCalendar widget when displayed side-by-side
2. **Inconsistent item layouts** - Songs, playlists, and events display with different structures (some have number prefixes, different badge placements)
3. **Confusing playlist numbering** - Playlists show numbers (4, 2) that appear to be order/index but are visually confusing
4. **Poor status badge placement** - Badges are inconsistently positioned (inline with title vs on the left)
5. **Plain tab styling** - Tabs lack visual distinction and active states could be more prominent
6. **Uneven timestamp alignment** - "about 1 month ago" timestamps create uneven spacing
7. **Excessive whitespace** - Significant empty space at the bottom of the widget

## What Changes
- Complete refactor of the RecentActivity widget component
- Fix height inconsistency with EventCalendar widget (match heights when displayed side-by-side)
- Standardize item layout across all tabs (Songs, Playlists, Events)
- Remove confusing number prefix from playlist items
- Consistent status badge placement (inline with title)
- Improve tab interface with better visual design and clear active state indicators
- Fix timestamp alignment and spacing
- Improve visual hierarchy and information architecture
- Enhance spacing and padding for better readability
- Improve mobile responsiveness
- Better handling of empty states and loading states
- Consistent styling with other dashboard widgets

## Impact
- Affected specs: dashboard
- Affected code: 
  - `widgets/recent-activity/ui/recent-activity.tsx`
  - `app/(admin)/admin/dashboard/page.tsx` (layout adjustments if needed)
