# Image Upload Usage Guide

How to use the new ImageUpload component in your UniVote app.

## 🎯 Quick Start

### Basic Usage

```tsx
import ImageUpload from '@/components/ImageUpload'
import { useState } from 'react'

function MyComponent() {
  const [imageUrl, setImageUrl] = useState<string>('')

  return (
    <ImageUpload
      value={imageUrl}
      onChange={(url) => setImageUrl(url || '')}
      label="Upload Photo"
    />
  )
}
```

---

## 📋 Component Props

```tsx
interface ImageUploadProps {
  value?: string              // Current image URL
  onChange: (url: string | null) => void  // Callback when image changes
  bucket?: string             // Supabase bucket name (default: 'poll-images')
  label?: string              // Label text (default: 'Upload Image')
  showPreview?: boolean       // Show preview (default: true)
  size?: 'sm' | 'md' | 'lg'  // Size variant (default: 'md')
}
```

---

## 💡 Use Cases

### 1. Party Logo Upload (in Poll Creation Form)

```tsx
import ImageUpload from '@/components/ImageUpload'
import { useState } from 'react'

function CreatePartyForm() {
  const [partyName, setPartyName] = useState('')
  const [logoUrl, setLogoUrl] = useState<string>('')

  return (
    <form className="space-y-4">
      <Input
        label="Party Name"
        value={partyName}
        onChange={(e) => setPartyName(e.target.value)}
      />

      <ImageUpload
        value={logoUrl}
        onChange={(url) => setLogoUrl(url || '')}
        label="Party Logo"
        size="md"
      />

      {/* Use logoUrl when submitting form */}
      <Button onClick={() => createParty({ name: partyName, logo: logoUrl })}>
        Create Party
      </Button>
    </form>
  )
}
```

### 2. Candidate Photo Upload

```tsx
function CandidatePhotoUpload() {
  const [photoUrl, setPhotoUrl] = useState('')

  return (
    <div className="space-y-4">
      <h3>President Photo</h3>
      <ImageUpload
        value={photoUrl}
        onChange={(url) => setPhotoUrl(url || '')}
        label="Upload Photo"
        size="lg"
      />
    </div>
  )
}
```

### 3. Multiple Images (President & Deputy)

```tsx
function PartyForm() {
  const [presidentPhoto, setPresidentPhoto] = useState('')
  const [deputyPhoto, setDeputyPhoto] = useState('')

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* President */}
      <div>
        <h3 className="font-semibold mb-2">President</h3>
        <Input label="Name" />
        <ImageUpload
          value={presidentPhoto}
          onChange={(url) => setPresidentPhoto(url || '')}
          label="Photo"
          size="md"
        />
      </div>

      {/* Deputy */}
      <div>
        <h3 className="font-semibold mb-2">Deputy President</h3>
        <Input label="Name" />
        <ImageUpload
          value={deputyPhoto}
          onChange={(url) => setDeputyPhoto(url || '')}
          label="Photo"
          size="md"
        />
      </div>
    </div>
  )
}
```

### 4. With Form State Management

Using React Hook Form or similar:

```tsx
import { useForm } from 'react-hook-form'

interface PartyFormData {
  name: string
  logo: string
  presidentName: string
  presidentPhoto: string
}

function PartyFormWithValidation() {
  const { register, handleSubmit, setValue, watch } = useForm<PartyFormData>()

  const logoUrl = watch('logo')

  const onSubmit = (data: PartyFormData) => {
    console.log('Form data:', data)
    // Submit to API
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Party Name"
        {...register('name', { required: true })}
      />

      <ImageUpload
        value={logoUrl}
        onChange={(url) => setValue('logo', url || '')}
        label="Party Logo"
      />

      <Button type="submit">Create Party</Button>
    </form>
  )
}
```

---

## 🛠️ Utility Functions

### Upload Image Programmatically

```tsx
import { uploadImage } from '@/utils/imageUpload'

async function handleManualUpload(file: File) {
  try {
    const url = await uploadImage(file, 'poll-images')
    console.log('Uploaded to:', url)
    return url
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
```

### Delete Image

```tsx
import { deleteImage } from '@/utils/imageUpload'

async function removeOldImage(imageUrl: string) {
  try {
    await deleteImage(imageUrl, 'poll-images')
    console.log('Image deleted')
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
```

### Fix Google Drive URLs (Fallback)

```tsx
import { fixImageUrl } from '@/utils/imageUpload'

// Convert Google Drive sharing URL to direct link
const driveUrl = 'https://drive.google.com/file/d/ABC123/view'
const directUrl = fixImageUrl(driveUrl)
// Result: https://drive.google.com/uc?export=view&id=ABC123

// Use in img tags
<img src={fixImageUrl(party.logo)} alt={party.name} />
```

---

## 🎨 Size Variants

```tsx
// Small (96px height)
<ImageUpload size="sm" value={url} onChange={setUrl} />

// Medium (128px height) - Default
<ImageUpload size="md" value={url} onChange={setUrl} />

// Large (192px height)
<ImageUpload size="lg" value={url} onChange={setUrl} />
```

---

## ✨ Features

### Drag & Drop
Users can drag and drop images onto the upload area

### File Validation
- ✅ Only image files allowed (PNG, JPG, GIF, etc.)
- ✅ Max 5MB file size
- ✅ Shows error toasts for invalid files

### Preview
- ✅ Shows uploaded image preview
- ✅ Hover to show remove button
- ✅ Click "Change Image" to upload new one

### Loading States
- ✅ Shows spinner during upload
- ✅ Disables interaction while uploading

---

## 🔒 Security

The component automatically:
- Validates file types (images only)
- Limits file size to 5MB
- Requires authentication (uses Supabase auth)
- Generates unique filenames to prevent collisions

---

## 🐛 Troubleshooting

### "Bucket not found" Error
**Solution:** Create the `poll-images` bucket in Supabase Storage (see SUPABASE_STORAGE_SETUP.md)

### Upload fails with 403 Forbidden
**Solution:** Make sure you're logged in and storage policies are set correctly

### Image doesn't display after upload
**Solution:** Verify the bucket is set to **public** in Supabase Storage settings

---

## 📦 Integration Examples

### Example 1: Update AdminCreateBallotScreen

```tsx
// In src/screens/AdminCreateBallotScreen.tsx

import ImageUpload from '@/components/ImageUpload'

// Add state for party logos
const [parties, setParties] = useState<VotingParty[]>([])

// When adding a new party
function addParty() {
  setParties([
    ...parties,
    {
      id: crypto.randomUUID(),
      name: '',
      logo: '', // Will be filled by ImageUpload
      president: { id: '', name: '', photo: '' },
      deputyPresident: { id: '', name: '', photo: '' }
    }
  ])
}

// Render in the party form
{parties.map((party, index) => (
  <div key={party.id} className="space-y-4">
    <Input
      label="Party Name"
      value={party.name}
      onChange={(e) => {
        const updated = [...parties]
        updated[index].name = e.target.value
        setParties(updated)
      }}
    />

    <ImageUpload
      value={party.logo}
      onChange={(url) => {
        const updated = [...parties]
        updated[index].logo = url || ''
        setParties(updated)
      }}
      label="Party Logo"
      size="md"
    />
  </div>
))}
```

### Example 2: Display Uploaded Images

```tsx
// In a poll display component

import { fixImageUrl } from '@/utils/imageUpload'

function PartyCard({ party }: { party: VotingParty }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      {/* Party Logo */}
      {party.logo && (
        <img
          src={fixImageUrl(party.logo)}
          alt={party.name}
          className="w-16 h-16 rounded-full object-cover"
        />
      )}

      <div>
        <h3 className="font-bold">{party.name}</h3>
        <p className="text-sm">
          {party.president.name} & {party.deputyPresident.name}
        </p>
      </div>
    </div>
  )
}
```

---

## 🚀 Next Steps

1. ✅ Complete Supabase Storage setup (see SUPABASE_STORAGE_SETUP.md)
2. ✅ Test upload at `/admin/test-upload`
3. ✅ Integrate into your poll creation forms
4. ✅ Update existing polls to use uploaded images

---

## 📞 Support

For more help, check:
- `SUPABASE_STORAGE_SETUP.md` - Complete setup guide
- `src/components/ImageUpload.tsx` - Component source code
- `src/utils/imageUpload.ts` - Utility functions
- Supabase Docs: https://supabase.com/docs/guides/storage

