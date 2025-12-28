# Design: Unify Content List Component

## Technical Decisions

### 1. Library Choice: dnd-kit

**Decision**: Use `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop.

**Rationale**:
- Recommended by shadcn community for sortable components
- Built for React with hooks-based API
- Excellent accessibility (keyboard navigation, screen reader support)
- Touch support for mobile devices
- Lightweight and performant
- Active maintenance

**Alternatives Considered**:
- `react-beautiful-dnd` - Deprecated by Atlassian
- `framer-motion` Reorder - Less flexible for table layouts
- Native HTML5 drag-and-drop - Poor accessibility and mobile support

### 2. Component Architecture

```
shared/ui/
├── sortable-content-table/
│   ├── index.ts                 # Barrel export
│   ├── sortable-content-table.tsx  # Main component
│   ├── sortable-row.tsx         # Draggable row wrapper
│   └── content-picker.tsx       # Search and add UI
```

### 3. Component API Design

```tsx
interface SortableContentTableProps<T> {
  // Data
  items: T[];
  onReorder: (items: T[]) => void;
  onRemove: (id: string) => void;
  
  // Item identification
  getItemId: (item: T) => string;
  
  // Display configuration
  columns: ContentColumn<T>[];
  emptyState?: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
  };
  
  // Picker configuration (optional)
  picker?: {
    searchPlaceholder: string;
    onSearch: (query: string) => Promise<T[]>;
    onAdd: (item: T) => void;
    isSearching?: boolean;
    renderResult: (item: T) => React.ReactNode;
  };
  
  // State
  disabled?: boolean;
}

interface ContentColumn<T> {
  key: string;
  header?: string;
  width?: string;
  render: (item: T, index: number) => React.ReactNode;
}
```

### 4. dnd-kit Integration Pattern

```tsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// Use vertical axis restriction for table rows
// Use closestCenter collision detection for predictable behavior
// Support both pointer and keyboard sensors for accessibility
```

### 5. Table Structure

```
┌─────────┬───────┬────────────────────────┬─────────┐
│ Grip    │ #     │ Content (configurable) │ Actions │
├─────────┼───────┼────────────────────────┼─────────┤
│ ⠿       │ 1     │ Song Title / Artist    │ Remove  │
│ ⠿       │ 2     │ Song Title / Artist    │ Remove  │
│ ⠿       │ 3     │ Song Title / Artist    │ Remove  │
└─────────┴───────┴────────────────────────┴─────────┘
```

### 6. Mobile Considerations

- **Touch drag**: dnd-kit supports touch events natively
- **Drag handle size**: Minimum 44x44px touch target
- **Visual feedback**: Clear drag preview and drop indicators
- **Fallback**: Up/down buttons could be added as fallback (not in MVP)

### 7. Accessibility

dnd-kit provides built-in accessibility:
- Keyboard navigation with arrow keys
- Screen reader announcements
- Focus management during drag operations

### 8. State Management

The component will be **controlled** - parent forms manage state:
- `items`: Current ordered list
- `onReorder`: Called after drag ends with new order
- `onRemove`: Called when remove button clicked

This matches the existing pattern in both forms where state is managed locally.

## Migration Strategy

### Phase 1: Install Dependencies
- Add dnd-kit packages
- No breaking changes

### Phase 2: Create Component
- Build `SortableContentTable` in `shared/ui/`
- Add to exports in `shared/ui/index.ts`
- No changes to existing forms yet

### Phase 3: Migrate Playlist Form
- Replace songs list section with new component
- Keep existing server actions unchanged
- Test thoroughly

### Phase 4: Migrate Event Form
- Replace playlists list section with new component
- Keep existing server actions unchanged
- Test thoroughly

### Phase 5: Cleanup
- Remove unused code from forms
- Update any tests if needed

## File Changes Summary

### New Files
- `shared/ui/sortable-content-table/index.ts`
- `shared/ui/sortable-content-table/sortable-content-table.tsx`
- `shared/ui/sortable-content-table/sortable-row.tsx`
- `shared/ui/sortable-content-table/content-picker.tsx`

### Modified Files
- `package.json` - Add dnd-kit dependencies
- `shared/ui/index.ts` - Export new component
- `app/(admin)/admin/playlists/playlist-form.tsx` - Use new component
- `app/(admin)/admin/events/event-form.tsx` - Use new component

