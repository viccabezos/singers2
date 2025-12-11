# Change: Define Songs Scope and Data Model

## Why
Before implementing the Songs feature, we need to clearly define the data model, fields, relationships, and behavior. This proposal captures all questions and decisions about Songs to ensure we build the right solution.

## What Changes
- Define Songs data model (fields, types, required vs optional)
- Define lyrics format and storage approach
- Define song management capabilities (CRUD operations)
- Define visibility and deletion behavior
- Define font size options for lyrics display
- Establish relationships between Songs and other entities (Playlists)

## Impact
- Affected specs: `songs` (new capability)
- Affected code: Database schema, admin interface for songs, public website lyrics display
- Dependencies: Will inform Playlists and Events definitions

