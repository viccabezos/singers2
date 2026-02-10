# Supabase RLS Debug Information - choir_photos Table

## Problem Summary
Receiving RLS policy violation error when attempting to INSERT into `choir_photos` table, despite having policies that should allow the operation.

## 1. Exact INSERT Statement

### Database Insert (from code)
```javascript
const { data: photo, error: dbError } = await supabase
  .from("choir_photos")
  .insert({
    image_url: publicUrl,        // string - public URL from Storage
    caption: caption || null,     // string | null
    display_order: nextOrder,     // number (integer)
  })
  .select()
  .single();
```

### Example JSON Payload
```json
{
  "image_url": "https://[project-id].supabase.co/storage/v1/object/public/choir-photos/1739203847-abc123.jpg",
  "caption": "Sample photo caption",
  "display_order": 1
}
```

Note: Fields `id`, `created_at`, and `updated_at` are NOT included in INSERT (they use database defaults).

## 2. Authentication Context

**Using: Anonymous (anon) API key** - NOT authenticated user session

### Client Configuration
```javascript
// File: shared/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Execution Context
- **Server-side**: Yes (Next.js Server Action with `"use server"` directive)
- **Auth state**: No user authentication - relies on application-level middleware for admin protection
- **API Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Role**: `anon` role

## 3. Complete Table Schema

```sql
CREATE TABLE IF NOT EXISTS choir_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## 4. RLS Policies (Current)

```sql
-- Enable RLS
ALTER TABLE choir_photos ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read photos
CREATE POLICY "Public can read photos"
ON choir_photos
FOR SELECT
USING (true);

-- Policy: Allow all operations for anon (admin protected by middleware)
CREATE POLICY "Allow all operations for anon"
ON choir_photos
FOR ALL
USING (true)
WITH CHECK (true);
```

## 5. Database Triggers

### BEFORE UPDATE Trigger
```sql
CREATE TRIGGER update_choir_photos_updated_at
  BEFORE UPDATE ON choir_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Note**: This trigger only fires on UPDATE, NOT on INSERT. The `update_updated_at_column()` function should be a standard function that sets `NEW.updated_at = NOW()`.

### No INSERT Triggers
There are NO `BEFORE INSERT` or `AFTER INSERT` triggers that modify `NEW` values.

## 6. Full Request Flow

1. **User uploads file** in admin UI (`/admin/photos`)
2. **File uploaded to Storage** bucket `choir-photos` (succeeds)
3. **Public URL generated** from Storage (succeeds)
4. **Query max display_order** (succeeds - SELECT allowed)
5. **INSERT new row** with computed values (FAILS with RLS error)

### Code Flow (from photos.ts)
```javascript
// Step 1: Upload file to Storage
const { data: uploadData, error: uploadError } = await supabase.storage
  .from("choir-photos")
  .upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

// Step 2: Get public URL
const { data: { publicUrl } } = supabase.storage
  .from("choir-photos")
  .getPublicUrl(fileName);

// Step 3: Get next display_order
const { data: photos } = await supabase
  .from("choir_photos")
  .select("display_order")
  .order("display_order", { ascending: false })
  .limit(1);

const nextOrder = photos && photos.length > 0 ? photos[0].display_order + 1 : 1;

// Step 4: INSERT (THIS FAILS)
const { data: photo, error: dbError } = await supabase
  .from("choir_photos")
  .insert({
    image_url: publicUrl,
    caption: caption || null,
    display_order: nextOrder,
  })
  .select()
  .single();
```

## 7. Error Message

```
[Exact error message from Supabase - please replace with actual error]
Error creating photo record: new row violates row-level security policy for table "choir_photos"
```

## 8. Expected Behavior

The policy "Allow all operations for anon" should allow INSERT operations when:
- Request is made with `anon` role (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Policy has `FOR ALL` (covers INSERT, UPDATE, DELETE, SELECT)
- `USING (true)` allows reading any row
- `WITH CHECK (true)` should allow inserting any row

## 9. Questions for Diagnosis

1. Does the `WITH CHECK (true)` policy apply to INSERT operations with `FOR ALL`?
2. Is there a conflict between multiple policies (e.g., the SELECT-only policy interfering)?
3. Could the policy be cached and not reflecting the latest changes?
4. Is there a way to verify which policy/role is being evaluated during INSERT?

## 10. Storage Bucket Configuration

- **Bucket name**: `choir-photos`
- **Public**: Yes
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
- **Max file size**: 5MB (5242880 bytes)

**Storage upload SUCCEEDS** - only the database INSERT fails.

## 11. Environment Details

- **Framework**: Next.js 16 (App Router)
- **Supabase Client**: `@supabase/supabase-js` (latest)
- **Execution**: Server Actions (server-side)
- **Auth**: No user authentication - using anon key directly

## 12. Attempted Solutions

[List any policy changes you've tried that didn't work]

## 13. What Works

- ✅ SELECT operations (reading photos)
- ✅ Storage uploads
- ✅ Getting public URLs
- ❌ INSERT operations (fails with RLS error)

---

## Request for Support

Please help identify why the INSERT operation fails despite having a `FOR ALL` policy with `USING (true)` and `WITH CHECK (true)` for the `anon` role.

Is there additional configuration needed for INSERT operations to work with anonymous access?
