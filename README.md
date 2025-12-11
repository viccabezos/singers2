# Singer

A content management platform with a public website and private back office, built with Next.js, Tailwind CSS, shadcn, and Supabase.

## Project Structure

This project follows **Feature-Sliced Design** architecture and uses Next.js App Router with route groups to separate:

- **Public Website** (`app/(public)/`) - Open web presence for visitors
- **Back Office** (`app/(admin)/admin/`) - Private admin interface for content management

### Directory Structure

```
├── app/
│   ├── (public)/          # Public website routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (admin)/           # Admin route group
│   │   └── admin/         # Admin routes with /admin/* prefix
│   │       ├── login/     # Login page
│   │       ├── dashboard/ # Admin dashboard
│   │       └── logout/    # Logout handler
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── shared/                # Shared code (FSD shared layer)
│   ├── lib/               # Shared utilities
│   │   ├── auth.ts        # Authentication utilities
│   │   └── supabase.ts    # Supabase client
│   ├── ui/                # Shared UI components
│   └── types/             # Shared TypeScript types
├── pages/                 # FSD pages layer
├── widgets/               # FSD widgets layer
├── features/              # FSD features layer
└── entities/              # FSD entities layer
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd singers2
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the public website.

6. Access the back office at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Features

### Public Website
- Accessible at `/` (root)
- Mobile-first responsive design
- Built with Tailwind CSS and shadcn components

### Back Office
- Protected by single password authentication
- Accessible at `/admin/*` routes
- Session-based authentication with HTTP-only cookies
- Mobile-first responsive design

### Authentication
- Single password authentication for admin access
- Server-side session management
- Secure HTTP-only cookies
- Automatic redirect to login for protected routes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Runtime**: Bun
- **Architecture**: Feature-Sliced Design

## Development

### Mobile-First Design
All components and pages are designed mobile-first, then enhanced for tablet and desktop using Tailwind breakpoints (`sm:`, `md:`, `lg:`).

### Adding New Features
Follow Feature-Sliced Design principles:
- Place shared code in `shared/`
- Create features in `features/`
- Use entities for business logic in `entities/`
- Compose pages in `pages/`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_PASSWORD` | Password for back office access | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

### Finding Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Project Settings** → **API**
4. Find:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → Use the `anon` `public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing

This project uses **Bun's built-in test runner** for testing Supabase integration.

### Running Tests

```bash
bun test
```

### Test Structure

Tests are located alongside source files with `.test.ts` extension:
- `shared/lib/supabase.test.ts` - Supabase integration tests

### Test Coverage

The test suite covers:
- Environment variable validation
- Supabase client initialization
- Database connection testing
- Basic CRUD operations (Create, Read, Update, Delete)
- Error handling

### Prerequisites for Tests

Tests require valid Supabase credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Some tests will be skipped if environment variables are not set (with warnings logged).

### Troubleshooting Tests

If tests fail:
1. Verify your `.env.local` file exists and contains valid Supabase credentials
2. Check that your Supabase project is accessible
3. Ensure database migrations have been run (for CRUD tests)
4. See `docs/testing-troubleshooting.md` for detailed troubleshooting guide

## Routes

### Public Routes
- `/` - Home page

### Admin Routes (Protected)
- `/admin` - Redirects to dashboard
- `/admin/login` - Login page
- `/admin/dashboard` - Admin dashboard
- `/admin/logout` - Logout handler

## Database Setup

### Row Level Security (RLS) Policies

After creating the `songs` table, you need to set up RLS policies to allow operations:

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `docs/supabase-rls-policies.sql`

This will:
- Enable RLS on the songs table
- Allow public to read visible, non-archived songs
- Allow all operations (INSERT, UPDATE, DELETE) for the anon key (since admin auth is handled via password middleware)

**Important**: Without these policies, you'll get "new row violates row-level security policy" errors when creating/updating songs.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
