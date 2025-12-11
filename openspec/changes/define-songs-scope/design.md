# Design: Songs Data Model and Scope

## Context
Songs are the core content entity in Les Chanteurs. They contain lyrics that choir members and audience need to access during events. Songs can belong to multiple playlists and must be easy to read on mobile devices.

## Questions to Answer

### 1. Song Fields & Structure

#### Required Fields
- **Title**: Is title required? yes
- **Artist/Composer**: Is artist/composer required? no
- **Lyrics**: Are lyrics required? yes
- **Other required fields**: language (opt), genre(opt) , year (optional)

#### Optional Metadata
- **Language**: Should songs have a language field? yes opt
- **Genre**: Should songs have a genre field? yes opt
- **Year/Date**: Should songs track when they were written/composed? yes opt
- **Duration**: Should songs track duration/length? No
- **Composer vs Performer**: Should we distinguish between composer and performer? No
- **Other metadata**: Any other optional fields needed? not for now

### 2. Lyrics Format & Storage

#### Storage Format
- **Plain text**: Store as plain text with line breaks? ✅ Yes
- **Structured format**: Support verses, choruses, bridges structure? ✅ Yes - Plain text with preserved line breaks (Option A)
- **Markdown**: Support Markdown formatting? ❌ No
- **HTML**: Support HTML formatting? ❌ No

**Decision**: Use plain text with preserved line breaks. When admins copy/paste lyrics from internet sources, the system will preserve the original formatting (line breaks, paragraphs). No special markup needed - verses, choruses, and bridges will be naturally separated by line breaks as typed.

#### Line Break Handling
- **Single line breaks**: Should single line breaks (`\n`) create new lines? ✅ Yes
- **Double line breaks**: Should double line breaks (`\n\n`) create new paragraphs/verses? ✅ Yes
- **Special formatting**: No special formatting needed - natural line breaks preserved as typed

### 3. Song Management (Admin)

#### CRUD Operations
- **Copy/Duplicate**: Can admins copy/duplicate existing songs? yes
- **Import lyrics**: Can admins import lyrics from external sources yes
- **Bulk operations**: Are bulk operations needed? ✅ Yes - Bulk visibility toggle included in MVP
  - Bulk visibility toggle: ✅ Yes (MVP)
  - Import multiple songs: ❌ No (future)
  - Bulk delete: ❌ No (future)

#### Search & Filter
- **Search capability**: Should admins be able to search songs? Yes
- **Filter options**: What filters are needed
  - By title
  - By artist
  - By language
  - By visibility status
  

### 4. Song Visibility

#### Visibility Behavior
- **Show/hide toggle**: Simple show/hide toggle sufficient? yes
- **Hidden in playlists**: Can a song be hidden but still appear in playlists (for editing/preview)? yes but greyyed 
- **Draft/Published states**: no

#### Visibility Rules
- **Public website**: If a song is hidden, should it:
  - Not appear in any playlist on public site? yes
  - Still appear but be inaccessible? no


### 5. Song Deletion

#### Deletion Behavior
- **Removal from playlists**: When a song is deleted, should it:
  - Be automatically removed from all playlists? depends. if we delete the song from a playlist no, if we delete it from the songs list it should alert that it will be deleted it from all the playlists and asks to accept the action
  - Show a "Song deleted" placeholder in playlists? no
  - Other behavior?

#### Deletion Type
- **Soft delete**: Should we use soft delete (archive, can be restored)? yes archived
- **Hard delete**: Or hard delete (permanently removed)? depends if done it from the archived section
- **Both**: Support both (soft delete with option to permanently delete)? yes

### 6. Font Size (Lyrics Display)

#### Font Size Options
- **Preset sizes**: Use preset sizes (Small, Medium, Large, Extra Large)? no
- **Numeric scale**: Use numeric scale (e.g., 14px, 16px, 18px, 20px, 24px)? no
- **Custom range**: Allow custom range? ✅ Yes
  - Min/max range: 14px to 24px (adjustable)
  - UI control: ✅ Slider (MVP)

#### Font Size Scope
- **Lyrics only**: Should font size apply only to lyrics text? yes
- **Entire page**: Should font size apply to entire page (navigation, title, etc.)? no
- **Both options**: Support both (user chooses)? no
## Decisions

### Song Data Model
- **Required fields**: Title, Lyrics
- **Optional fields**: Artist/Composer, Language, Genre, Year
- **No duration tracking**: Duration field not needed
- **No composer/performer distinction**: Single "Artist/Composer" field sufficient

### Lyrics Format
- **Plain text storage**: Lyrics stored as plain text with preserved line breaks
- **No markup**: No Markdown or HTML support - simple textarea for input
- **Natural formatting**: Verses, choruses, bridges separated naturally by line breaks
- **Copy/paste friendly**: System preserves formatting when lyrics are pasted from external sources

### Song Management
- **Copy/Duplicate**: ✅ Supported
- **Search**: ✅ Supported (by title, artist, language, visibility status)
- **Filters**: Title, Artist, Language, Visibility status
- **Bulk visibility toggle**: ✅ Included in MVP

### Visibility
- **Simple toggle**: Show/hide toggle sufficient
- **Admin preview**: Hidden songs appear greyed out in admin playlists for editing/preview
- **Public site**: Hidden songs do not appear in any playlist on public site
- **No draft/published states**: Simple visibility toggle only

### Deletion
- **Soft delete**: Songs are archived (soft delete) by default
- **Hard delete**: Permanent deletion available from archived section
- **Deletion from songs list**: Shows confirmation alert that song will be removed from all playlists
- **Deletion from playlist**: Removes song from that playlist only (not deleted from system)
- **No placeholders**: Deleted songs are removed, no "Song deleted" placeholders

### Font Size
- **Custom range**: 14px to 24px (adjustable)
- **UI control**: Slider for font size adjustment
- **Scope**: Font size applies to lyrics text only (not navigation, title, etc.)
- **Storage**: Font size preference stored in browser session (persists when changing songs, not across devices)

## Alternatives Considered

### Lyrics Format
- **Markdown/HTML**: Considered but rejected for MVP - adds complexity, plain text sufficient
- **Structured data**: Considered storing verses/choruses as structured data but rejected - natural line breaks simpler and more flexible

### Font Size UI
- **Preset buttons**: Considered but slider provides more flexibility and better UX
- **Numeric input**: Considered but slider is more intuitive for mobile users

### Visibility
- **Draft/Published states**: Considered but rejected - simple show/hide sufficient for MVP
- **Scheduled visibility**: Considered but rejected - not needed for MVP

## Risks / Trade-offs

### Plain Text Lyrics
- **Risk**: No formatting control (bold, italic, etc.)
- **Mitigation**: Plain text is sufficient for lyrics display, keeps system simple
- **Trade-off**: Simplicity vs formatting control - simplicity chosen for MVP

### Font Size Slider
- **Risk**: Slider may be harder to use on very small screens
- **Mitigation**: Mobile-first design, slider will be tested and adjusted if needed
- **Trade-off**: Flexibility vs ease of use - flexibility chosen, can refine based on testing

### Bulk Visibility Toggle
- **Risk**: Accidental bulk visibility changes
- **Mitigation**: Confirmation dialog before applying bulk visibility changes
- **Trade-off**: Efficiency vs safety - efficiency chosen with safety confirmation

### Soft Delete Only
- **Risk**: Accidental permanent deletion
- **Mitigation**: Two-step deletion (soft delete first, then hard delete from archive)
- **Trade-off**: Data safety vs simplicity - data safety prioritized

