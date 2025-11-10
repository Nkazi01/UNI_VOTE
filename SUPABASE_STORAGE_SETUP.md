# Supabase Storage Setup for UniVote

This guide will help you set up Supabase Storage for image uploads in your UniVote app.

## 📋 Overview

You'll create a public storage bucket called `poll-images` to store:
- Party logos
- Candidate photos
- Poll-related images

## 🚀 Quick Setup (5 minutes)

### Option 1: Using Supabase Dashboard (Easiest)

#### Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your `univote` project

2. **Navigate to Storage**
   - Click **"Storage"** in the left sidebar
   - You'll see the Storage dashboard

3. **Create New Bucket**
   - Click **"New Bucket"** button
   - Enter these settings:
     - **Name**: `poll-images`
     - **Public bucket**: ✅ **Enable** (check this box)
     - **File size limit**: `5242880` (5MB in bytes) - optional
     - **Allowed MIME types**: `image/*` - optional
   - Click **"Create Bucket"**

4. **Verify Creation**
   - You should see `poll-images` in your buckets list
   - The bucket icon should show it's **public** (🌐)

#### Step 2: Set Bucket Policies (Security)

The bucket policies should be automatically created, but verify:

1. Click on your `poll-images` bucket
2. Go to **"Policies"** tab
3. You should see policies for:
   - ✅ **SELECT** (read): Anyone can view images
   - ✅ **INSERT** (upload): Authenticated users can upload
   - ✅ **UPDATE** (update): Authenticated users can update
   - ✅ **DELETE** (delete): Authenticated users can delete

If policies are missing, add them:

**Policy 1: Allow Public Read Access**
```sql
-- Policy name: "Public Access"
-- Allowed operation: SELECT
-- Target roles: public

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'poll-images');
```

**Policy 2: Allow Authenticated Upload**
```sql
-- Policy name: "Authenticated Upload"
-- Allowed operation: INSERT
-- Target roles: authenticated

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'poll-images');
```

**Policy 3: Allow Authenticated Update**
```sql
-- Policy name: "Authenticated Update"
-- Allowed operation: UPDATE
-- Target roles: authenticated

CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'poll-images');
```

**Policy 4: Allow Authenticated Delete**
```sql
-- Policy name: "Authenticated Delete"
-- Allowed operation: DELETE
-- Target roles: authenticated

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'poll-images');
```

#### Step 3: Test Upload

1. In your bucket, click **"Upload File"**
2. Select a test image from your computer
3. Click **"Upload"**
4. Click on the uploaded file
5. You should see a **"Copy URL"** button
6. Copy the URL - it should look like:
   ```
   https://jkxnrbjasajvphewvamq.supabase.co/storage/v1/object/public/poll-images/test.png
   ```
7. Open the URL in a new browser tab - the image should display ✅

---

### Option 2: Using SQL Editor (Advanced)

If you prefer SQL, run these commands in the **SQL Editor**:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('poll-images', 'poll-images', true);

-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'poll-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'poll-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'poll-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'poll-images');
```

---

## 🧪 Testing in Your App

### Test 1: Upload Component

Create a test page to verify uploads work:

**Create: `src/screens/TestUploadScreen.tsx`**

```tsx
import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function TestUploadScreen() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  return (
    <div className="container-app py-6 space-y-4">
      <h1 className="text-2xl font-bold">Test Image Upload</h1>
      
      <ImageUpload
        value={imageUrl || ''}
        onChange={(url) => setImageUrl(url)}
        label="Test Upload"
        size="lg"
      />

      {imageUrl && (
        <div className="card p-4 space-y-2">
          <p className="text-sm font-medium">Uploaded URL:</p>
          <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block break-all">
            {imageUrl}
          </code>
        </div>
      )}
    </div>
  )
}
```

Add route in `src/App.tsx`:
```tsx
<Route path="/test-upload" element={<TestUploadScreen />} />
```

Visit: http://localhost:5173/test-upload

### Test 2: Manual Upload via API

```typescript
import { uploadImage } from '@/utils/imageUpload'

// In a component or event handler:
const file = event.target.files[0]
const url = await uploadImage(file, 'poll-images')
console.log('Uploaded to:', url)
```

---

## 🔒 Security Best Practices

### 1. File Size Limits
The utility already limits uploads to 5MB. Adjust if needed in `src/utils/imageUpload.ts`:

```typescript
const maxSize = 5 * 1024 * 1024 // 5MB
```

### 2. File Type Validation
Only image files are allowed:

```typescript
if (!file.type.startsWith('image/')) {
  throw new Error('File must be an image')
}
```

### 3. Storage Policies
- ✅ Public can **read** (view images)
- ✅ Only **authenticated users** can upload/update/delete
- ❌ Anonymous users **cannot upload**

### 4. Rate Limiting (Optional)

If you need rate limiting, add this in Supabase Dashboard:
- Go to **Storage** → **Settings**
- Configure rate limits per user

---

## 📊 Storage Limits

### Free Tier (Starter Plan)
- ✅ **1 GB** storage
- ✅ **2 GB** bandwidth per month
- ✅ Unlimited requests

### Pro Plan ($25/month)
- ✅ **100 GB** storage
- ✅ **200 GB** bandwidth per month
- ✅ Unlimited requests

**For UniVote:** The free tier should be plenty for a university voting app!

---

## 🛠️ Troubleshooting

### Issue 1: "Bucket not found" Error

**Solution:**
- Go to Storage dashboard
- Verify `poll-images` bucket exists
- Check bucket name spelling (case-sensitive)

### Issue 2: Upload Returns 403 Forbidden

**Solution:**
- Check that you're logged in (authenticated)
- Verify storage policies are created
- Check RLS (Row Level Security) policies in Storage → Policies

### Issue 3: Images Don't Display (CORS Error)

**Solution:**
- Verify bucket is set to **public**
- Check that the URL starts with `/public/` in the path:
  ```
  https://.../storage/v1/object/public/poll-images/...
  ```
- If not public, recreate the bucket with public enabled

### Issue 4: "File size too large"

**Solution:**
- Image must be under 5MB
- Compress the image before uploading
- Use tools like TinyPNG, Squoosh, or ImageOptim

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. ✅ Test upload with the test screen
3. ✅ Integrate `ImageUpload` component into:
   - Party creation forms
   - Candidate photo uploads
   - Poll thumbnails (if needed)

---

## 📚 Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Security Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Storage Limits & Pricing](https://supabase.com/pricing)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs → Storage
2. Check browser console for error messages
3. Verify your Supabase environment variables in `.env`

