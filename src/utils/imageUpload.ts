import { supabase } from '@/lib/supabase'

// Check if supabase storage is available on module load
if (!supabase || !supabase.storage) {
  console.error('[ImageUpload] ERROR: Supabase storage client not available!')
  console.error('[ImageUpload] supabase:', supabase)
} else {
  console.log('[ImageUpload] Supabase storage client initialized ✓')
}

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (default: 'poll-images')
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'poll-images'
): Promise<string> {
  console.log('[ImageUpload] Starting upload:', {
    fileName: file.name,
    fileSize: `${(file.size / 1024).toFixed(2)} KB`,
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
  console.log('[ImageUpload] Using direct HTTP upload to Supabase...')

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`
    
    console.log('[ImageUpload] Upload URL:', uploadUrl)
    
    // Get auth token from localStorage (stored during login)
    console.log('[ImageUpload] Getting auth token...')
    let authToken = supabaseAnonKey
    
    const storedToken = localStorage.getItem('sb-access-token')
    if (storedToken) {
      authToken = storedToken
      console.log('[ImageUpload] ✅ Using stored auth token')
    } else {
      console.log('[ImageUpload] ⚠️ No stored token found - using anon key (may fail!)')
      console.log('[ImageUpload] Make sure you are logged in')
    }
    
    console.log('[ImageUpload] Sending POST request...')

    // Use direct fetch instead of Supabase SDK
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'apikey': supabaseAnonKey,
        'Content-Type': file.type,
        'x-upsert': 'false'
      },
      body: file
    })

    console.log('[ImageUpload] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[ImageUpload] Upload failed:', errorText)
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('[ImageUpload] Upload successful:', result)

    // Construct public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`
    console.log('[ImageUpload] Public URL:', publicUrl)

    return publicUrl
  } catch (err: any) {
    console.error('[ImageUpload] Exception during upload:', err)
    console.error('[ImageUpload] Error stack:', err.stack)
    throw new Error(err.message || 'Upload failed')
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full public URL of the image
 * @param bucket - The storage bucket name (default: 'poll-images')
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = 'poll-images'
): Promise<void> {
  // Extract filename from URL
  const urlParts = imageUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]

  console.log('[ImageUpload] Deleting image:', fileName)

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) {
    console.error('[ImageUpload] Delete error:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }

  console.log('[ImageUpload] Image deleted successfully')
}

/**
 * Convert Google Drive URL to direct link (fallback helper)
 * @param driveUrl - Google Drive sharing URL
 * @returns Direct link URL that can be used in img src
 */
export function convertGoogleDriveUrl(driveUrl: string): string {
  // Extract file ID from various Google Drive URL formats
  const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  
  if (fileIdMatch) {
    const fileId = fileIdMatch[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  // If already in direct format or not a Drive URL, return as-is
  return driveUrl
}

/**
 * Validate and fix image URLs
 * - Converts Google Drive URLs to direct links
 * - Returns Supabase URLs as-is
 * - Returns other URLs as-is
 */
export function fixImageUrl(url: string): string {
  if (!url) return ''
  
  // Handle Google Drive URLs
  if (url.includes('drive.google.com')) {
    return convertGoogleDriveUrl(url)
  }
  
  // Return other URLs (Supabase, direct links, etc.) as-is
  return url
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

