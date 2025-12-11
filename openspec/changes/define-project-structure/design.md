# Design: Project Structure

## Context
Singer is a content management platform with two distinct applications:
1. **Public Website**: Open web presence for visitors
2. **Back Office**: Private admin interface for content management, protected by single password authentication

Both applications share the same tech stack (Next.js, Tailwind, shadcn) and database (Supabase) but serve different purposes and user bases.

## Goals / Non-Goals

### Goals
- Clear separation between public and private applications
- Shared component library and utilities
- Single password authentication for back office
- Supabase integration for data persistence
- Feature-Sliced Design architecture compliance
- Scalable structure for future features
- Mobile-first design approach for both applications

### Non-Goals
- Multi-user authentication system (single password only)
- Separate deployments (monorepo approach)
- Complex role-based access control
- Content type definitions (to be defined in future changes)

## Decisions

### Decision: Monorepo Structure with Route Separation
**What**: Use Next.js App Router with route groups to separate public and back office applications within a single Next.js instance. Admin routes use `/admin/*` prefix.

**Why**: 
- Simplifies shared component/library usage
- Single deployment and build process
- Easier code sharing between applications
- Next.js route groups provide clean URL separation
- `/admin/*` prefix provides clear URL distinction

**Alternatives considered**:
- Separate Next.js applications: More complex deployment, harder to share code
- Subdomain approach: Requires additional infrastructure setup

### Decision: Single Password Authentication with Server-Side Sessions
**What**: Back office protected by a single shared password stored as environment variable, validated via middleware. Authentication uses server-side session stored in HTTP-only cookies.

**Why**:
- Simple requirement (single admin user)
- No need for user management system
- Fast to implement and maintain
- Secure enough for small team use case
- HTTP-only cookies prevent XSS attacks
- Server-side validation ensures security

**Alternatives considered**:
- Supabase Auth: Overkill for single password requirement
- OAuth providers: Unnecessary complexity
- Client-side session storage: Less secure, vulnerable to XSS

### Decision: Feature-Sliced Design Architecture
**What**: Organize code following FSD layers: app, pages, widgets, features, entities, shared.

**Why**:
- User requirement
- Provides clear separation of concerns
- Scales well with feature growth
- Industry-standard frontend architecture pattern

### Decision: Supabase as Database
**What**: Use Supabase for PostgreSQL database, authentication (if needed later), and real-time capabilities.

**Why**:
- User requirement
- Provides managed PostgreSQL
- Built-in API generation
- Good Next.js integration

### Decision: Mobile-First Design Approach
**What**: Both public website and back office applications SHALL be designed and developed using a mobile-first approach, where mobile interfaces are designed first, then enhanced for tablet and desktop.

**Why**:
- User requirement
- Ensures optimal experience on mobile devices (primary access method for many users)
- Progressive enhancement approach leads to cleaner, more focused designs
- Tailwind CSS breakpoints naturally support mobile-first development
- Better performance on mobile devices

**Alternatives considered**:
- Desktop-first approach: Would require more rework for mobile, potentially worse mobile UX

## Risks / Trade-offs

- **Single password security**: Risk if password is compromised → Mitigation: Use strong password, consider environment variable rotation, use HTTPS in production
- **Route separation complexity**: Risk of route conflicts → Mitigation: Clear naming conventions, route group organization
- **Shared state management**: Risk of coupling between apps → Mitigation: Clear FSD boundaries, shared code in `shared/` layer only
- **Session management**: Risk of session hijacking → Mitigation: HTTP-only cookies, secure flag in production, session expiry

## Migration Plan
N/A - This is initial structure definition.

## Open Questions
- What content types will be managed in the back office? (To be defined in future changes)
- Will public website need any authentication for future features? (To be determined based on requirements)

