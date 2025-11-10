import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TestUploadScreen() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-app py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold gradient-text">Image Upload Test</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Test the Supabase Storage image upload functionality
          </p>
        </div>

        {/* Upload Test Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Test 1: Party Logo Upload */}
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Party Logo Upload</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test uploading a party logo (square recommended)
              </p>
            </div>

            <ImageUpload
              value={logoUrl || ''}
              onChange={(url) => setLogoUrl(url)}
              label="Party Logo"
              size="md"
            />

            {logoUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✅ Upload Successful!
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Public URL:
                  </p>
                  <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                    {logoUrl}
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Test 2: Candidate Photo Upload */}
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Candidate Photo</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test uploading a candidate photo (portrait recommended)
              </p>
            </div>

            <ImageUpload
              value={imageUrl || ''}
              onChange={(url) => setImageUrl(url)}
              label="Candidate Photo"
              size="lg"
            />

            {imageUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✅ Upload Successful!
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Public URL:
                  </p>
                  <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                    {imageUrl}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            📋 Setup Instructions
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>1.</strong> Go to your Supabase Dashboard → Storage
            </p>
            <p>
              <strong>2.</strong> Create a new bucket called <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">poll-images</code>
            </p>
            <p>
              <strong>3.</strong> Make sure the bucket is set to <strong>Public</strong>
            </p>
            <p>
              <strong>4.</strong> Return here and test uploading images
            </p>
            <p className="pt-2 border-t border-blue-200 dark:border-blue-700">
              📖 Full setup guide: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">SUPABASE_STORAGE_SETUP.md</code>
            </p>
          </div>
        </div>

        {/* Results Preview */}
        {(imageUrl || logoUrl) && (
          <div className="card p-6 space-y-4">
            <h3 className="text-lg font-semibold">Preview Results</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {logoUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Party Logo</p>
                  <div className="aspect-square w-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={logoUrl}
                      alt="Party logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {imageUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Candidate Photo</p>
                  <div className="aspect-square w-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={imageUrl}
                      alt="Candidate photo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

