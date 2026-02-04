## Context

### Current State
The public app currently relies on Next.js default error handling:
- 404 errors show generic Next.js 404 page
- Other errors may show technical stack traces
- No consistent error styling
- No helpful navigation options

### User Impact
- **Choir Members:** May be confused by technical error messages
- **Guests:** Don't know how to recover from errors
- **Both:** Lose trust in the application when errors occur

### Error Scenarios
1. **404 Not Found:** User clicks link to deleted event/playlist/song
2. **Event Not Visible:** Event exists but is marked as hidden
3. **Network Error:** Database connection issues
4. **Unexpected Error:** Runtime errors in components

## Goals / Non-Goals

### Goals
- Create friendly, non-technical error messages
- Provide clear recovery paths
- Maintain visual consistency
- Support all error scenarios

### Non-Goals
- Complex error logging (admin concern)
- Error reporting/analytics (future scope)
- Retry mechanisms for network errors (future scope)

## Technical Decisions

### Error Page Strategy
- Use Next.js App Router error conventions
- `not-found.tsx` for 404 errors
- `error.tsx` for other errors
- Error boundaries for component-level errors

### Design Approach
- Keep error pages simple and clear
- Use existing UI components where possible
- Maintain dark mode support
- Large, clear call-to-action buttons

### Content Strategy
- Friendly, apologetic tone
- No technical jargon
- Clear next steps
- Visual distinction from normal pages

## Risks / Trade-offs

### Risk: Error pages not catching all errors
- **Mitigation:** Test various error scenarios, use error boundaries

### Risk: Users stuck in error loops
- **Mitigation:** Provide multiple navigation options, clear CTAs

### Risk: Error pages breaking themselves
- **Mitigation:** Keep error pages simple, minimal dependencies
