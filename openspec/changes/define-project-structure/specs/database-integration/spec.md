## ADDED Requirements

### Requirement: Supabase Integration
The system SHALL integrate with Supabase for database operations.

#### Scenario: Database connection
- **WHEN** the application needs to access data
- **THEN** it connects to Supabase using configured credentials

#### Scenario: Environment configuration
- **WHEN** the application initializes
- **THEN** it reads Supabase connection details from environment variables
- **AND** connection details are not exposed in client-side code

### Requirement: Database Client Setup
The system SHALL provide a database client configured for Supabase that can be used by both public website and back office applications.

#### Scenario: Client usage
- **WHEN** either application needs to query the database
- **THEN** it uses the shared Supabase client instance

