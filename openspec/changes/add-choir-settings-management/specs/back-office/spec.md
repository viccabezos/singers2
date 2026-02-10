## ADDED Requirements

### Requirement: Choir Settings Table
The system SHALL provide a database table for storing choir settings.

#### Scenario: Settings table exists
- **WHEN** the database is migrated
- **THEN** a `choir_settings` table is created
- **AND** the table has columns for tagline, about_text, social URLs, and contact email
- **AND** a single row with id=1 is seeded

#### Scenario: Singleton pattern enforced
- **GIVEN** the choir_settings table exists
- **WHEN** attempting to insert a row with id != 1
- **THEN** the database rejects the insert
- **AND** only one settings row can exist

### Requirement: Settings Management Page
The admin SHALL provide a page to manage choir settings.

#### Scenario: Admin navigates to settings
- **GIVEN** an admin is logged in
- **WHEN** they navigate to /admin/settings
- **THEN** a settings form is displayed
- **AND** current settings are pre-populated in the form

#### Scenario: Admin updates settings
- **GIVEN** an admin is on the settings page
- **WHEN** they update fields and click save
- **THEN** settings are saved to database
- **AND** a success message is displayed
- **AND** the form shows updated values

#### Scenario: Validation errors
- **GIVEN** an admin enters invalid data
- **WHEN** they submit the form
- **THEN** validation errors are displayed
- **AND** settings are not saved
- **AND** the form retains entered values

### Requirement: Settings in Admin Navigation
The admin navigation SHALL include a link to settings.

#### Scenario: Settings link in nav
- **WHEN** an admin views the admin navigation
- **THEN** a "Settings" link is visible
- **AND** clicking it navigates to /admin/settings

### Requirement: Dynamic Hero Section
The hero section SHALL display choir-configured tagline.

#### Scenario: Tagline configured
- **GIVEN** a tagline is set in choir settings
- **WHEN** the hero section renders
- **THEN** the configured tagline is displayed

#### Scenario: No tagline configured
- **GIVEN** no tagline is set in choir settings
- **WHEN** the hero section renders
- **THEN** a default tagline is displayed

### Requirement: Dynamic About Section
The about section SHALL display choir-configured about text.

#### Scenario: About text configured
- **GIVEN** about text is set in choir settings
- **WHEN** the about section renders
- **THEN** the configured text is displayed
- **AND** line breaks are preserved

#### Scenario: No about text configured
- **GIVEN** no about text is set in choir settings
- **WHEN** the about section renders
- **THEN** placeholder text is displayed

### Requirement: Dynamic Social Links
The footer SHALL display configured social media links.

#### Scenario: Social URLs configured
- **GIVEN** social media URLs are set in choir settings
- **WHEN** the footer renders
- **THEN** social media icons are displayed
- **AND** clicking an icon navigates to the configured URL

#### Scenario: Social URL not configured
- **GIVEN** a social media URL is not set
- **WHEN** the footer renders
- **THEN** the corresponding icon is hidden

#### Scenario: All social URLs empty
- **GIVEN** no social media URLs are set
- **WHEN** the footer renders
- **THEN** the social media section is hidden

### Requirement: Dynamic Contact Email
The CTA section SHALL use configured contact email.

#### Scenario: Contact email configured
- **GIVEN** contact email is set in choir settings
- **WHEN** the CTA section renders
- **THEN** the "Join the Choir" button uses the configured email
- **AND** clicking opens email client with configured address

#### Scenario: No contact email configured
- **GIVEN** contact email is not set
- **WHEN** the CTA section renders
- **THEN** a placeholder email is used

### Requirement: Settings Form Validation
The settings form SHALL validate user input.

#### Scenario: URL validation
- **GIVEN** an admin enters a social media URL
- **WHEN** the URL is not valid format
- **THEN** a validation error is shown
- **AND** the form cannot be submitted

#### Scenario: Email validation
- **GIVEN** an admin enters a contact email
- **WHEN** the email is not valid format
- **THEN** a validation error is shown
- **AND** the form cannot be submitted

#### Scenario: Optional fields
- **GIVEN** an admin leaves optional fields empty
- **WHEN** they submit the form
- **THEN** the form is accepted
- **AND** empty values are saved

### Requirement: Graceful Degradation
Widgets SHALL gracefully handle missing settings data.

#### Scenario: Settings not loaded
- **GIVEN** settings cannot be fetched from database
- **WHEN** a widget renders
- **THEN** placeholder/default content is shown
- **AND** no errors are displayed to the user

#### Scenario: Empty settings
- **GIVEN** all settings fields are empty
- **WHEN** widgets render
- **THEN** default/placeholder content is shown
- **AND** the site remains functional
