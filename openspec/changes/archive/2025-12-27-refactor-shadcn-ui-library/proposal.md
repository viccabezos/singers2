# Change: Refactor to shadcn UI Components with Reusable Library

## Why
The codebase has significant code repetition across Songs, Playlists, and Events management pages. Each entity has nearly identical list pages, archive pages, forms, and filter components with duplicated inline Tailwind styling. This violates DRY principles and makes maintenance difficult—any UI change must be replicated across 9+ files.

## What Changes
- Install and configure shadcn/ui base components (Button, Input, Select, Card, Badge, Table, Dialog, Checkbox, Textarea)
- Create prop-driven reusable components in `shared/ui/` following FSD architecture
- Refactor the 3 entity management pages (Songs, Playlists, Events) to use shared components
- Consolidate common patterns: page layouts, filter panels, data tables, archive lists, status badges
- Reduce ~2,500 lines of repetitive UI code to ~800 lines through composition

## Impact
- Affected specs: None (visual behavior unchanged)
- Affected code:
  - `shared/ui/` - New reusable components
  - `components/ui/` - shadcn base components (via CLI)
  - `app/(admin)/admin/songs/` - All list/form components
  - `app/(admin)/admin/playlists/` - All list/form components  
  - `app/(admin)/admin/events/` - All list/form components
- **BREAKING**: None (internal refactor only)

