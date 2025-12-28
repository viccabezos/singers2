# project-architecture Specification

## Purpose
TBD - created by archiving change define-project-structure. Update Purpose after archive.
## Requirements
### Requirement: Feature-Sliced Design Structure
The project SHALL organize code following Feature-Sliced Design methodology with layers: app, pages, widgets, features, entities, and shared.

#### Scenario: Code organization
- **WHEN** a developer adds a new feature
- **THEN** the code is placed in the appropriate FSD layer according to its scope and purpose

#### Scenario: Shared utilities
- **WHEN** code is needed by multiple features
- **THEN** it is placed in the `shared/` layer

### Requirement: Application Separation
The project SHALL maintain clear separation between public website and back office applications using Next.js route groups.

#### Scenario: Route organization
- **WHEN** accessing public website routes
- **THEN** routes are organized under `(public)` route group
- **WHEN** accessing back office routes  
- **THEN** routes are organized under `(admin)` route group with `/admin/*` URL prefix

#### Scenario: Shared components
- **WHEN** components are used by both applications
- **THEN** they are placed in the shared layer and imported by both route groups

### Requirement: Mobile-First Design
The project SHALL follow a mobile-first design and development approach for both public website and back office applications.

#### Scenario: Mobile-first development
- **WHEN** a developer creates a new component or page
- **THEN** it is designed and implemented for mobile devices first
- **AND** then enhanced for tablet and desktop breakpoints

#### Scenario: Responsive breakpoints
- **WHEN** using Tailwind CSS responsive utilities
- **THEN** base styles target mobile devices
- **AND** tablet and desktop styles are added using `sm:`, `md:`, `lg:` breakpoints

