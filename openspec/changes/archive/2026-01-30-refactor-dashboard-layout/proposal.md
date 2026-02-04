# Change: Refactor Dashboard Layout

## Why

The current dashboard layout places the "Unpublished Items" alert between the navigation cards and the main content widgets (Recent Activity, Event Calendar). This creates visual interruption and the alert can feel intrusive when there are no drafts. The layout could be improved to provide better visual hierarchy and information flow.

## Current Layout Analysis

```
┌─────────────────────────────────────────────────┐
│ Dashboard                                        │
│ Welcome to the back office                       │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ │ Songs   │ │Playlists│ │ Events  │  ← Nav Cards│
│ │   42    │ │   12    │ │    5    │             │
│ └─────────┘ └─────────┘ └─────────┘             │
├─────────────────────────────────────────────────┤
│ ⚠️ Unpublished Items: 3 hidden songs...         │  ← Alert (interrupts flow)
├─────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ Recent Activity  │ │ Event Calendar   │       │
│ │                  │ │                  │       │
│ └──────────────────┘ └──────────────────┘       │
└─────────────────────────────────────────────────┘
```

## Proposed Layout

```
┌─────────────────────────────────────────────────┐
│ Dashboard                                        │
│ Welcome to the back office                       │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ │ Songs   │ │Playlists│ │ Events  │  ← Nav Cards│
│ │   42    │ │   12    │ │    5    │             │
│ └─────────┘ └─────────┘ └─────────┘             │
├─────────────────────────────────────────────────┤
│ ┌─────────┐ ┌────────────────---------──┐       │
│ │ Recent  │ │ Event Calendar            │       │
│ │ Activit │ │                           │       │ ← Main content first
│ │         │ │                           │       │
│ └─────────┘ └──────────────────---------┘       │
├─────────────────────────────────────────────────┤
│ ⚠️ Unpublished Items: 3 hidden songs...         │  ← Footer notice (less intrusive)
└─────────────────────────────────────────────────┘
```

## What Changes

### 1. Move Draft Alert to Bottom
- Move the "Unpublished Items" alert below the main content widgets
- This treats it as a secondary notification rather than a primary action blocker
- When empty, the space is not wasted in the middle of the page

### 2. Improve Visual Flow
- Navigation cards remain at top for quick access
- Main operational widgets (Recent Activity, Calendar) come next, recent activity tkaes 1/3 of space on desktop, the calendar 2/3
- Informational notices at the bottom

## Impact

- Affected specs: back-office
- Affected code:
  - `app/(admin)/admin/dashboard/page.tsx` - Reorder widget placement

## Out of Scope

- Widget content changes (already implemented)
- Adding new widgets
- Mobile-specific layout changes (current responsive design is adequate)
