## Context
The RecentActivity widget displays recently updated songs, playlists, and events in a tabbed interface on the admin dashboard. It sits alongside the EventCalendar widget in a 1:2 column ratio (lg:col-span-1 vs lg:col-span-2).

Current issues:
1. Height mismatch between RecentActivity and EventCalendar widgets
2. Tab interface could be more visually appealing
3. List items need better visual hierarchy
4. Mobile experience needs improvement
5. Empty states are minimal

## Goals / Non-Goals

### Goals
- Achieve visual height parity with EventCalendar widget
- Improve overall UX/UI of the RecentActivity widget
- Better visual hierarchy for activity items
- Enhanced mobile responsiveness
- Consistent styling with dashboard design system

### Non-Goals
- No changes to data fetching logic
- No changes to the underlying data model
- No changes to the EventCalendar widget
- No new features or functionality

## Decisions

### Decision: Use flexbox with min-height to match EventCalendar
- **What**: Implement flex-grow and min-height constraints to ensure RecentActivity matches EventCalendar height
- **Why**: Creates visual balance in the dashboard layout
- **Alternatives considered**: CSS Grid with equal height rows (less flexible for content changes)

### Decision: Redesign tab interface with improved visual indicators
- **What**: Update tab styling to match shadcn/ui patterns with better active state indicators
- **Why**: Improves usability and visual consistency
- **Alternatives considered**: Keeping current tabs (suboptimal UX)

### Decision: Standardize list item layout with consistent spacing
- **What**: Apply consistent padding, margins, and typography scale to activity items
- **Why**: Better readability and professional appearance
- **Alternatives considered**: Compact list view (too dense for target users)

## Risks / Trade-offs
- **Risk**: Height matching may cause excessive whitespace on mobile
  - **Mitigation**: Use responsive breakpoints to adjust layout
- **Risk**: Changes may affect existing user familiarity
  - **Mitigation**: Maintain core functionality and navigation patterns

## Open Questions
- [ ] Should we add loading skeleton states? not yet
- [ ] Should we limit the number of items shown per tab? YES, to 5 items
