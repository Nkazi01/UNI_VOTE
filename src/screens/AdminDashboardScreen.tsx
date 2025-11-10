import { Link } from 'react-router-dom'
import { usePolls } from '@/contexts/PollContext'
import { pluralize } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AdminDashboardScreen() {
  const { polls, results } = usePolls()
  const totalVotes = Object.values(results).reduce((acc, r) => acc + Object.values(r).reduce((a, n) => a + n, 0), 0)
  return (
    <div className="container-app py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Poll
          </Button>
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-4"><div className="text-sm text-gray-500">Active Polls</div><div className="text-2xl font-semibold">{polls.length}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Total Votes</div><div className="text-2xl font-semibold">{totalVotes}</div></div>
        <div className="card p-4"><div className="text-sm text-gray-500">Avg. Options</div><div className="text-2xl font-semibold">{polls.length ? Math.round(polls.reduce((a, p) => a + p.options.length, 0) / polls.length) : 0}</div></div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Recent Polls</h2>
        <div className="space-y-2">
          {polls.slice(0, 5).map((p) => (
            <div key={p.id} className="card p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500">{pluralize('option', p.options.length)}</div>
              </div>
              <div className="text-sm text-gray-600">{Object.values(results[p.id] || {}).reduce((a, n) => a + n, 0)} votes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


