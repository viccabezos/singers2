## 1. Project Structure Setup
- [ ] 1.1 Create Feature-Sliced Design directory structure (app, pages, widgets, features, entities, shared layers)
- [ ] 1.2 Set up Next.js route groups: `(public)` for public website, `(admin)` for back office
- [ ] 1.3 Create base layout components for both applications (mobile-first design)
- [ ] 1.4 Configure Tailwind CSS and shadcn components with mobile-first breakpoints

## 2. Authentication Implementation
- [ ] 2.1 Create authentication middleware for admin routes
- [ ] 2.2 Implement login page component for back office
- [ ] 2.3 Set up session management (server-side cookies)
- [ ] 2.4 Create logout functionality
- [ ] 2.5 Add environment variable configuration for password

## 3. Database Integration
- [ ] 3.1 Install Supabase client library
- [ ] 3.2 Create Supabase client configuration utility
- [ ] 3.3 Set up environment variables for Supabase connection
- [ ] 3.4 Create shared database utilities in `shared/` layer

## 4. Application Routes
- [ ] 4.1 Create public website home page route `(public)/page.tsx`
- [ ] 4.2 Create back office dashboard route `(admin)/admin/dashboard/page.tsx`
- [ ] 4.3 Create admin login route `(admin)/admin/login/page.tsx`
- [ ] 4.4 Set up route protection middleware for admin routes

## 5. Shared Components
- [ ] 5.1 Set up shadcn component library configuration
- [ ] 5.2 Create shared UI components in `shared/ui/` (mobile-first responsive design)
- [ ] 5.3 Create shared utilities in `shared/lib/`
- [ ] 5.4 Set up shared types/interfaces in `shared/types/`

## 6. Documentation
- [ ] 6.1 Update `openspec/project.md` with project structure details
- [ ] 6.2 Document environment variables required
- [ ] 6.3 Create README with setup instructions

