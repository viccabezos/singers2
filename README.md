# Les Chanteurs Platform

A platform for managing choir events and playlists with:
- Admin interface (Refine)
- Public web interface (Next.js)

## Project Structure

This is a Turborepo monorepo using bun as package manager. Key packages:

### Apps
- `admin`: Back-office interface (Refine)
- `web`: Public website (Next.js)
- `docs`: Documentation (Next.js)

### Packages
- `@repo/ui`: Shared React components
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configs

## Development

All commands use bun:

```sh
# Install dependencies
bun install

# Run dev servers
bun run dev

# Build all apps
bun run build

# Run linting
bun run lint
```

## Key Features
- Mobile-first design
- High contrast UI
- Dark mode support
- Adjustable font sizes for lyrics

## Project Guidelines
- Follow Feature-Sliced Design (FSD) architecture
- Use OpenSpec for major changes
- Maintain strict TypeScript typing
- Prefer functional components

## OpenSpec Guidelines

For major changes, follow the OpenSpec workflow:

1. **Create a proposal**:
   ```sh
   /openspec-proposal "Description of your change"
   ```
2. **Get approval** from maintainers
3. **Implement the change**:
   ```sh
   /openspec-apply "Proposal ID"
   ```
4. **Archive after deployment**:
   ```sh
   /openspec-archive "Proposal ID"
   ```

Key rules:
- Always create proposals for architectural changes
- Keep specs in `openspec/` directory
- Reference existing specs when possible
- Use exact command syntax shown above

See `openspec/AGENTS.md` for contribution guidelines.
