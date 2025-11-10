import { useState, useRef } from 'react'
import { uploadImage, deleteImage, formatFileSize } from '@/utils/imageUpload'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  /**
   * Current image URL (if any)
   */
  value?: string
  
  /**
   * Callback when image is uploaded or removed
   */
  onChange: (url: string | null) => void
  
  /**
   * Supabase storage bucket name
   */
  bucket?: string
  
  /**
   * Label text above the upload area
   */
  label?: string
  
  /**
   * Show preview of uploaded image
   */
  showPreview?: boolean
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
}

export default function ImageUpload({
  value,
  onChange,
  bucket = 'poll-images',
  label = 'Upload Image',
  showPreview = true,
  size = 'md'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'h-24',
    md: 'h-32',
    lg: 'h-48'
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB', {
        description: `Your file is ${formatFileSize(file.size)}`
      })
      return
    }

    setUploading(true)
    try {
      const url = await uploadImage(file, bucket)
      onChange(url)
      toast.success('Image uploaded successfully! 📸')
    } catch (err: any) {
      console.error('[ImageUpload] Error:', err)
      toast.error('Upload failed', {
        description: err.message || 'Please try again'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      // Only delete from Supabase if it's a Supabase URL
      if (value.includes('supabase.co/storage')) {
        await deleteImage(value, bucket)
      }
      onChange(null)
      toast.success('Image removed')
    } catch (err: any) {
      console.error('[ImageUpload] Delete error:', err)
      toast.error('Failed to remove image', {
        description: err.message
      })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
        disabled={uploading}
      />

      {value && showPreview ? (
        // Preview existing image
        <div className="relative group">
          <div className={`${sizeClasses[size]} w-full rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700`}>
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Change button */}
          <div className="mt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        // Upload area
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            ${sizeClasses[size]} w-full
            border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center
            cursor-pointer transition-all
            ${dragActive 
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-500'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Uploading...</p>
            </div>
          ) : (
            <div className="text-center px-4">
              {dragActive ? (
                <>
                  <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-brand-600">Drop image here</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

