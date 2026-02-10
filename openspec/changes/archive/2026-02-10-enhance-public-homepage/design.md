# Design: Enhanced Public Homepage

## Context

The current public homepage (`app/(public)/page.tsx`) is minimal - it shows:
1. Current event banner (if a current event is set)
2. Grid of upcoming events (up to 10)
3. Empty state if no events

This is functional for event-driven navigation but doesn't:
- Introduce the choir to new visitors
- Showcase the choir's personality or mission
- Provide visual appeal or engagement
- Allow direct browsing of songs/playlists outside events
- Include calls-to-action for joining or following

**Constraints:**
- Mobile-first design (critical - choir members use phones on stage)
- High accessibility (older users, various lighting conditions)
- Performance (fast loading during live events)
- Feature-Sliced Design architecture
- No authentication required for public pages

**Stakeholders:**
- Choir members (primary users - need easy lyrics access)
- Potential new members (discovery)
- Audience members (follow along during events)
- Choir administrators (want professional public presence)

## Goals / Non-Goals

### Goals
- Create a welcoming, professional first impression
- Introduce the choir's mission and personality
- Provide visual appeal without sacrificing performance
- Enable direct browsing of songs/playlists (hybrid navigation)
- Include social media links and calls-to-action
- Maintain mobile-first, accessible design
- Preserve existing event-driven navigation
- Make it easy for admins to manage new content

### Non-Goals
- User accounts or personalization (future consideration)
- Complex animations or heavy media (performance priority)
- Search functionality (can be added later)
- Comments or social features
- Monetization features (mentioned in roadmap but not now)
- Multi-language support (not requested)

## Decisions

### Decision 1: Homepage Section Order
**Order:**
1. Hero section (welcome)
2. Current event banner (if exists)
3. Featured playlists
4. Upcoming events grid
5. About/introduction
6. Photo gallery
7. Call-to-action sections
8. Footer (social links)

**Rationale:**
- Hero first creates immediate impression
- Current event is time-sensitive and high-priority
- Featured playlists provide quick content access
- Upcoming events remain prominent
- About/gallery lower (less critical for returning users)
- CTAs at bottom after engagement

**Alternatives considered:**
- About section first: Too much reading before event access
- No hero section: Misses opportunity for strong branding
- Featured playlists after about: Delays access to content

### Decision 2: Content Storage Strategy
**Choice:** Database-backed with admin management

Create new tables:
- `choir_settings` (singleton): social links, about text, tagline
- `choir_photos` (multiple): gallery images with captions, order
- Add `featured` boolean to existing `playlists` table

**Rationale:**
- Admins can update content without code changes
- Consistent with existing admin pattern
- Easy to extend later
- Type-safe with Supabase

**Alternatives considered:**
- CMS integration (Contentful, Sanity): Overkill, additional dependency
- Static content in code: Not admin-friendly, requires deployments
- JSON config files: Less type-safe, harder to manage

### Decision 3: Featured Playlists Selection
**Choice:** Admin-selected via boolean flag + manual ordering

Add to playlists table:
- `featured` boolean (default false)
- `featured_order` integer (for ordering)

Display up to 3 featured playlists on homepage.

**Rationale:**
- Admins have full control over what's featured
- Simple to implement (no algorithm needed)
- Explicit is better than automatic for small dataset
- Easy to understand and manage

**Alternatives considered:**
- Auto-featured by most songs: Doesn't account for quality/seasonality
- Auto-featured by recent: May show incomplete playlists
- Tags-based (seasonal, popular): More complexity, similar outcome

### Decision 4: Browse Songs/Playlists Pages
**Choice:** Create `/songs` and `/playlists` pages with simple list views

Features:
- List all visible items
- Basic filtering (search by title)
- Link to detail pages
- Maintain event context breadcrumb if navigated from event

**Rationale:**
- Supports hybrid navigation model
- Simple, performant implementation
- Doesn't duplicate existing detail pages
- Easy to extend with more filters later

**Alternatives considered:**
- No standalone pages: Limits discovery outside events
- Complex filtering (by genre, language): Can add later if needed
- Separate navigation tree: Confusing, harder to maintain

### Decision 5: Photo Gallery Implementation
**Choice:** Simple responsive grid with lightbox (optional)

- Upload photos via admin panel
- Store in Supabase Storage
- Display 4-6 photos in grid on homepage
- Optional: click to view larger (simple modal or next/image optimization)

**Rationale:**
- Visual appeal without heavy media
- Admin control over images
- Leverages existing Supabase infrastructure
- next/image provides optimization

**Alternatives considered:**
- Carousel/slider: More complexity, less accessible
- Full gallery page: Not requested, can add later
- External image service: Additional dependency

### Decision 6: Social Media Links
**Choice:** Store in `choir_settings` table, display in footer + optional CTA

Fields in choir_settings:
- `facebook_url` (nullable text)
- `instagram_url` (nullable text)
- `youtube_url` (nullable text)
- `email` (nullable text)

Display icons in footer, link to respective platforms.

**Rationale:**
- Admin can update without code changes
- Standard social media integration pattern
- Footer location is conventional

**Alternatives considered:**
- Hardcoded links: Requires deployments to change
- Separate social_links table: Overkill for ~4 links
- Header placement: Too prominent, distracts from content

### Decision 7: Widget Organization (Feature-Sliced Design)
**Structure:**
```
widgets/
├── hero-section/           # Welcome hero with tagline
├── about-section/          # Choir introduction
├── featured-playlists/     # Featured playlists showcase
├── photo-gallery/          # Photo grid
├── cta-section/            # Call-to-action buttons
├── public-header/          # Enhanced navigation
└── public-footer/          # Footer with social links
```

**Rationale:**
- Each widget is self-contained
- Follows existing architecture pattern
- Easy to reorder, remove, or replace
- Clear responsibility boundaries

**Alternatives considered:**
- Single "homepage-sections" widget: Less modular
- Features layer: Not needed, these are presentational
- Shared UI: Too generic for homepage-specific sections

### Decision 8: Admin Interface for New Content
**Forms needed:**
1. Settings form (about, tagline, social links)
2. Photo upload/management
3. Featured playlist toggle (add to playlist edit form)

**Location:**
- `/admin/settings` - New settings page
- `/admin/photos` - Photo gallery management
- Enhance `/admin/playlists/[id]` with featured toggle

**Rationale:**
- Consistent with existing admin patterns
- Centralized settings make sense
- Photo management similar to songs/playlists
- Featured toggle on playlist form is intuitive

## Risks / Trade-offs

### Risk 1: Content Management Overhead
**Risk:** Admins need to populate about content, upload photos, set featured playlists
**Mitigation:** 
- Provide sensible defaults
- Make all new content optional (graceful degradation)
- Document in admin UI what content is needed
- Consider seed data or example content

### Risk 2: Performance Impact
**Risk:** More content on homepage = slower load
**Mitigation:**
- Use next/image for optimized images
- Limit featured playlists to 3
- Limit photos to 6
- Server components for most content
- Cache database queries
- Monitor Core Web Vitals

### Risk 3: Mobile Experience
**Risk:** More sections = more scrolling on mobile
**Mitigation:**
- Keep sections concise
- Prioritize important content at top
- Use progressive disclosure
- Test on actual phones
- Consider "Quick Access" sticky nav

### Risk 4: Admin Complexity
**Risk:** More forms and settings to manage
**Mitigation:**
- Clear UI organization
- Helpful placeholder text
- Preview functionality where possible
- Document in admin dashboard

### Risk 5: Database Schema Changes
**Risk:** Need migration, potential issues
**Mitigation:**
- Use nullable columns for all new fields
- Provide default values
- Test migration thoroughly
- Backward-compatible changes

## Migration Plan

### Phase 1: Database Schema
1. Create migration for new tables and columns
2. Add `choir_settings`, `choir_photos` tables
3. Add `featured`, `featured_order` to `playlists`
4. Run migration on development
5. Test with sample data

### Phase 2: Admin Interface
1. Create settings management page
2. Add photo upload and management
3. Add featured toggle to playlist form
4. Test admin workflows

### Phase 3: Public Frontend
1. Create new widgets (hero, about, featured, gallery, cta)
2. Enhance header and footer
3. Create `/songs` and `/playlists` pages
4. Update homepage composition
5. Test on multiple devices

### Phase 4: Content Population
1. Admins populate choir settings
2. Upload initial photos
3. Set featured playlists
4. Review and refine

### Rollback Plan
- Keep existing homepage code as backup
- New features are additive (can be hidden)
- Database changes are nullable (can be empty)
- Can disable new sections via feature flags if needed

## Open Questions

1. **Should featured playlists be seasonal/rotatable?**
   - Proposal: Yes, admins manually change featured playlists
   - Could add "auto-unfeature after date" in future

2. **How many photos in gallery?**
   - Proposal: 4-6 photos, configurable by admin
   - Display most recent or admin-ordered

3. **Should there be an "About" page or just homepage section?**
   - Proposal: Homepage section first (simpler)
   - Can add full `/about` page later if needed

4. **What should "Browse All Songs" show?**
   - Proposal: Simple list with title, artist, language
   - Alphabetical by default
   - Optional: filter by language, search by title

5. **Should navigation include "Home" link when on homepage?**
   - Proposal: Logo always links to home
   - Nav items: Events, Playlists, Songs (not "Home")

6. **Should social links open in new tab?**
   - Proposal: Yes (standard pattern for external links)

7. **What's the minimum content for launch?**
   - Proposal: About text and tagline required
   - Photos, featured playlists, social links optional
   - Show sections only if content exists

## Success Metrics

- Homepage loads in < 2 seconds on 3G
- No layout shift after initial render
- All touch targets ≥ 44px on mobile
- Lighthouse score ≥ 90
- Admin can update all content without code changes
- Existing event navigation works unchanged
