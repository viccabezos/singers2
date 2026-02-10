# Change: Test Social Links and Final Polish

## Why

While the core functionality is complete, we need to verify that social media links work correctly with real URLs and add any final polish items that weren't critical for the MVP but improve the user experience.

## What Changes

### 1. Social Media Links Testing
- Test Facebook URL integration
- Test Instagram URL integration  
- Test YouTube URL integration
- Verify icons display correctly
- Test links open in new tabs
- Verify mobile display

### 2. Default Content Population
- Add default tagline if none set
- Add default about text if none set
- Create placeholder content suggestions
- Ensure graceful fallbacks work

### 3. Final Polish Items
- Add sample/default content suggestions
- Verify all empty states work correctly
- Test edge cases (no photos, no playlists, etc.)
- Final mobile responsiveness check

### 4. User Acceptance Testing
- Test with real choir members
- Gather feedback on usability
- Identify any final UX improvements

## Impact

### Affected Specs
- **public-website**: Social links verification
- **back-office**: Default content handling

### Affected Code
- `/widgets/public-footer/` - Social links display
- `/app/(public)/page.tsx` - Default content fallbacks
- Settings initialization

### Dependencies
- Requires: `enhance-public-homepage` to be complete
- Requires: Real social media URLs from the choir

## Success Criteria

- [ ] All social media links tested with real URLs
- [ ] Default content works when no settings configured
- [ ] All edge cases handled gracefully
- [ ] User feedback incorporated
