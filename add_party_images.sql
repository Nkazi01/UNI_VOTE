-- Add image fields to support party logos and candidate photos
-- Run this in your Supabase SQL Editor

-- The parties column is JSONB, so we don't need to alter the table structure
-- Just update the TypeScript types and the data will automatically support the new fields

-- Example of how the updated parties JSONB will look:
/*
{
  "id": "uuid",
  "name": "Progressive Students Alliance",
  "logo": "https://example.com/logo.png",
  "president": {
    "id": "uuid",
    "name": "Alex Johnson",
    "photo": "https://example.com/alex.jpg"
  },
  "deputyPresident": {
    "id": "uuid", 
    "name": "Sarah Williams",
    "photo": "https://example.com/sarah.jpg"
  }
}
*/

-- No schema changes needed! JSONB is flexible.
-- Just update your application code to include the new image fields.

SELECT 'Schema is already compatible with image fields!' as status;

