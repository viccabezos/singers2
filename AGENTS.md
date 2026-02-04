<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:network      # Dev server accessible on network

# Build & Deploy
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run test             # Run all tests (bun test)
bun test shared/lib/auth.test.ts              # Run single test file
bun test --test-name-pattern="verifyPassword" # Run specific test

# OpenSpec
openspec list                        # List active changes
openspec list --specs                # List specifications  
openspec validate <id> --strict     # Validate change/spec
openspec archive <id> --yes          # Archive completed change
```

## Architecture (Feature-Sliced Design)

Imports flow **downward only**:

```
app/           # Next.js App Router (pages, layouts, routes)
widgets/       # Self-contained UI blocks (compose features)
features/      # User interactions (optional layer)
shared/        # Reusable infrastructure
├── lib/       # Utilities (cn, formatDate, supabase client)
├── ui/        # Design system components
├── types/     # TypeScript types
└── api/       # API clients
```

**Layer Rules:**
- ✅ `widgets/` imports from `shared/`
- ❌ Never import from same layer (no cross-widget imports)
- ❌ Never import upward (shared can't import widgets)
- Each slice exposes public API via `index.ts` only

## Code Style

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Folders/Files | `kebab-case` | `event-calendar/`, `auth-form.tsx` |
| Components | `PascalCase` | `EventCalendar`, `AuthForm` |
| Hooks | `camelCase` + `use` | `useAuth`, `useSupabase` |
| Types | `PascalCase` | `Event`, `PlaylistInput` |
| Constants | `SCREAMING_SNAKE_CASE` | `SESSION_DURATION` |

### TypeScript
- Use explicit return types on exported functions
- Prefer `interface` for object types (extensible)
- Use `type` for unions, intersections, aliases
- Strict mode enabled - avoid `any`

### Import Order
1. React/Next.js builtins
2. External libraries (lucide-react, date-fns)
3. Internal UI components (`@/components/ui/*`, `@/shared/ui`)
4. Utilities (`@/lib/utils`, `@/shared/lib/*`)
5. Types (`@/shared/types/*`)

### Formatting
- Semicolons: required
- Quotes: single quotes
- Trailing commas: always (multiline)
- Indent: 2 spaces
- Max line length: practical (no strict limit)

### Components
```typescript
// Function declaration (not arrow function)
function Button({ className, variant }: ButtonProps) {
  return <button className={cn("base", className)} />;
}

// Props interface
interface ButtonProps {
  className?: string;
  variant?: "default" | "outline";
}
```

- Use `"use client"` directive for client components
- Use `cn()` from `@/lib/utils` for conditional classes
- Destructure props in parameters

### Error Handling
- Try/catch for async operations
- Throw descriptive errors with context
- Never swallow errors silently

### Testing (Bun)
```typescript
import { describe, it, expect } from "bun:test";

describe("Feature", () => {
  it("should do something", () => {
    expect(result).toBe(expected);
  });
});
```

## UI Conventions

- **Mobile-first** (see `.cursor/rules/mobile-first-always.mdc`)
- **shadcn/ui**: Base components from `@/components/ui/*`
- **Icons**: `lucide-react` (tree-shakeable)
- **Tailwind v4**: CSS-first configuration
- **Styling**: Tailwind classes, avoid inline styles
- **Accessibility**: aria-labels, keyboard navigation
- **Design**: See `.cursor/rules/frontend-design-skill.mdc`

## Project Conventions

- Path alias: `@/*` maps to project root
- Date formatting: French locale (`fr-FR`)
- Database: Supabase (PostgreSQL)
- Auth: Cookie-based sessions
- **NEVER commit secrets** (.env.local)

## Anti-Patterns

- ❌ God components (too much logic)
- ❌ Barrel file abuse (export everything)
- ❌ Import from internal paths (use public API)
- ❌ Business logic in UI components
- ❌ Skip error handling
- ❌ `console.log` in production code

## References

- Cursor rules: `.cursor/rules/*.mdc`
- OpenSpec details: `openspec/AGENTS.md`
- Project conventions: `openspec/project.md`
