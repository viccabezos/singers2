# Tasks: Improve Public Website UX

## 1. Create Shared Public Components
- [ ] 1.1 Create `shared/ui/theme-toggle.tsx` component using next-themes
- [ ] 1.2 Create `shared/ui/public-header.tsx` component with home link, breadcrumbs slot, and theme toggle
- [ ] 1.3 Export new components from `shared/ui/index.ts`

## 2. Update Public Layout
- [ ] 2.1 Wrap public layout with ThemeProvider from next-themes
- [ ] 2.2 Ensure theme persistence works correctly

## 3. Build Functional Homepage
- [ ] 3.1 Implement `getCurrentEvent()` logic to fetch current/upcoming event
- [ ] 3.2 Rebuild `app/(public)/page.tsx` to display current event with playlists
- [ ] 3.3 Add empty state for "no upcoming events"
- [ ] 3.4 Ensure homepage is mobile-first and high contrast

## 4. Update Event Page
- [ ] 4.1 Add `PublicHeader` to event display with home link
- [ ] 4.2 Ensure consistent styling with new header

## 5. Update Playlist Page
- [ ] 5.1 Add `PublicHeader` to playlist display
- [ ] 5.2 Add "← Back to event" navigation (use query param or referrer)
- [ ] 5.3 Add dark mode support to playlist styling

## 6. Update Song/Lyrics Page
- [ ] 6.1 Add `PublicHeader` to lyrics display
- [ ] 6.2 Add "← Back to playlist" navigation
- [ ] 6.3 Improve font size slider accessibility (larger touch target, ARIA labels)
- [ ] 6.4 Ensure lyrics container has proper dark mode contrast

## 7. Add Loading States
- [ ] 7.1 Add skeleton loading to public homepage
- [ ] 7.2 Add skeleton loading to playlist page
- [ ] 7.3 Add skeleton loading to song/lyrics page

## 8. Testing and Validation
- [ ] 8.1 Test full public user flow: homepage → event → playlist → song
- [ ] 8.2 Test dark mode toggle and persistence
- [ ] 8.3 Test mobile responsiveness on all public pages
