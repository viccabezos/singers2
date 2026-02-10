# Change: Add Public Website Widgets with Skeleton States

## Why

To visualize the enhanced public homepage structure and test responsive layouts before implementing backend functionality, we need to create all public-facing widgets with placeholder/skeleton content. This allows us to:
- See the complete homepage structure immediately
- Test mobile-first responsive layouts across devices
- Iterate on design and spacing without database dependencies
- Provide skeleton loaders for future data-loading states
- Get early feedback on visual hierarchy and user experience

## What Changes

### New Widgets
- **Hero Section** (`widgets/hero-section/`) - Welcome banner with choir name and placeholder tagline
- **About Section** (`widgets/about-section/`) - Choir description with placeholder text
- **Featured Playlists** (`widgets/featured-playlists/`) - Showcase section with skeleton cards
- **Photo Gallery** (`widgets/photo-gallery/`) - Grid layout with skeleton/placeholder images
- **CTA Section** (`widgets/cta-section/`) - Call-to-action buttons with placeholder links
- **Public Header** (`widgets/public-header/`) - Enhanced navigation with mobile menu
- **Public Footer** (`widgets/public-footer/`) - Footer with navigation, placeholder social links, copyright

### Homepage Updates
- Compose homepage with all new widgets in proper order
- Maintain existing current event banner and upcoming events
- Apply consistent spacing and visual hierarchy

### Layout Updates
- Replace simple header/footer in `app/(public)/layout.tsx` with new widgets
- Ensure dark mode support across all widgets

### Styling
- Mobile-first responsive layouts
- Consistent typography and spacing
- Visual separation between sections
- Skeleton loading states with shimmer effects

## Impact

### Affected Specs
- **public-website**: Add requirements for all new widgets and sections

### Affected Code
- `/widgets/hero-section/` - New widget
- `/widgets/about-section/` - New widget
- `/widgets/featured-playlists/` - New widget
- `/widgets/photo-gallery/` - New widget
- `/widgets/cta-section/` - New widget
- `/widgets/public-header/` - New widget
- `/widgets/public-footer/` - New widget
- `/app/(public)/page.tsx` - Updated homepage composition
- `/app/(public)/layout.tsx` - Updated with new header/footer

### Database Schema Changes
None (this change uses only placeholder/skeleton content)

### Migration Considerations
- All widgets gracefully handle missing data with skeletons/placeholders
- No breaking changes to existing functionality
- New header/footer replace simple ones but maintain same navigation structure

### User Impact
- **Positive**: More engaging homepage structure visible immediately
- **No disruption**: All existing functionality preserved
- **Visual preview**: Stakeholders can see final structure before data integration
