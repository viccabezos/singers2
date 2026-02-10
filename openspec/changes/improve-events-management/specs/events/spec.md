## ADDED Requirements

### Requirement: Admin Event Display Order
The admin events list SHALL display events from today backwards by default, sorted with newest events first.

#### Scenario: Default admin view shows non-archived events
- **GIVEN** an admin navigates to the events page
- **WHEN** the page loads with no filters applied
- **THEN** all non-archived events are displayed
- **AND** events are sorted by date descending (newest first)
- **AND** both past and future non-archived events are shown

#### Scenario: Admin filters to see all events
- **GIVEN** an admin is viewing events
- **WHEN** they select "All Dates" filter
- **THEN** both past and future events are displayed
- **AND** sorting remains newest first

### Requirement: Event Auto-Archiving
The system SHALL automatically archive events that are more than 14 days past their event date.

#### Scenario: Event auto-archived after 14 days
- **GIVEN** an event with date 15 days ago
- **AND** the event is not exempt from auto-archive
- **WHEN** the daily auto-archive job runs
- **THEN** the event is archived (is_archived set to true)
- **AND** if featured, the event is unfeatured

#### Scenario: Event within grace period not archived
- **GIVEN** an event with date 13 days ago
- **WHEN** the daily auto-archive job runs
- **THEN** the event remains active (not archived)

#### Scenario: Exempt event not auto-archived
- **GIVEN** an event with date 20 days ago
- **AND** the event has auto_archive_exempt=true
- **WHEN** the daily auto-archive job runs
- **THEN** the event remains active (not archived)

#### Scenario: Admin views auto-archive status
- **GIVEN** events approaching auto-archive date
- **WHEN** an admin views the events list
- **THEN** a visual indicator shows days remaining before auto-archive
- **AND** events within 3 days of auto-archive are highlighted

#### Scenario: Dashboard shows auto-archive notification
- **GIVEN** events were auto-archived in the last 24 hours
- **WHEN** an admin views the dashboard
- **THEN** a banner notification appears showing how many events were archived
- **AND** the banner includes a link to view the archived events
- **AND** the banner can be dismissed

### Requirement: Featured Event Management
The system SHALL support a featured event that is prominently highlighted on the public site and in the admin interface.

#### Scenario: Set event as featured
- **GIVEN** an admin is viewing the events list
- **WHEN** they click "Set as Featured" on an event
- **THEN** the event becomes the featured event
- **AND** any previously featured event is unfeatured
- **AND** the featured event is visually highlighted in the admin list

#### Scenario: Unset featured event
- **GIVEN** a featured event exists
- **WHEN** an admin clicks "Unfeature" on the event
- **THEN** the event is no longer featured
- **AND** no event is featured until another is set

#### Scenario: Featured event archived
- **GIVEN** a featured event
- **WHEN** the event is auto-archived
- **THEN** the event is automatically unfeatured
- **AND** no event is featured until another is set

#### Scenario: Featured event badge displayed
- **GIVEN** a featured event in the admin list
- **WHEN** the admin views the events
- **THEN** a prominent "Featured" badge is displayed on the event
- **AND** the event card has distinct styling (border, background)

### Requirement: Bulk Event Actions
The admin interface SHALL support bulk actions on multiple events.

#### Scenario: Bulk archive events
- **GIVEN** an admin has selected multiple events via checkboxes
- **WHEN** they click "Archive Selected"
- **AND** they confirm the action
- **THEN** all selected events are archived

#### Scenario: Archive events before date
- **GIVEN** an admin wants to archive old events
- **WHEN** they select "Archive All Before" and choose a date
- **AND** they confirm the action
- **THEN** all events before that date are archived
- **AND** a summary shows how many events were archived

### Requirement: Event Status Badges
The admin interface SHALL display status badges on events to indicate their timing relative to today.

#### Scenario: Today badge displayed
- **GIVEN** an event scheduled for today
- **WHEN** an admin views the events list
- **THEN** a "Today" badge is displayed on the event

#### Scenario: Past event with days indicator
- **GIVEN** an event that occurred 5 days ago
- **WHEN** an admin views the events list
- **THEN** a "5 days ago" indicator is displayed
- **AND** a warning shows if near auto-archive (e.g., "Archives in 9 days")

#### Scenario: This week badge
- **GIVEN** an event scheduled within the next 7 days
- **WHEN** an admin views the events list
- **THEN** a "This Week" or "In X days" badge is displayed

## MODIFIED Requirements

### Requirement: Current and Featured Event Selection

The system SHALL support two distinct event highlighting mechanisms: "current" (today's or closest upcoming event) and "featured" (special highlighted event).

#### Scenario: Auto-select featured event from upcoming
- **GIVEN** no event is manually marked as featured
- **AND** there are visible upcoming events
- **WHEN** the system determines the featured event
- **THEN** the closest upcoming event is automatically featured
- **AND** this is displayed clearly in the admin interface

#### Scenario: Manual featured event override
- **GIVEN** an admin marks an event as featured
- **WHEN** the system determines the featured event
- **THEN** the manually selected event is featured
- **AND** auto-selection is bypassed

#### Scenario: Only one featured event allowed
- **GIVEN** event A is featured
- **WHEN** an admin features event B
- **THEN** event A is unfeatured
- **AND** event B becomes the featured event

#### Scenario: Current event is auto-detected
- **GIVEN** today's date is January 15
- **AND** there is an event scheduled for January 15
- **WHEN** the system determines the current event
- **THEN** the January 15 event is identified as current

#### Scenario: Current event falls back to closest upcoming
- **GIVEN** today's date is January 15
- **AND** there is no event on January 15
- **AND** the next event is on January 20
- **WHEN** the system determines the current event
- **THEN** the January 20 event is identified as current

#### Scenario: Current event cleared when past
- **GIVEN** an event was marked as current
- **AND** the event date has passed
- **AND** it's more than 1 day past the event
- **WHEN** the current event check runs
- **THEN** no event is marked as current
- **AND** the system looks for the next upcoming event

## REMOVED Requirements

*None - all existing requirements remain, just enhanced*

## Notes

- The "Current Event" terminology is being replaced with "Featured Event" for clarity
- Auto-archiving runs daily (implementation TBD: cron job, on-demand, or edge function)
- Events are sorted newest-first in admin by default
- Future events are hidden from default admin view to reduce clutter
