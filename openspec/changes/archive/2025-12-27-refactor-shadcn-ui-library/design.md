## Context
The current admin interface has 3 main entity types (Songs, Playlists, Events) with nearly identical UI patterns:
- List pages with headers, filters, and data tables
- Archive pages with restore/delete actions
- Forms with validation and submit handling
- Status badges (visible/hidden, playlist status)
- Action buttons (Edit, Delete, Archive, Restore)

Each implementation is copy-pasted with minor variations, resulting in:
- ~378 lines in `songs-list-client.tsx`
- ~221 lines in `playlists-list-client.tsx`
- ~332 lines in `events-list-client.tsx`
- ~129 lines per archive page (×3)
- ~260+ lines per form (×3)

Total: ~2,500+ lines of repetitive UI code.

## Goals / Non-Goals

### Goals
- Reduce code duplication by 60-70%
- Establish consistent design system using shadcn/ui
- Create prop-driven components that adapt to different entity types
- Follow Feature-Sliced Design: components in `shared/ui/`
- Maintain current visual appearance and behavior
- Keep mobile-first responsive design

### Non-Goals
- Visual redesign (keep current look)
- New features or functionality
- Changes to business logic or data flow
- Public website refactoring (admin only)

## Decisions

### Decision: Use shadcn/ui as Base Component Layer
**What**: Install shadcn components via CLI into `components/ui/` and build domain components in `shared/ui/`.

**Why**:
- Already configured in `components.json` (new-york style, neutral colors)
- Provides accessible, well-tested primitives
- Tailwind-based, matches existing styling approach
- Components are copied locally, allowing customization

**Alternatives considered**:
- Custom components from scratch: More work, less accessible
- Radix UI directly: More boilerplate, shadcn already wraps it

### Decision: Create Domain-Specific Wrapper Components
**What**: Build reusable components in `shared/ui/` that compose shadcn primitives:

```
shared/ui/
├── admin-page-layout.tsx    # Page wrapper with breadcrumbs, header, actions
├── data-table.tsx           # Generic table with columns config
├── filter-panel.tsx         # Configurable filter form
├── status-badge.tsx         # Visibility/status badges
├── action-buttons.tsx       # Edit/Delete/Archive button group
├── empty-state.tsx          # "No items found" display
├── form-field.tsx           # Label + input + error wrapper
├── archive-list.tsx         # Generic archive list component
└── index.ts                 # Public API exports
```

**Why**:
- Follows FSD: shared layer for reusable UI
- Props-driven: same component, different data
- Composable: mix and match as needed

### Decision: Column Configuration Pattern for Tables
**What**: Use a column config array pattern for data tables:

```tsx
const columns: Column<Song>[] = [
  { key: "title", header: "Title", render: (song) => <TitleCell song={song} /> },
  { key: "artist", header: "Artist", accessor: "artist_composer" },
  { key: "status", header: "Status", render: (song) => <StatusBadge visible={song.is_visible} /> },
  { key: "actions", header: "Actions", render: (song) => <ActionButtons item={song} /> },
];
```

**Why**:
- Declarative column definition
- Custom renderers for complex cells
- Reusable across all entity types
- Easy to add/remove columns

### Decision: Render Props for Custom Actions
**What**: Use render props for entity-specific actions:

```tsx
<DataTable
  data={songs}
  columns={columns}
  onRowAction={(action, item) => handleAction(action, item)}
  renderBulkActions={(selected) => <BulkActions ids={selected} />}
/>
```

**Why**:
- Keeps business logic in page components
- Components remain generic and reusable
- Type-safe with generics

## Risks / Trade-offs

### Risk: Breaking Existing Functionality
**Mitigation**: 
- Refactor one entity at a time (Songs first, then Playlists, then Events)
- Manual testing after each entity
- Keep old components until new ones are verified

### Risk: Over-Abstraction
**Mitigation**:
- Start with simple prop-driven components
- Only abstract patterns that appear 3+ times
- Keep entity-specific logic in page components

### Trade-off: Initial Setup Time
**Cost**: Installing shadcn components and creating wrappers takes time upfront.
**Benefit**: Faster development and easier maintenance long-term.

## Migration Plan

### Phase 1: Foundation (Tasks 1-2)
1. Install shadcn base components via CLI
2. Create core wrapper components in `shared/ui/`

### Phase 2: Songs Refactor (Tasks 3-4)
3. Refactor Songs list page to use new components
4. Refactor Songs archive page
5. Refactor Songs form (if patterns emerge)

### Phase 3: Playlists Refactor (Tasks 5-6)
6. Refactor Playlists list page
7. Refactor Playlists archive page

### Phase 4: Events Refactor (Tasks 7-8)
8. Refactor Events list page
9. Refactor Events archive page

### Rollback
- Keep old component files until full migration is complete
- Can revert individual entity refactors independently

## Open Questions
- None currently - scope is well-defined as internal refactor

