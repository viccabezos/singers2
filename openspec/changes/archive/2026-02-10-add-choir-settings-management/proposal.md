# Change: Add Choir Settings Management

## Why

The public website widgets currently use placeholder content (taglines, about text, social media links). To make the site dynamic and admin-manageable, we need:
- Database storage for choir settings (about text, tagline, social links, contact email)
- Admin interface to manage these settings
- Integration to pull real data into the widgets

This allows choir administrators to update site content without code changes or deployments.

## What Changes

### Database Schema
- **New table**: `choir_settings` (singleton table)
  - `id` (primary key, always 1)
  - `tagline` (text, nullable) - Hero section tagline
  - `about_text` (text, nullable) - About section content
  - `facebook_url` (text, nullable) - Facebook link
  - `instagram_url` (text, nullable) - Instagram link
  - `youtube_url` (text, nullable) - YouTube link
  - `contact_email` (text, nullable) - Contact email
  - `created_at`, `updated_at` (timestamps)

### Admin Interface
- **New page**: `/admin/settings`
  - Settings form with all fields
  - Save button with optimistic UI
  - Validation (URL format, email format)
- **Navigation**: Add "Settings" link to admin nav
- **Dashboard**: Add quick link to settings

### Shared Library
- **New file**: `shared/lib/settings.ts`
  - `getChoirSettings()` - Fetch settings
  - `updateChoirSettings()` - Update settings
- **Update**: `shared/types/database.ts` - Add ChoirSettings type

### Widget Integration
- Update `hero-section` to use real tagline (fallback to default)
- Update `about-section` to use real about_text (fallback to placeholder)
- Update `public-footer` to use real social URLs (hide icons if not set)
- Update `cta-section` to use real contact_email

## Impact

### Affected Specs
- **back-office**: Add settings management requirements
- **public-website**: Update widgets to use dynamic content

### Affected Code
- `/app/(admin)/admin/settings/page.tsx` - New settings page
- `/app/(admin)/admin/settings/settings-form.tsx` - New form component
- `/app/(admin)/admin/settings/actions.ts` - New server actions
- `/widgets/admin-nav/` - Add settings link
- `/widgets/hero-section/hero-section.tsx` - Fetch and use real tagline
- `/widgets/about-section/about-section.tsx` - Fetch and use real about text
- `/widgets/public-footer/public-footer.tsx` - Fetch and use real social links
- `/widgets/cta-section/cta-section.tsx` - Use real contact email
- `/shared/lib/settings.ts` - New library file
- `/shared/types/database.ts` - Add ChoirSettings type
- `supabase/migrations/` - New migration file

### Database Schema Changes
- New `choir_settings` table (singleton pattern)
- Initial row with default values seeded

### Migration Considerations
- Migration creates table and seeds default row
- All columns nullable (graceful degradation)
- Widgets fall back to placeholders if settings empty
- No breaking changes

### User Impact
- **Admins**: New settings page to manage site content
- **Public users**: See dynamic content instead of placeholders
- **No disruption**: Graceful fallbacks ensure site works without settings
