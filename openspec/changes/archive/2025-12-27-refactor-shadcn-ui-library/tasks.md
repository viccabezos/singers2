## 1. Install shadcn Base Components
- [x] 1.1 Install Button component via `bunx shadcn@latest add button`
- [x] 1.2 Install Input component via `bunx shadcn@latest add input`
- [x] 1.3 Install Textarea component via `bunx shadcn@latest add textarea`
- [x] 1.4 Install Select component via `bunx shadcn@latest add select`
- [x] 1.5 Install Checkbox component via `bunx shadcn@latest add checkbox`
- [x] 1.6 Install Card component via `bunx shadcn@latest add card`
- [x] 1.7 Install Badge component via `bunx shadcn@latest add badge`
- [x] 1.8 Install Table component via `bunx shadcn@latest add table`
- [x] 1.9 Install Dialog component via `bunx shadcn@latest add dialog`
- [x] 1.10 Install Alert Dialog component via `bunx shadcn@latest add alert-dialog`

## 2. Create Core Wrapper Components
- [x] 2.1 Create `shared/ui/admin-page-layout.tsx` with breadcrumbs, title, description, and action slot
- [x] 2.2 Create `shared/ui/status-badge.tsx` with visibility and playlist status variants
- [x] 2.3 Create `shared/ui/empty-state.tsx` with icon, title, description, and action props
- [x] 2.4 Create `shared/ui/form-field.tsx` with label, required indicator, and error message
- [x] 2.5 Create `shared/ui/filter-panel.tsx` with configurable filters and apply button
- [x] 2.6 Create `shared/ui/data-table.tsx` with column config, selection, and responsive layout
- [x] 2.7 Create `shared/ui/action-buttons.tsx` with edit/delete button patterns
- [x] 2.8 Create `shared/ui/archive-list.tsx` with restore/delete actions
- [x] 2.9 Create `shared/ui/index.ts` barrel file exporting all components

## 3. Refactor Songs List Page
- [x] 3.1 Replace songs-list-client.tsx page wrapper with AdminPageLayout
- [x] 3.2 Replace filter section with FilterPanel component
- [x] 3.3 Replace songs table with DataTable component
- [x] 3.4 Replace visibility badges with StatusBadge component
- [x] 3.5 Replace action buttons with ActionButtons component
- [x] 3.6 Replace empty state with EmptyState component

## 4. Refactor Songs Archive Page
- [x] 4.1 Replace archive-list-client.tsx with ArchiveList component
- [x] 4.2 Update page wrapper to use AdminPageLayout

## 5. Refactor Playlists List Page
- [x] 5.1 Replace playlists-list-client.tsx page wrapper with AdminPageLayout
- [x] 5.2 Replace filter section with FilterPanel component
- [x] 5.3 Replace playlists table with DataTable component
- [x] 5.4 Replace status badges with StatusBadge component
- [x] 5.5 Replace action buttons with ActionButtons component

## 6. Refactor Playlists Archive Page
- [x] 6.1 Replace archive-list-client.tsx with ArchiveList component
- [x] 6.2 Update page wrapper to use AdminPageLayout

## 7. Refactor Events List Page
- [x] 7.1 Replace events-list-client.tsx page wrapper with PageHeader (events use different layout)
- [x] 7.2 Replace filter section with InlineFilters, SearchInput, FilterSelect components
- [x] 7.3 Replace events list with DataCardList component (card-style rows)
- [x] 7.4 Replace visibility/current badges with StatusBadge component
- [x] 7.5 Replace action buttons with ActionButtons component

## 8. Refactor Events Archive Page
- [x] 8.1 Replace archive-list-client.tsx with ArchiveList component
- [x] 8.2 Update page wrapper to use PageHeader

## 9. Cleanup and Documentation
- [x] 9.1 Verify build passes with no TypeScript errors
- [x] 9.2 All refactored pages use shared components
- [x] 9.3 Mobile responsiveness maintained (same Tailwind patterns)
