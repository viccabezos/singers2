## 1. Header Component
- [ ] 1.1 Create `widgets/public-header/` directory
- [ ] 1.2 Create header component with logo/app name
- [ ] 1.3 Add home link functionality
- [ ] 1.4 Style for mobile-first
- [ ] 1.5 Add dark mode support
- [ ] 1.6 Ensure 44px touch targets

## 2. Breadcrumb Component
- [ ] 2.1 Create `widgets/public-breadcrumbs/` directory
- [ ] 2.2 Create breadcrumb component
- [ ] 2.3 Accept items prop with label, href, isCurrent
- [ ] 2.4 Style breadcrumbs with separators
- [ ] 2.5 Add dark mode support
- [ ] 2.6 Ensure clickable areas are adequate

## 3. Layout Integration
- [ ] 3.1 Update `app/(public)/layout.tsx` to include Header
- [ ] 3.2 Ensure Header appears on all pages
- [ ] 3.3 Remove duplicate headers from individual pages

## 4. Page Updates
- [ ] 4.1 Update `app/(public)/page.tsx` - remove duplicate header
- [ ] 4.2 Update `app/(public)/events/page.tsx` - remove duplicate header
- [ ] 4.3 Update `app/(public)/event/[id]/event-display.tsx` - add breadcrumbs
- [ ] 4.4 Update `app/(public)/playlist/[id]/playlist-display.tsx` - add breadcrumbs
- [ ] 4.5 Update `app/(public)/song/[id]/lyrics-display.tsx` - add breadcrumbs

## 5. Testing
- [ ] 5.1 Test header appears on all pages
- [ ] 5.2 Test header links work
- [ ] 5.3 Test breadcrumbs on event page
- [ ] 5.4 Test breadcrumbs on playlist page
- [ ] 5.5 Test breadcrumbs on song page
- [ ] 5.6 Test mobile viewport
- [ ] 5.7 Test dark mode

## 6. Validation
- [ ] 6.1 Run `npm run lint` - no errors
- [ ] 6.2 Run `npm run build` - builds successfully
- [ ] 6.3 Verify all acceptance criteria met
