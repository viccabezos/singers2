# Design: Simplify Status Badge to Icon-Only

## Context

The StatusBadge component has grown complex with multiple display modes:
- `iconOnly` - Shows only icon in circular container
- `compactOnMobile` - Different display for mobile vs desktop
- `showIcon` - Controls whether to show icon with text
- Text labels with/without icons

This creates inconsistency where some screens show text + icon, others show icon-only.

## Goals

1. **Simplify the component** to a single display mode
2. **Achieve visual consistency** across all screens
3. **Save space** in data tables and lists
4. **Maintain accessibility** via tooltips

## Non-Goals

- Changing status colors or meanings
- Adding new statuses
- Changing the DashboardStatus type

## Decisions

### Decision 1: Icon-Only by Default

**What**: All StatusBadge instances show icon-only in a circular container.

**Rationale**:
- Matches the successful pattern used in the events page
- Saves horizontal space in data tables
- Cleaner, more modern appearance
- Status is still accessible via tooltip

**Implementation**:
```tsx
<span
  className="inline-flex items-center justify-center h-6 w-6 rounded-full"
  title={config.label}
>
  <Icon className="h-3.5 w-3.5" />
</span>
```

### Decision 2: Native Browser Tooltips

**What**: Use the `title` HTML attribute for tooltips.

**Rationale**:
- No additional dependencies needed
- Works on all devices
- Accessible to screen readers
- Simple and reliable

### Decision 3: Remove VisibilityBadge

**What**: Remove the VisibilityBadge convenience component.

**Rationale**:
- StatusBadge now handles all cases consistently
- Reduces API surface area
- Single component to maintain

### Decision 4: Consistent Sizing

**What**: All status badges use 24px (h-6 w-6) circular container with 14px icons.

**Rationale**:
- Visual consistency
- Touch-friendly size (24px minimum)
- Matches existing icon-only pattern

## Migration Plan

1. Simplify StatusBadge component
2. Remove VisibilityBadge
3. Update all consumers to remove props
4. Test all screens
5. Build and validate

## Visual Changes

**Before** (varies by screen):
- Songs list: Icon-only
- Playlists list: Icon for visible/hidden, text for others
- Events list: Mixed

**After** (consistent everywhere):
- All screens: Icon-only with tooltip
- 24px circular container
- 14px icon
- Color-coded backgrounds
