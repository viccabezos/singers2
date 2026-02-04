## Context

Les Chanteurs is a choir management platform with two distinct applications:
1. **Admin Back-Office** (mostly complete) - Full CRUD for events, playlists, songs
2. **Public Website** (minimal implementation) - Currently only has basic song lyrics display

### Current Public App State
- **Home page**: Default Next.js template (not implemented)
- **Song page**: Lyrics display with font size control (implemented)
- **Event page**: Event details with playlists (implemented)
- **Playlist page**: Song list with navigation (implemented)
- **Navigation**: No consistent navigation or home page experience

### Admin Features (Complete)
- Events: Create, edit, delete, archive, visibility control, location with maps
- Playlists: Create, edit, delete, archive, visibility control, song ordering
- Songs: Create, edit, delete, archive, visibility control, lyrics management
- Dashboard: Activity tracking, calendar view, draft alerts

### Target Users
- **Choir members**: Often retired, not tech-savvy, need simple interface
- **Audience/Guests**: May want to follow along during performances
- **Both**: Use mobile devices on stage, need high contrast, large text options

### Key Constraints
- Mobile-first design (critical for on-stage use)
- High contrast for various lighting conditions
- Session-based preferences (font size, dark mode)
- Must work reliably during live events
- Simple, clear navigation

## Goals / Non-Goals

### Goals
- Define complete public app user experience
- Document all features needed for MVP launch
- Align public features with existing admin capabilities
- Create clear development roadmap
- Address accessibility and usability requirements

### Non-Goals
- No implementation code (this is planning phase)
- No changes to admin functionality
- No database schema changes
- No breaking changes to existing public routes

## Technical Decisions

### Architecture
- Continue using Next.js App Router with `(public)` route group
- Server components for data fetching, client components for interactivity
- Feature-Sliced Design for code organization
- Shared UI components between admin and public where appropriate

### Data Flow
- Public app reads from same Supabase database
- Only visible (non-archived) content shown to public
- Real-time updates not required for MVP

### Styling
- Tailwind CSS with mobile-first approach
- Dark mode support via CSS variables
- Consistent with admin design system

## Risks / Trade-offs

### Risk: Complex navigation for non-tech-savvy users
- **Mitigation**: Simple, flat navigation structure; clear labels; minimal depth

### Risk: Font size preferences lost between sessions
- **Mitigation**: SessionStorage is acceptable for MVP; localStorage could be future enhancement

### Risk: Performance on mobile devices during events
- **Mitigation**: Static generation where possible; minimal JavaScript; optimized images

### Risk: Accessibility compliance
- **Mitigation**: WCAG 2.1 AA compliance target; high contrast mode; screen reader support

## Open Questions

1. Should the public app have a "current event" concept that auto-displays the active event? it should be featured on the home page as a banner, it goes to the current song on click
2. How should users navigate between events? Chronological list? Calendar view? maybe both options, we will see
3. Should playlists be directly accessible, or only through events? they can be accessible if visible
4. What happens when a user visits the home page? Show current event, or event list? we can have multple things displayed that's what gotta get planned too
5. Should we implement QR code generation for quick access to songs/events? later, yes in another scope
6. How should we handle offline mode for lyrics during performances? haven't thought about this, this can be another scope too, you can add it for future 
