# Admin Guide: Les Chanteurs Platform

## Table of Contents

1. [Getting Started](#getting-started)
2. [Choir Settings](#choir-settings)
3. [Photo Gallery Management](#photo-gallery-management)
4. [Featured Playlists](#featured-playlists)
5. [Best Practices](#best-practices)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin` on your website
2. Enter the admin password
3. You'll be taken to the dashboard

### Admin Dashboard Overview

The dashboard provides quick access to:
- **Events** - Manage choir events and performances
- **Playlists** - Create and manage song playlists
- **Songs** - Manage your song library and lyrics
- **Photos** - Upload and manage choir photos
- **Settings** - Configure site-wide content

---

## Choir Settings

### What are Choir Settings?

Choir Settings allow you to customize the public website content without needing to edit code. This includes:

- **Tagline** - The main message on the homepage hero section
- **About Text** - Description of your choir for the about section
- **Social Media Links** - Facebook, Instagram, YouTube URLs
- **Contact Email** - Email address for "Join the Choir" inquiries

### How to Update Settings

1. **Navigate to Settings**
   - Click "Settings" in the left sidebar navigation
   - Or go directly to `/admin/settings`

2. **Edit Fields**
   - **Tagline**: Enter a short, engaging message (e.g., "Singing together since 1995")
   - **About Text**: Write a description of your choir. You can use line breaks for paragraphs.
   - **Social URLs**: Enter full URLs including `https://` (e.g., `https://facebook.com/yourchoir`)
   - **Contact Email**: Enter a valid email address

3. **Save Changes**
   - Click the "Save Settings" button
   - You'll see a success message when saved
   - Changes appear immediately on the public website

### Tips for Settings

- **Tagline**: Keep it short and memorable (under 100 characters)
- **About Text**: 2-4 paragraphs work best. The text will preserve your line breaks.
- **Social Links**: Only add links to platforms you actively use. Empty fields won't show icons.
- **Email**: Use a choir-specific email address that multiple people can access

---

## Photo Gallery Management

### About the Photo Gallery

The photo gallery displays on your public homepage, showcasing your choir to visitors. You can upload, reorder, and manage photos from the admin panel.

### Uploading Photos

1. **Go to Photos Section**
   - Click "Photos" in the left sidebar
   - Or navigate to `/admin/photos`

2. **Select Photos**
   - Click the upload area or drag and drop files
   - You can select multiple photos at once
   - Supported formats: JPG, PNG, WebP
   - Maximum file size: 5MB per photo

3. **Add Captions (Optional)**
   - After selecting photos, you can add captions to each
   - Captions appear when visitors hover over photos on the homepage
   - Click "Upload All" when ready

4. **Supported File Types**
   - JPG/JPEG - Best for photos
   - PNG - Good for graphics with transparency
   - WebP - Modern format with better compression

### Managing Photos

**Reordering Photos:**
1. In the photo grid, click and drag a photo to a new position
2. Photos are displayed on the homepage in this order
3. The first 6 photos are shown on the homepage

**Editing Captions:**
1. Find the photo you want to edit
2. Click the pencil icon below the photo
3. Type the new caption
4. Click the checkmark to save

**Deleting Photos:**
- **Single Photo**: Click the trash icon on the photo card
- **Multiple Photos**: Check the checkbox on multiple photos, then click "Delete Selected"
- **Confirmation**: You'll be asked to confirm before deletion

### Photo Guidelines

- **Resolution**: Minimum 800x600 pixels for best quality
- **Aspect Ratio**: 4:3 works best for the gallery layout
- **Content**: Photos of choir performances, rehearsals, or group photos
- **Optimization**: Photos are automatically optimized for web display

---

## Featured Playlists

### What are Featured Playlists?

Featured playlists appear on your homepage, highlighting specific playlists you want to showcase. You can feature up to 3 playlists at a time.

### How to Feature a Playlist

1. **Navigate to Playlists**
   - Click "Playlists" in the left sidebar
   - Or go to `/admin/playlists`

2. **Edit a Playlist**
   - Find the playlist you want to feature
   - Click the "Edit" button (pencil icon)

3. **Mark as Featured**
   - Check the "Featured on Homepage" checkbox
   - Enter a "Featured Order" number (1, 2, or 3)
   - Order 1 appears first, Order 3 appears last

4. **Save Changes**
   - Click "Update Playlist"
   - The playlist will now appear on the homepage

### Managing Featured Playlists

**Viewing Featured Playlists:**
- In the playlists list, featured playlists show a badge (e.g., "#1", "#2", "#3")
- This helps you quickly see which playlists are featured

**Changing Order:**
1. Edit the playlist
2. Change the "Featured Order" number
3. Save to update the display order

**Removing from Featured:**
1. Edit the playlist
2. Uncheck "Featured on Homepage"
3. Save changes
4. The playlist will no longer appear on the homepage

### Featured Playlist Limit

- **Maximum**: 3 featured playlists
- **Validation**: The system prevents you from featuring more than 3
- **Error Message**: If you try to feature a 4th playlist, you'll see: "Maximum 3 playlists can be featured. Please unfeature another playlist first."

### Best Practices for Featured Playlists

- **Relevance**: Feature playlists for upcoming events or popular collections
- **Rotation**: Change featured playlists periodically to keep the homepage fresh
- **Visibility**: Only "Visible" playlists can be featured
- **Description**: Add descriptions to help visitors understand what each playlist contains

---

## Best Practices

### Content Management

1. **Regular Updates**
   - Update the about text seasonally or annually
   - Refresh photos after major events
   - Rotate featured playlists monthly

2. **Quality Over Quantity**
   - Choose your best 6 photos for the gallery
   - Feature only your best playlists
   - Keep the about text concise but informative

3. **Consistency**
   - Use the same email for all choir communications
   - Keep social media links updated
   - Maintain consistent messaging across the site

### Photo Management

1. **Upload Strategy**
   - Upload photos in batches after events
   - Delete duplicate or low-quality photos
   - Reorder to tell a visual story

2. **File Naming**
   - Use descriptive names when uploading (e.g., "christmas-concert-2024.jpg")
   - This helps with organization and SEO

### Playlist Management

1. **Featured Strategy**
   - Feature upcoming event playlists
   - Highlight seasonal collections
   - Showcase your most popular playlists

2. **Organization**
   - Use clear, descriptive playlist names
   - Add descriptions to help visitors
   - Keep playlists up to date

### Troubleshooting

**Settings not appearing on website?**
- Make sure you clicked "Save Settings"
- Clear your browser cache
- Check that the fields aren't empty

**Photos not uploading?**
- Check file size (must be under 5MB)
- Verify file format (JPG, PNG, or WebP)
- Try uploading one photo at a time

**Can't feature a playlist?**
- Verify the playlist status is "Visible"
- Check if you already have 3 featured playlists
- Ensure you're saving after making changes

### Need Help?

If you encounter issues:
1. Check this documentation first
2. Verify you're following the steps correctly
3. Try refreshing the page
4. Contact your technical support if problems persist

---

## Quick Reference

| Feature | URL | Key Points |
|---------|-----|------------|
| Settings | `/admin/settings` | Site-wide content configuration |
| Photos | `/admin/photos` | Upload, reorder, delete photos |
| Playlists | `/admin/playlists` | Manage playlists and featured status |
| Dashboard | `/admin/dashboard` | Overview and quick access |

---

*Last updated: February 2026*
