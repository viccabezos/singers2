# Design: Improve Public Website UX

## Context

The public website is the primary interface for choir members to access lyrics during live performances. Users are often retired people who are not comfortable with technology. The interface must be extremely simple, with clear navigation and high contrast.

## Goals

- Create a fully functional public homepage
- Establish consistent navigation patterns across all public pages
- Enable dark mode switching for stage use
- Ensure all navigation is touch-friendly for mobile use

## Non-Goals

- Admin panel improvements (separate proposal)
- Adding new features beyond navigation/UX
- Changing the visual design language

## Decisions

### Decision 1: Public Header Component
**What**: Create a reusable `PublicHeader` component used on all public pages.

**Rationale**: Currently, each page has ad-hoc header implementations. A shared component ensures consistency and reduces code duplication.

**Structure**:
```
<PublicHeader>
  - Home link (choir name/logo)
  - Dark mode toggle
  - Optional: contextual breadcrumbs
</PublicHeader>
```

### Decision 2: Homepage Shows Current Event
**What**: The public homepage automatically displays the current or next upcoming event with its playlists.

**Rationale**: 
- Matches the user flow described in project.md
- Eliminates need for users to search/browse
- Critical for live event scenarios

**Behavior**:
- If a manual `is_current` event exists → show it
- Else if upcoming events exist → show closest one
- Else → show "No upcoming events" message

### Decision 3: Theme Toggle Implementation
**What**: Use `next-themes` (already installed) with a simple toggle button.

**Rationale**: Package is already in dependencies. Simple toggle fits the "simplicity first" constraint for elderly users.

**Location**: In the public header, always visible.

### Decision 4: Contextual Back Navigation
**What**: Each public page shows breadcrumb-style navigation back to its parent.

**Rationale**: Users need to understand where they are and how to go back without using browser controls.

**Implementation**:
- Song page → shows "← Back to playlist" (if referrer available) or "← Back to home"
- Playlist page → shows "← Back to event" (if referrer available) or "← Back to home"
- Event page → shows "← Back to home"

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Homepage may load slowly if current event has many playlists | Use static generation where possible; limit displayed items |
| Referrer-based back navigation may fail | Always provide fallback to home |
| Dark mode toggle may confuse some users | Use clear sun/moon icons; persist preference |

## Migration Plan

1. Create shared `PublicHeader` and `ThemeToggle` components
2. Update public layout to include header and theme provider
3. Rebuild homepage with current event logic
4. Update playlist and song pages with consistent navigation
5. Add loading states to public pages

No database migration required. All changes are frontend-only.

## Open Questions

1. **Branding**: Should the public header show "Les Chanteurs" or a generic title? (Defaulting to choir name based on project context)
2. **Event fallback**: If no events exist at all, what should homepage show? (Proposing a friendly "Coming soon" message)
