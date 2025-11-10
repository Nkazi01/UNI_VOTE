import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePolls } from '@/contexts/PollContext'
import { useAuth } from '@/contexts/AuthContext'
import VoteCard from '@/components/VoteCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/EmptyState'
import { Search, Filter, Plus, Calendar } from 'lucide-react'

export default function PollsScreen() {
  const { polls } = usePolls()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all')
  const isAdmin = user?.role === 'admin'
  
  const filtered = useMemo(() => {
    let result = polls.filter(p => p.title.toLowerCase().includes(q.toLowerCase()))
    
    if (filter === 'active') {
      result = result.filter(p => new Date(p.endsAt).getTime() > Date.now())
    } else if (filter === 'closed') {
      result = result.filter(p => new Date(p.endsAt).getTime() <= Date.now())
    }
    
    return result
  }, [polls, q, filter])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-app py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text">All Polls</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and participate in university polls. Your voice matters.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search polls by title or description..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('all')}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
              <Button
                variant={filter === 'active' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('active')}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Active
              </Button>
              <Button
                variant={filter === 'closed' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('closed')}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Closed
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>{filtered.length} poll{filtered.length !== 1 ? 's' : ''} found</span>
            {isAdmin && (
              <Link to="/admin/create">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Poll
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Polls Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            title={q ? "No polls found" : "No polls available"}
            description={q ? "Try adjusting your search terms" : "Check back later for new polls"}
            action={q ? { label: "Clear Search", onClick: () => setQ('') } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((poll, index) => (
              <div key={poll.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-up">
                <VoteCard 
                  id={poll.id} 
                  title={poll.title} 
                  description={poll.description} 
                  endsAt={poll.endsAt}
                  type={poll.type}
                  optionsCount={poll.options?.length || 0}
                  partiesCount={poll.parties?.length || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


