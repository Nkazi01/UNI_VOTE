import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { usePolls } from '@/contexts/PollContext'
import ChartWrapper from '@/components/ChartWrapper'

export default function ResultsScreen() {
  const { polls, results } = usePolls()
  const { user } = useAuth()
  const params = new URLSearchParams(useLocation().search)
  const pollId = params.get('poll') || polls[0]?.id
  const poll = polls.find((p) => p.id === pollId)
  const isAdmin = user?.role === 'admin'
  const isPublished = poll?.published || false
  const pollHasEnded = poll ? new Date(poll.endsAt).getTime() < Date.now() : false
  const data = useMemo(() => {
    if (!poll) return []
    const tally = results[poll.id] || {}
    if (poll.type === 'party' && poll.parties) {
      return poll.parties.map((party) => ({
        name: party.name,
        value: tally[party.id] || 0,
        subtitle: `${party.president.name} & ${party.deputyPresident.name}`
      }))
    }
    return poll.options.map((o) => ({ name: o.label, value: tally[o.id] || 0 }))
  }, [poll, results])
  if (!poll) return <div className="container-app py-6">No results available</div>
  
  // Show results only if published OR if admin
  if (!isPublished && !isAdmin) {
    return (
      <div className="container-app py-6 space-y-3">
        <h1 className="text-2xl font-bold">Results: {poll.title}</h1>
        <div className="card p-6 text-center">
          <p className="text-lg font-medium mb-2">🔒 Results Not Yet Available</p>
          {!pollHasEnded ? (
            <p className="text-gray-600 dark:text-gray-300">
              Voting is still in progress. Results will be published after the poll closes on {new Date(poll.endsAt).toLocaleDateString()}.
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              The poll has closed. Results are being verified and will be published by an admin shortly.
            </p>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="container-app py-6 space-y-4">
      <h1 className="text-2xl font-bold">Results: {poll.title}</h1>
      
      {/* Admin preview badge for unpublished results */}
      {isAdmin && !isPublished && (
        <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ Admin Preview - Results are not yet published
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            These results are only visible to you. Go to the poll detail page to publish them.
          </p>
        </div>
      )}
      
      {/* Published status - results update in real-time */}
      {isPublished && (
        <div className="card p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            ✅ Results Published - Updates in real-time
          </p>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            These results are visible to all voters and update automatically as votes are tallied.
          </p>
        </div>
      )}
      
      <ChartWrapper data={data} />
    </div>
  )
}


