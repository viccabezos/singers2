# Change: Enhance Public Homepage with Rich Content and Better UX

## Why

The current public website homepage is functional but minimal - it only displays a current event banner (if set) and a list of upcoming events. While this serves the basic need of showing event information, it doesn't create an engaging first impression for visitors.

The public site is the primary interface for:
- Choir members (often retired, not tech-savvy) accessing lyrics during performances
- Potential new members discovering the choir
- Audience members following along during events
- General public learning about the choir's activities

A more engaging homepage with:
- Welcoming hero section introducing the choir
- About/introduction content explaining the choir's mission
- Visual appeal (photos, better hierarchy)
- Featured content (popular/seasonal playlists)
- Social media links and calls-to-action
- Optional direct access to browse songs/playlists

...will better serve these diverse audiences and create a more professional, inviting experience.

## What Changes

### Public Homepage Enhancements
- **Hero Section**: Add prominent welcome section with choir name, tagline, and visual appeal
- **About/Introduction**: Brief section describing the choir, history, and mission
- **Featured Playlists**: Showcase 2-3 highlighted playlists (seasonal, popular, or admin-selected)
- **Visual Improvements**: Better typography, spacing, visual hierarchy, and color usage
- **Photo Gallery/Visuals**: Display choir photos from performances or promotional images
- **Call-to-Action Sections**: Encourage joining the choir, attending events, following on social
- **Social Media Links**: Add links to Facebook, Instagram, and other social platforms
- **Navigation Enhancement**: Add optional "Browse All Songs" or "Browse Playlists" sections (hybrid approach)

### New Pages
- **Browse Songs Page** (`/songs`): Allow users to browse all visible songs with search/filtering
- **Browse Playlists Page** (`/playlists`): Display all visible playlists with songs count

### Navigation Updates
- **Header Navigation**: Add links to Events, Playlists, Songs in public header
- **Footer**: Enhanced footer with social links, navigation links, and choir info

### project.md Documentation Update
- Reorganize structure for better clarity
- Add comprehensive documentation of enhanced public site features
- Update Public Website section with new capabilities
- Document admin features discovered during exploration
- Add missing content model details

### Database Schema (if needed)
- May add `featured` boolean to playlists table (for featured playlists)
- May add social media links configuration table
- May add choir information/settings table

## Impact

### Affected Specs
- **public-website**: Major additions for homepage sections, new pages, navigation
- **playlists** (minor): May add featured flag
- **project-architecture** (minor): Documentation improvements

### Affected Code
- `/app/(public)/page.tsx` - Homepage (significant changes)
- `/app/(public)/layout.tsx` - Header and footer enhancements
- `/app/(public)/songs/page.tsx` - New page for browsing all songs
- `/app/(public)/playlists/page.tsx` - New page for browsing all playlists
- `/widgets/public-header/` - New widget for public navigation
- `/widgets/public-footer/` - Enhanced footer widget
- `/widgets/hero-section/` - New hero section widget
- `/widgets/about-section/` - New about section widget
- `/widgets/featured-playlists/` - New featured playlists widget
- `/widgets/photo-gallery/` - New photo gallery widget
- `/widgets/cta-section/` - New call-to-action widget
- `/shared/lib/songs.ts` - Add function to fetch all visible songs
- `/shared/lib/playlists.ts` - Add functions for featured/all playlists
- `openspec/project.md` - Documentation updates

### Database Schema Changes
- Potentially add `featured` column to `playlists` table
- Potentially add `choir_settings` table for social links and about content
- Potentially add `choir_photos` table for gallery images

### Migration Considerations
- New database columns are optional (nullable or with defaults)
- Existing functionality remains unchanged
- New pages are additive, not breaking
- Admin panel may need new forms for managing settings/featured content

### User Impact
- **Positive**: More engaging homepage, easier content discovery, better first impression
- **Minimal disruption**: All existing URLs and functionality preserved
- **Admin work**: Will need to populate about content, upload photos, set featured playlists
