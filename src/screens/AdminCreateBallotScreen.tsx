import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPoll, type VotingParty } from '@/api/pollApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/ImageUpload'
import { toast } from 'sonner'

type PartyForm = {
  name: string
  logo: string
  president: string
  presidentPhoto: string
  deputyPresident: string
  deputyPresidentPhoto: string
}

export default function AdminCreateBallotScreen() {
  const nav = useNavigate()
  const [title, setTitle] = useState('New Poll')
  const [description, setDescription] = useState('Describe the poll')
  const [type, setType] = useState<'single' | 'multiple' | 'party'>('single')
  const [options, setOptions] = useState<string>('Option A\nOption B')
  const [parties, setParties] = useState<PartyForm[]>([{ 
    name: '', 
    logo: '',
    president: '', 
    presidentPhoto: '',
    deputyPresident: '', 
    deputyPresidentPhoto: '' 
  }])
  
  // Duration settings - default to starting now and ending in 7 days
  const [startsAt, setStartsAt] = useState(() => {
    const now = new Date()
    return now.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
  })
  const [endsAt, setEndsAt] = useState(() => {
    const future = new Date(Date.now() + 7 * 24 * 3600 * 1000)
    return future.toISOString().slice(0, 16)
  })
  
  const [created, setCreated] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addParty() {
    setParties([...parties, { 
      name: '', 
      logo: '',
      president: '', 
      presidentPhoto: '',
      deputyPresident: '', 
      deputyPresidentPhoto: '' 
    }])
  }

  function updateParty(index: number, field: keyof PartyForm, value: string) {
    const updated = [...parties]
    updated[index] = { ...updated[index], [field]: value }
    setParties(updated)
  }

  function removeParty(index: number) {
    setParties(parties.filter((_, i) => i !== index))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    
    try {
      // Validation for dates
      const startDate = new Date(startsAt)
      const endDate = new Date(endsAt)
      
      if (endDate <= startDate) {
        setError('End date/time must be after start date/time')
        setSubmitting(false)
        return
      }
      
      const now = new Date()
      if (startDate < new Date(now.getTime() - 60000)) { // Allow 1 minute tolerance
        setError('Start date/time cannot be in the past')
        setSubmitting(false)
        return
      }
      
      // Validation for poll content
      if (type === 'party') {
        const validParties = parties.filter(p => p.name && p.president && p.deputyPresident)
        if (validParties.length === 0) {
          setError('Please add at least one party with all required fields (name, president, deputy president)')
          setSubmitting(false)
          return
        }
      } else {
        const validOptions = options.split('\n').filter(Boolean)
        if (validOptions.length < 2) {
          setError('Please provide at least 2 options (one per line)')
          setSubmitting(false)
          return
        }
      }
      
      const payload: any = {
        title,
        description,
        type,
        options: type === 'party' ? [] : options.split('\n').filter(Boolean).map((label) => ({ id: crypto.randomUUID(), label })),
        startsAt: startDate.toISOString(),
        endsAt: endDate.toISOString()
      }
      
      if (type === 'party') {
        payload.parties = parties
          .filter(p => p.name && p.president && p.deputyPresident)
          .map((p): VotingParty => ({
            id: crypto.randomUUID(),
            name: p.name,
            logo: p.logo || undefined,
            president: { 
              id: crypto.randomUUID(), 
              name: p.president,
              photo: p.presidentPhoto || undefined
            },
            deputyPresident: { 
              id: crypto.randomUUID(), 
              name: p.deputyPresident,
              photo: p.deputyPresidentPhoto || undefined
            }
          }))
      }
      
      console.log('[AdminCreateBallot] Submitting poll with payload:', payload)
      const p = await createPoll(payload)
      console.log('[AdminCreateBallot] Poll created:', p.id)
      setCreated(p.id)
      toast.success('Poll created successfully!')
      // Navigate to poll detail or admin dashboard after a short delay
      setTimeout(() => {
        nav(`/polls/${p.id}`)
      }, 1500)
    } catch (err: any) {
      console.error('[AdminCreateBallot] Error creating poll:', err)
      const errorMessage = err.message || 'Failed to create poll. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      // Ensure submitting is set to false even if there's an error
      setSubmitting(false)
    }
  }

  // Calculate duration for display
  const calculateDuration = () => {
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    const diffMs = end.getTime() - start.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours > 0 ? `${diffHours}h` : ''}`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMinutes > 0 ? `${diffMinutes}m` : ''}`
    } else {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`
    }
  }

  return (
    <div className="container-app py-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Poll</h1>
      <form onSubmit={submit} className="card p-4 space-y-3">
        <label className="block"><span className="text-sm">Title</span><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label className="block"><span className="text-sm">Description</span><Input value={description} onChange={(e) => setDescription(e.target.value)} required /></label>
        
        {/* Poll Duration Section */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">⏰ Poll Duration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Start Date & Time</span>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 focus-ring"
                required
              />
            </label>
            
            <label className="block">
              <span className="text-sm">End Date & Time</span>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 focus-ring"
                required
              />
            </label>
          </div>
          
          {startsAt && endsAt && new Date(endsAt) > new Date(startsAt) && (
            <div className="px-3 py-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg">
              <p className="text-sm text-brand-700 dark:text-brand-300">
                📊 Poll will run for <span className="font-semibold">{calculateDuration()}</span>
              </p>
            </div>
          )}
          
          {/* Quick duration presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Quick presets:</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const start = new Date()
                const end = new Date(start.getTime() + 24 * 3600 * 1000)
                setStartsAt(start.toISOString().slice(0, 16))
                setEndsAt(end.toISOString().slice(0, 16))
              }}
            >
              1 Day
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const start = new Date()
                const end = new Date(start.getTime() + 3 * 24 * 3600 * 1000)
                setStartsAt(start.toISOString().slice(0, 16))
                setEndsAt(end.toISOString().slice(0, 16))
              }}
            >
              3 Days
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const start = new Date()
                const end = new Date(start.getTime() + 7 * 24 * 3600 * 1000)
                setStartsAt(start.toISOString().slice(0, 16))
                setEndsAt(end.toISOString().slice(0, 16))
              }}
            >
              1 Week
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const start = new Date()
                const end = new Date(start.getTime() + 14 * 24 * 3600 * 1000)
                setStartsAt(start.toISOString().slice(0, 16))
                setEndsAt(end.toISOString().slice(0, 16))
              }}
            >
              2 Weeks
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3 items-center flex-wrap border-t pt-4">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Poll Type:</span>
          <label className="inline-flex items-center gap-2 text-sm"><input checked={type==='single'} onChange={() => setType('single')} type="radio"/> Single</label>
          <label className="inline-flex items-center gap-2 text-sm"><input checked={type==='multiple'} onChange={() => setType('multiple')} type="radio"/> Multiple</label>
          <label className="inline-flex items-center gap-2 text-sm"><input checked={type==='party'} onChange={() => setType('party')} type="radio"/> Party (SRC)</label>
        </div>
        {type === 'party' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Voting Parties</span>
              <Button type="button" variant="secondary" size="sm" onClick={addParty}>Add Party</Button>
            </div>
            {parties.map((party, index) => (
              <div key={index} className="card p-4 space-y-3 border-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Party {index + 1}</span>
                  {parties.length > 1 && (
                    <Button type="button" variant="secondary" size="sm" onClick={() => removeParty(index)}>Remove</Button>
                  )}
                </div>
                
                {/* Party Info */}
                <label className="block">
                  <span className="text-sm font-semibold">Party Name *</span>
                  <Input value={party.name} onChange={(e) => updateParty(index, 'name', e.target.value)} placeholder="e.g., Progressive Students Alliance" required />
                </label>
                
                {/* Party Logo Upload */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <ImageUpload
                    value={party.logo}
                    onChange={(url) => updateParty(index, 'logo', url || '')}
                    label="Party Logo (Optional)"
                    size="md"
                    bucket="poll-images"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Upload a square logo (PNG or JPG, max 5MB) for best results
                  </p>
                </div>
                
                {/* President */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    👤 President Candidate
                  </h4>
                  <label className="block">
                    <span className="text-sm font-medium">Full Name *</span>
                    <Input value={party.president} onChange={(e) => updateParty(index, 'president', e.target.value)} placeholder="e.g., John Doe" required />
                  </label>
                  
                  {/* President Photo Upload */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <ImageUpload
                      value={party.presidentPhoto}
                      onChange={(url) => updateParty(index, 'presidentPhoto', url || '')}
                      label="President Photo (Optional)"
                      size="md"
                      bucket="poll-images"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      💡 Upload a portrait photo for better presentation
                    </p>
                  </div>
                </div>
                
                {/* Deputy President */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    👤 Deputy President Candidate
                  </h4>
                  <label className="block">
                    <span className="text-sm font-medium">Full Name *</span>
                    <Input value={party.deputyPresident} onChange={(e) => updateParty(index, 'deputyPresident', e.target.value)} placeholder="e.g., Jane Smith" required />
                  </label>
                  
                  {/* Deputy President Photo Upload */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <ImageUpload
                      value={party.deputyPresidentPhoto}
                      onChange={(url) => updateParty(index, 'deputyPresidentPhoto', url || '')}
                      label="Deputy President Photo (Optional)"
                      size="md"
                      bucket="poll-images"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      💡 Upload a portrait photo for better presentation
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <label className="block"><span className="text-sm">Options (one per line)</span><textarea value={options} onChange={(e) => setOptions(e.target.value)} className="w-full h-24 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus-ring" /></label>
        )}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <Button type="submit" loading={submitting} disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Poll'}
        </Button>
        {created && <p className="text-sm text-green-600">Poll created successfully! Redirecting...</p>}
      </form>
    </div>
  )
}


