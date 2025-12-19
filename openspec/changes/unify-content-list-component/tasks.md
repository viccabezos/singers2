# Tasks: Unify Content List Component

## Phase 1: Setup

- [x] **1.1** Install dnd-kit packages (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`)
- [x] **1.2** Create `shared/ui/sortable-content-table/` directory structure

## Phase 2: Build Core Component

- [x] **2.1** Create `sortable-row.tsx` - Draggable table row wrapper using `useSortable` hook
- [x] **2.2** Create `sortable-content-table.tsx` - Main table component with DndContext and SortableContext
- [x] **2.3** Implement drag handle column with GripVertical icon
- [x] **2.4** Implement position number column (auto-calculated from index)
- [x] **2.5** Implement configurable content columns via `columns` prop
- [x] **2.6** Implement remove action column with delete button
- [x] **2.7** Implement empty state display

## Phase 3: Build Content Picker

- [x] **3.1** Create `content-picker.tsx` - Search and add UI component
- [x] **3.2** Implement search input with debounced query
- [x] **3.3** Implement results list with loading state
- [x] **3.4** Implement add button toggle behavior
- [x] **3.5** Integrate picker into main table component (optional feature)

## Phase 4: Export and Document

- [x] **4.1** Create `shared/ui/sortable-content-table/index.ts` barrel export
- [x] **4.2** Add exports to `shared/ui/index.ts`

## Phase 5: Migrate Playlist Form

- [x] **5.1** Import `SortableContentTable` in `playlist-form.tsx`
- [x] **5.2** Configure columns for song display (title, artist)
- [x] **5.3** Configure picker for song search
- [x] **5.4** Wire up `onReorder` to existing `reorderSongsAction`
- [x] **5.5** Wire up `onRemove` to existing `removeSongFromPlaylistAction`
- [x] **5.6** Wire up `onAdd` to existing `addSongToPlaylistAction`
- [x] **5.7** Remove old songs list code
- [x] **5.8** Test drag-and-drop reordering
- [x] **5.9** Test add/remove functionality

## Phase 6: Migrate Event Form

- [x] **6.1** Import `SortableContentTable` in `event-form.tsx`
- [x] **6.2** Configure columns for playlist display (name, status badge)
- [x] **6.3** Configure picker for playlist search
- [x] **6.4** Wire up `onReorder` to existing `reorderEventPlaylistsAction`
- [x] **6.5** Wire up `onRemove` to existing `removePlaylistFromEventAction`
- [x] **6.6** Wire up `onAdd` to existing `addPlaylistToEventAction`
- [x] **6.7** Remove old playlists list code
- [x] **6.8** Test drag-and-drop reordering
- [x] **6.9** Test add/remove functionality

## Phase 7: Polish and Verify

- [ ] **7.1** Test on mobile (touch drag-and-drop)
- [ ] **7.2** Test keyboard navigation
- [x] **7.3** Verify dark mode styling
- [x] **7.4** Run build to check for TypeScript errors

## Dependencies

- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 1
- Phase 4 depends on Phase 2, 3
- Phase 5 depends on Phase 4
- Phase 6 depends on Phase 4
- Phase 7 depends on Phase 5, 6

## Estimated Effort

- Phase 1: 10 min
- Phase 2: 45 min
- Phase 3: 30 min
- Phase 4: 5 min
- Phase 5: 30 min
- Phase 6: 30 min
- Phase 7: 20 min

**Total: ~2.5 hours**

