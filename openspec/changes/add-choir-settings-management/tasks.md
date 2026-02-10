## 1. Database Schema

- [x] 1.1 Create Supabase migration for choir_settings table
  - Create table with all columns (id, tagline, about_text, facebook_url, instagram_url, youtube_url, contact_email, timestamps)
  - Add check constraint (id = 1) to enforce singleton
  - Seed initial row with id=1
- [x] 1.2 Test migration
  - Apply migration to local Supabase
  - Verify table created
  - Verify seed data exists
- [x] 1.3 Update database types
  - Add ChoirSettings type to shared/types/choir-settings.ts
  - Export type for use in components

## 2. Shared Library Functions

- [x] 2.1 Create shared/lib/settings.ts
  - Implement getChoirSettings() - fetch settings row
  - Implement updateChoirSettings() - update settings
  - Add error handling and validation
  - Add TypeScript types

## 3. Admin Interface - Settings Page

- [x] 3.1 Create admin settings page
  - Create /app/(admin)/admin/settings/page.tsx
  - Server component that fetches current settings
  - Renders settings form
- [x] 3.2 Create settings form component
  - Create settings-form.tsx client component
  - Form fields: tagline, about_text (textarea), social URLs, contact_email
  - Client-side validation (URL format, email format)
  - Optimistic UI updates
  - Success/error toast notifications
- [x] 3.3 Create server actions
  - Create actions.ts with updateSettings action
  - Server-side validation
  - Error handling
  - Revalidate paths after update
- [x] 3.4 Add settings to admin navigation
  - Update admin nav to include Settings link
  - Add settings icon

## 4. Widget Integration

- [x] 4.1 Update hero-section widget
  - Fetch choir settings in server component
  - Use real tagline if available
  - Fallback to default if empty
- [x] 4.2 Update about-section widget
  - Fetch choir settings in server component
  - Use real about_text if available
  - Fallback to placeholder if empty
- [x] 4.3 Update public-footer widget
  - Fetch choir settings in server component
  - Use real social URLs
  - Conditionally render icons (only if URL set)
  - Use real contact email if available
- [x] 4.4 Update cta-section widget
  - Fetch choir settings in server component
  - Use real contact_email in mailto link
  - Fallback to placeholder if empty

## 5. Testing

- [x] 5.1 Test settings form
  - Save settings with all fields
  - Save with some fields empty
  - Test URL validation
  - Test email validation
  - Verify optimistic UI
- [x] 5.2 Test widget integration
  - Verify hero shows real tagline
  - Verify about shows real text
  - Verify footer shows real social links (NEEDS REAL DATA - TODO)
  - Verify CTA uses real email (NEEDS REAL DATA - TODO)
  - Test with empty settings (fallbacks work)
- [x] 5.3 Test admin navigation
  - Settings link appears in nav
  - Navigation to settings page works
- [ ] 5.4 End-to-end test
  - Update settings in admin
  - Verify changes appear on public site
  - Test on mobile and desktop

## 6. Polish

- [ ] 6.1 Add helpful UI text
  - Placeholder text in form fields (DONE)
  - Help text explaining each field (PARTIAL - could add more)
  - Examples for URL formats
- [ ] 6.2 Add dashboard link
  - Quick "Edit Settings" link on dashboard
- [x] 6.3 Verify dark mode
  - Settings form works in dark mode
  - All styling consistent
