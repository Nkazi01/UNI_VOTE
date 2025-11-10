# 🐛 Debug Image Upload Issues

Your Supabase storage is **correctly configured**:
- ✅ Bucket exists (`poll-images`)
- ✅ Bucket is public
- ✅ All 4 policies are correct
- ✅ You're authenticated

But uploads are hanging. Let's debug:

---

## 🧪 Step 1: Test Direct Upload

**On your app** (localhost:5173), open Console and run:

```javascript
// Test basic upload
(async () => {
  console.log('🔍 Testing direct upload...')
  
  const testFile = new File(['test'], 'test-' + Date.now() + '.txt', { type: 'text/plain' })
  
  console.time('Upload time')
  const { data, error } = await supabase.storage
    .from('poll-images')
    .upload('test-' + Date.now() + '.txt', testFile)
  console.timeEnd('Upload time')
  
  if (error) {
    console.error('❌ Upload failed:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
  } else {
    console.log('✅ Upload successful!', data)
  }
})()
```

**Expected result:** Should complete in < 2 seconds

---

## 🔍 Step 2: Check Network Tab

1. Open DevTools → **Network** tab
2. Clear it (🚫 icon)
3. Go to poll creation form
4. Try uploading a small image
5. Watch for requests to `/storage/v1/object/poll-images/`

**Look for:**
- ❌ **Red/failed requests** - Check status code
- ⏱️ **Pending requests** - Taking forever to complete
- 🔄 **Multiple identical requests** - Component re-rendering issue

**Take a screenshot of the Network tab** during upload!

---

## 🖼️ Step 3: Test With Different Image Sizes

The issue might be **large file sizes causing timeouts**.

**Test with:**
1. ✅ **Tiny image** (< 100KB) - Should upload fast
2. ✅ **Medium image** (500KB - 1MB) - Should work
3. ❌ **Large image** (3-5MB) - Might timeout

**How to check file size:**
- Windows: Right-click image → Properties → Size
- Or use this in console after selecting file:

```javascript
// After selecting a file in the upload input
const fileInput = document.querySelector('input[type="file"]')
if (fileInput && fileInput.files[0]) {
  const file = fileInput.files[0]
  console.log('File:', file.name)
  console.log('Size:', (file.size / 1024).toFixed(2) + ' KB')
  console.log('Type:', file.type)
}
```

---

## 🔧 Step 4: Add Detailed Logging

Let's add more logging to see exactly where it's hanging.

**Open:** `src/utils/imageUpload.ts`

**Replace the `uploadImage` function with this version:**

```typescript
export async function uploadImage(
  file: File,
  bucket: string = 'poll-images'
): Promise<string> {
  console.log('[ImageUpload] Starting upload:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    bucket
  })

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB')
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = fileName

  console.log('[ImageUpload] Generated filename:', fileName)
  console.log('[ImageUpload] Starting Supabase upload...')

  try {
    // Upload to Supabase Storage
    const uploadStartTime = Date.now()
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    const uploadDuration = Date.now() - uploadStartTime

    console.log('[ImageUpload] Upload request completed in', uploadDuration, 'ms')

    if (error) {
      console.error('[ImageUpload] Upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    console.log('[ImageUpload] Upload successful:', data)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('[ImageUpload] Public URL:', publicUrl)
    console.log('[ImageUpload] Total time:', Date.now() - uploadStartTime, 'ms')

    return publicUrl
  } catch (err: any) {
    console.error('[ImageUpload] Exception during upload:', err)
    throw err
  }
}
```

This will show:
- Exactly when the upload starts
- How long it takes
- Where it fails (if it fails)

---

## 🚨 Common Issues & Fixes

### Issue: Uploads timeout after 30+ seconds
**Cause:** Large file size or slow connection  
**Fix:** 
- Compress images before uploading
- Use https://tinypng.com or https://squoosh.app
- Target < 500KB per image

### Issue: Multiple upload attempts in console
**Cause:** Component re-rendering  
**Fix:** Already handled in code (uploading state prevents duplicates)

### Issue: Error "Storage API not available"
**Cause:** Supabase client not initialized  
**Fix:** Check `.env.local` has correct values, restart dev server

### Issue: Error "Invalid JWT" or "Session expired"
**Cause:** Not logged in or session expired  
**Fix:** Log out and log back in

---

## 📊 Expected Behavior

**Good upload logs should look like:**
```
[ImageUpload] Starting upload: { fileName: 'test.jpg', fileSize: 245678, ... }
[ImageUpload] Generated filename: abc123-1699999999.jpg
[ImageUpload] Starting Supabase upload...
[ImageUpload] Upload request completed in 1247 ms
[ImageUpload] Upload successful: { path: 'abc123-1699999999.jpg' }
[ImageUpload] Public URL: https://jkxnrbjasajvphewvamq.supabase.co/storage/v1/object/public/poll-images/abc123-1699999999.jpg
[ImageUpload] Total time: 1250 ms
✅ Image uploaded successfully! 📸
```

**Bad upload logs (hanging):**
```
[ImageUpload] Starting upload: { fileName: 'huge.jpg', fileSize: 8900000, ... }
[ImageUpload] Generated filename: abc123-1699999999.jpg
[ImageUpload] Starting Supabase upload...
(hangs here - never completes)
```

---

## 🎯 Action Plan

1. ✅ Run the direct upload test in console (Step 1)
2. ✅ Check Network tab during upload (Step 2)
3. ✅ Try uploading a TINY image (< 100KB) (Step 3)
4. ✅ Update imageUpload.ts with detailed logging (Step 4)
5. ✅ Try uploading again and check console logs

**Share the results** and I'll help you pinpoint the exact issue!

---

## 💡 Quick Workaround (If Still Stuck)

If uploads keep failing, you can temporarily:
1. Skip images (they're optional)
2. Create the poll
3. Come back to fix image uploads later

But let's try to fix it properly first! Run the tests above.

