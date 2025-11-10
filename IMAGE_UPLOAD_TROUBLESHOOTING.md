# 🔧 Image Upload Troubleshooting Guide

## Common Reasons Images Aren't Uploading

Based on your setup, here are the most likely causes and how to fix them:

---

## ❌ Issue 1: Storage Bucket Doesn't Exist

### Symptoms:
- Error message: "Bucket not found"
- Upload fails immediately
- Console shows 404 error

### Solution:
**The `poll-images` bucket needs to be created in Supabase first!**

#### Quick Fix:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `univote`
3. Click **Storage** in the left sidebar
4. Click **New Bucket**
5. Enter:
   - **Name**: `poll-images`
   - **Public bucket**: ✅ **CHECK THIS BOX** (very important!)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/*`
6. Click **Create Bucket**

---

## ❌ Issue 2: Not Authenticated

### Symptoms:
- Error message: "403 Forbidden" or "Not authenticated"
- Works in test but not in real app
- Upload button doesn't respond

### Solution:
**You must be logged in to upload images!**

#### Quick Fix:
1. Make sure you're logged into your UniVote app
2. Check that you see your user info in the header/profile
3. If not logged in, go to `/login` and sign in
4. Try uploading again

To verify authentication in console:
```javascript
// Open browser console and run:
const { data } = await supabase.auth.getSession()
console.log('Logged in as:', data.session?.user?.email)
```

---

## ❌ Issue 3: Missing Storage Policies

### Symptoms:
- Error: "New row violates row-level security policy"
- 403 Forbidden error
- Uploads fail even when logged in

### Solution:
**Storage policies need to be configured!**

#### Quick Fix - Run this SQL in Supabase SQL Editor:

```sql
-- Allow public read access (view images)
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

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Paste the SQL above
3. Click **Run**

---

## ❌ Issue 4: CORS Issues

### Symptoms:
- Error in console: "CORS policy blocked"
- Upload works in test file but not in app
- Network tab shows failed preflight request

### Solution:
Usually not an issue with Supabase, but verify:

1. Your app is running on the correct URL
2. Supabase URL in `.env.local` matches your project
3. No browser extensions blocking requests

---

## ❌ Issue 5: File Size Too Large

### Symptoms:
- Error: "File size exceeds limit"
- Upload progress bar stops
- Toast notification shows file size error

### Solution:
Images must be **under 5MB**

#### Quick Fix:
- Compress your image before uploading
- Use tools like:
  - TinyPNG: https://tinypng.com
  - Squoosh: https://squoosh.app
  - Online Image Compressor: https://imagecompressor.com

---

## ❌ Issue 6: Wrong File Type

### Symptoms:
- Error: "File must be an image"
- Upload rejected immediately

### Solution:
Only image files are allowed: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

---

## 🧪 Testing Your Setup

### Method 1: Use the Test File

I've created `test_storage_upload.html` for you:

1. Open `test_storage_upload.html` in your browser
2. It will automatically check:
   - ✅ Connection to Supabase
   - ✅ Whether `poll-images` bucket exists
   - ✅ Your authentication status
3. Click **Check 'poll-images' Bucket**
4. Try uploading a test image

### Method 2: Use Browser Console

```javascript
// 1. Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

// 2. Check authentication
const { data } = await supabase.auth.getSession()
console.log('Authenticated:', !!data.session)
console.log('User email:', data.session?.user?.email)

// 3. List storage buckets
const { data: buckets } = await supabase.storage.listBuckets()
console.log('Available buckets:', buckets.map(b => b.id))

// 4. Test upload (replace with your file)
const file = document.querySelector('input[type="file"]').files[0]
const { data: uploadData, error } = await supabase.storage
  .from('poll-images')
  .upload(`test-${Date.now()}.jpg`, file)
console.log('Upload result:', { uploadData, error })
```

---

## 📋 Complete Setup Checklist

Use this checklist to verify everything is configured:

### Supabase Configuration:
- [ ] `.env.local` file exists with correct values
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Storage bucket `poll-images` exists
- [ ] Bucket is set to **public**
- [ ] Storage policies are created (4 policies total)

### Authentication:
- [ ] You can login to the app
- [ ] User session persists after refresh
- [ ] Profile page shows user info

### Image Upload Component:
- [ ] `ImageUpload` component renders
- [ ] File picker opens when clicked
- [ ] Toast notifications appear
- [ ] Console shows upload logs

### Testing:
- [ ] Test upload HTML file works
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests
- [ ] Uploaded images display correctly

---

## 🔍 Debugging Steps

### Step 1: Check Environment Variables
```bash
# In your project directory:
cd C:\Users\Admin\Desktop\univote
Get-Content .env.local
```

### Step 2: Check Supabase Connection
Open your app in browser, press F12, go to Console, and run:
```javascript
console.log('Supabase configured:', window.supabase)
```

### Step 3: Check Browser Console for Errors
1. Open your app
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Try uploading an image
5. Look for red error messages

Common errors and their meanings:
- `403 Forbidden` → Authentication or policy issue
- `404 Not Found` → Bucket doesn't exist
- `413 Payload Too Large` → File too big
- `Network Error` → Supabase URL wrong or offline

### Step 4: Check Network Tab
1. Open DevTools → **Network** tab
2. Try uploading an image
3. Look for request to `supabase.co/storage/v1/object/poll-images`
4. Click on the request to see details:
   - **Status**: Should be `200` or `201`
   - **Response**: Should contain file path
   - **Headers**: Check authorization token is present

---

## 💡 Quick Diagnostic Script

Add this to your browser console to diagnose all issues at once:

```javascript
async function diagnoseImageUpload() {
  console.log('🔍 Diagnosing Image Upload Setup...\n')
  
  // 1. Check environment
  console.log('1️⃣ Environment Variables:')
  console.log('   VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || '❌ MISSING')
  console.log('   VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING')
  
  // 2. Check authentication
  console.log('\n2️⃣ Authentication:')
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session) {
    console.log('   ✅ Authenticated as:', sessionData.session.user.email)
  } else {
    console.log('   ❌ NOT authenticated - login required!')
  }
  
  // 3. Check buckets
  console.log('\n3️⃣ Storage Buckets:')
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) throw error
    
    const hasPollImages = buckets.some(b => b.id === 'poll-images')
    if (hasPollImages) {
      console.log('   ✅ poll-images bucket exists')
      const bucket = buckets.find(b => b.id === 'poll-images')
      console.log('   Public:', bucket.public ? '✅ YES' : '❌ NO (must be public!)')
    } else {
      console.log('   ❌ poll-images bucket NOT FOUND')
      console.log('   Available buckets:', buckets.map(b => b.id).join(', '))
    }
  } catch (err) {
    console.log('   ❌ Error checking buckets:', err.message)
  }
  
  // 4. Test upload permissions
  console.log('\n4️⃣ Upload Permissions:')
  if (sessionData.session) {
    try {
      // Try to list files (test read permission)
      const { data, error } = await supabase.storage
        .from('poll-images')
        .list('', { limit: 1 })
      
      if (error) throw error
      console.log('   ✅ Can read from poll-images bucket')
    } catch (err) {
      console.log('   ❌ Cannot read from bucket:', err.message)
    }
  } else {
    console.log('   ⏭️ Skipped (not authenticated)')
  }
  
  console.log('\n✅ Diagnosis complete!')
}

// Run diagnosis
diagnoseImageUpload()
```

---

## 🆘 Still Not Working?

If you've tried everything above and images still won't upload:

### 1. Verify Bucket Configuration
1. Go to Supabase Dashboard → Storage
2. Click on `poll-images` bucket
3. Check **Policies** tab - should have 4 policies
4. Check **Settings** tab - should be marked as "Public"

### 2. Check Supabase Logs
1. Go to Supabase Dashboard → Logs → Storage
2. Filter by recent time
3. Look for error messages when you try to upload

### 3. Test with Direct Upload
Create a minimal test in browser console:
```javascript
const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
const { data, error } = await supabase.storage
  .from('poll-images')
  .upload('test-direct.jpg', testFile)
console.log({ data, error })
```

### 4. Restart Development Server
Sometimes cached environment variables cause issues:
```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 📞 Support

If you're still stuck, check:
1. Browser console for specific error messages
2. Supabase Dashboard → Logs for server-side errors
3. Network tab for failed requests
4. Run the diagnostic script above and share the output

---

## ✅ Success Checklist

You'll know everything is working when:
- [ ] Test upload HTML file successfully uploads
- [ ] Browser console shows "Upload successful"
- [ ] Image preview displays after upload
- [ ] Public URL works in new browser tab
- [ ] Image uploads work in your app's poll creation form
- [ ] No error messages in console

---

**Need immediate help?** Run the test file: `test_storage_upload.html`

