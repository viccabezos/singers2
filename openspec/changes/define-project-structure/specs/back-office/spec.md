## ADDED Requirements

### Requirement: Back Office Application
The system SHALL provide a private back office application for content management, built with Next.js, Tailwind CSS, and shadcn components.

#### Scenario: Admin access
- **WHEN** an admin accesses back office routes
- **THEN** they must authenticate with the single password

#### Scenario: Content management
- **WHEN** an authenticated admin accesses the back office
- **THEN** they can manage website content

### Requirement: Back Office Routing
The back office SHALL use Next.js App Router with routes organized under the `(admin)` route group with `/admin/*` URL prefix.

#### Scenario: Admin route access
- **WHEN** an admin navigates to `/admin` or admin routes
- **THEN** authentication is required before access is granted

#### Scenario: Protected routes
- **WHEN** an unauthenticated user attempts to access admin routes
- **THEN** they are redirected to the login page

### Requirement: Mobile-First Back Office
The back office application SHALL be designed and developed using a mobile-first approach.

#### Scenario: Mobile-first admin interface
- **WHEN** an admin accesses the back office on a mobile device
- **THEN** the interface is optimized for mobile viewing and interaction
- **WHEN** an admin accesses the back office on a tablet or desktop
- **THEN** the interface progressively enhances with additional features and layout improvements
- **AND** all responsive adaptations use Tailwind CSS mobile-first breakpoints

