---
trigger: always_on
---

# Project Context

## Overview

Les Chanteurs is a platform for managing a choir's events and playlists in real time.

The project focuses on a simple back-office (admin) interface plus a public web interface:

- Admin: manage events, playlists, and songs.
- Web: allow singers and guests to easily access lyrics for the current event's playlist.

## Goals

### Primary Goals (Phase 1 – MVP)

- Launch a Minimum Viable Product (MVP) that includes:
  - A public web site for the audience and choir members.
  - A back-office to manage the site's data.
- Provide a very simple authentication for the back-office:
  - Single password-based access (no need for email, multi-user accounts, etc.).
- Allow admins to create and manage:
  - Events.
  - Playlists.
  - Songs.
- Control visibility:
  - Decide which items are visible or hidden.
  - Define how events, playlists, and songs are linked together.

### Long-Term Vision (Roadmap)

- Become the preferred interface for the city's choir to:
  - Discover upcoming events.
  - Browse playlists and lyrics for each event.
  - Access additional content in the future.

- Possible future extensions:
    - Add an AI assistant to help admins find the correct song lyrics.
    - Add QR codes for songs so new participants can quickly find lyrics from their phones.
    - Add ways to monetize (e.g. ads or other revenue) to cover database and hosting costs.
    - Other features to be defined.

## Stakeholders

### Primary Stakeholders

- **Choir members** (often retired people, not very comfortable with technology) who need easy access to lyrics during events.
- **Guests/audience** who may want to follow along with the lyrics during performances.
- **Choir organizers/admins** who manage events, playlists, and song content.

### Design Considerations

- Interfaces must be:
  - Clear and simple.
  - High contrast and easy to read.
 - Mobile-first always, no exceptions.
- The web app should support dark mode.
- Lyrics should support multiple font-size options to make reading while singing easier.
- The chosen font size should be stored for the current browsing session, so when changing songs the font size remains the same.