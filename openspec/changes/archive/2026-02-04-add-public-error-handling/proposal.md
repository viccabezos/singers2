# Change: Add Public Error Handling

## Why
The public application currently lacks proper error handling. When users navigate to non-existent events, playlists, or songs, they see generic Next.js error pages or technical error messages. This is confusing for choir members who are often not tech-savvy. We need friendly, helpful error pages that guide users back to valid content.

## What Changes
- Create custom 404 Not Found page for the public app
- Create generic error page for other errors
- Implement friendly, non-technical error messages
- Provide clear navigation options (Go home, Browse events)
- Maintain consistent styling with the rest of the app
- Support dark mode on error pages

## Impact
- **Files Created:**
  - `app/(public)/not-found.tsx` - 404 page
  - `app/(public)/error.tsx` - Generic error page
  - `widgets/error-display/` - Reusable error display component
- **Affected Specs:** public-website
- **Dependencies:** None (can be implemented independently)

## Acceptance Criteria
- [ ] 404 page displays when navigating to non-existent routes
- [ ] 404 page shows friendly message (not technical)
- [ ] 404 page provides navigation to home and events list
- [ ] Generic error page handles unexpected errors gracefully
- [ ] Error pages maintain app styling (colors, typography)
- [ ] Dark mode support on error pages
- [ ] Mobile-friendly layout
