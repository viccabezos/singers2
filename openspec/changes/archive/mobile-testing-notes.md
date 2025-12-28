# Mobile Testing Notes

**Date**: 2024-12-23  
**Device**: (your phone model)  
**Screen size**: (if known)

---

## Issues Found

### 1. Login page showing nav FAB
- **Status**: ✅ Fixed
- **Description**: Menu button was visible on login page when not authenticated

### 2. Filters take too much space on mobile
- **Status**: ✅ Fixed
- **Page**: events / songs/ playlists
- **Description**: Mobile now shows search bar + filter icon button that opens a bottom sheet
- **TODO for later**: Align desktop filter panel style with mobile (inline search + popover instead of full panel)

### 3. Events card layout
- **Status**: ✅ Fixed
- **Page**: events
- **Description**: Redesigned event cards based on user sketch - date badge with star decoration for current event, title + description, time/place info, playlist count + visibility icon + star action + chevron on right side 

### 4. Bulk actions bar
- **Status**: ✅ Fixed
- **Page**: events / songs / playlists 
- **Description**: Now shows as a sticky bottom bar on mobile for easy thumb access

### 5. Visibility badge
- **Status**: ✅ Fixed
- **Part**: inside tables 
- **Description**: Now shows icon-only on mobile (eye icon), full badge on desktop

### 6. Row actions
- **Status**: ✅ Fixed
- **Part**: inside tables 
- **Description**: Edit/Archive/Delete/Restore buttons now show as icon-only on mobile 


### 7. Form buttons overlap FAB
- **Status**: ✅ Fixed
- **Page**: forms 
- **Description**: Form buttons now left-aligned on mobile, right-aligned on desktop

### 8. Drawer quick actions
- **Status**: ✅ Fixed
- **Part**: drawer
- **Description**: Added 3 quick action buttons at top of drawer (New Song, New Playlist, New Event)  

---

## Future Tasks (Tomorrow)

### 9. Sidebar state persistence
- **Status**: ✅ Fixed
- **Part**: Desktop sidebar
- **Description**: The sidebar open/close state now persists across page navigations and sessions via cookies. The shadcn SidebarProvider already writes to cookies on toggle; we now read the cookie server-side in the admin layout and pass it as `defaultSidebarOpen` prop.

### 10. Google Maps integration for event address
- **Status**: ✅ Fixed  
- **Page**: Events form + Public event page
- **Description**: Full Google Maps integration:
  - Added `latitude` and `longitude` columns to events table (migration)
  - Created `PlaceAutocompleteField` component with Google Places Autocomplete
  - Created `GoogleMapDisplay` and `MapWithPlaceholder` components for map display
  - **Admin form**: Place autocomplete + map preview when coordinates set
  - **Public event page**: Shows map with marker when coordinates available
  - Restricted autocomplete to France for better local results
  - Graceful fallback when API key not configured or coordinates not set
- **Setup required**: Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local` (Places API enabled)

### 11. AI Song Assistant
- **Status**: 🔲 Open
- **Page**: Song form
- **Priority**: Future (but may be assessed sooner)
- **Description**: Add AI-powered features to help complete song information
- **Features to consider**:
  - **Metadata completion**: Analyze lyrics → suggest artist, genre, year, language
  - **Lyrics completion**: Complete partial/missing lyrics (known songs or style-matching)
  - **Smart formatting**: Auto-add [Verse], [Chorus] labels, fix line breaks
- **Implementation approach**:
  - Simple "✨ Analyze" button next to lyrics field
  - Calls LLM API (OpenAI/Anthropic) via Edge Function or server action
  - Shows suggestions in a preview before applying
- **Effort estimate**: 1-3 days depending on feature scope
- **Dependencies**: API key for LLM provider


