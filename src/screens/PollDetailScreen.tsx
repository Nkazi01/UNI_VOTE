import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPoll, setPollPublished, closePoll, deletePoll } from '@/api/pollApi'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utils/formatters'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { usePolls } from '@/contexts/PollContext'

export default function PollDetailScreen() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const { refresh } = usePolls()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [poll, setPoll] = useState<any | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  const loadPoll = async () => {
    try {
      setPoll(await getPoll(id || ''))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPoll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const closed = useMemo(() => poll && new Date(poll.endsAt).getTime() < Date.now(), [poll])
  const isAdmin = user?.role === 'admin'
  
  const handleClosePoll = async () => {
    if (!confirm('Are you sure you want to close this poll now? This will end voting immediately.')) return
    
    setActionLoading(true)
    try {
      await closePoll(poll.id)
      toast.success('Poll closed successfully')
      await loadPoll()
      await refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to close poll')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handlePublish = async () => {
    setActionLoading(true)
    try {
      await setPollPublished(poll.id, true)
      toast.success('Results published!')
      await loadPoll()
      await refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish results')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to DELETE this poll? This action cannot be undone!')) return
    
    setActionLoading(true)
    try {
      await deletePoll(poll.id)
      toast.success('Poll deleted')
      await refresh()
      nav('/admin')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete poll')
      setActionLoading(false)
    }
  }

  if (loading) return <div className="container-app py-6">Loading…</div>
  if (error || !poll) return <div className="container-app py-6">Unable to load poll.</div>
  
  return (
    <div className="container-app py-6 space-y-4">
      <h1 className="text-2xl font-bold">{poll.title}</h1>
      <p className="text-gray-600 dark:text-gray-300">{poll.description}</p>
      
      {/* Poll Status */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-gray-500">Status: </span>
          <span className={`font-medium ${closed ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {closed ? '🔒 Closed' : '✅ Active'}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Closes: </span>
          <span className="font-medium">{formatDateTime(poll.endsAt)}</span>
        </div>
      </div>
      
      {poll.published && (
        <div className="card p-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">✅ Results have been published and are visible to all voters</p>
        </div>
      )}
      
      {/* Voter Actions */}
      <div className="flex gap-3 pt-2">
        <Button disabled={closed} onClick={() => nav(`/vote/${poll.id}`)}>
          {closed ? '🔒 Poll Closed' : '📝 Vote Now'}
        </Button>
        <Button variant="secondary" onClick={() => nav('/results?poll=' + poll.id)}>
          📊 View Results
        </Button>
      </div>
      
      {/* Admin Actions */}
      {isAdmin && (
        <div className="border-t pt-4 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Admin Controls</h3>
          <div className="flex flex-wrap gap-3">
            {!closed && (
              <Button 
                variant="secondary" 
                onClick={handleClosePoll}
                loading={actionLoading}
                disabled={actionLoading}
              >
                🔒 Close Poll Now
              </Button>
            )}
            {closed && !poll.published && (
              <Button 
                variant="secondary" 
                onClick={handlePublish}
                loading={actionLoading}
                disabled={actionLoading}
              >
                📢 Publish Results
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={handleDelete}
              loading={actionLoading}
              disabled={actionLoading}
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-800"
            >
              🗑️ Delete Poll
            </Button>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 pt-4">Your identity is verified with 2FA. Votes are anonymous and not linked to your profile.</p>
    </div>
  )
}


