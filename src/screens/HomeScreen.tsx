import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePolls } from '@/contexts/PollContext'
import VoteCard from '@/components/VoteCard'
import EmptyState from '@/components/EmptyState'
import { TrendingUp, Users, Clock } from 'lucide-react'

export default function HomeScreen() {
  const { polls, refresh } = usePolls()
  useEffect(() => { refresh() }, [])
  
  const activePolls = polls.filter(p => new Date(p.endsAt).getTime() > Date.now())
  const totalVotes = polls.reduce((acc, poll) => acc + poll.options.length, 0)
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 py-16">
        <div className="container-app">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Welcome to UniVote
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Secure, anonymous voting for your university. Make your voice heard with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/results"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-lg rounded-xl font-medium border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-400 transition-all duration-200"
              >
                <TrendingUp className="w-5 h-5" />
                View Results
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center animate-slide-up">
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activePolls.length}</h3>
            <p className="text-gray-600 dark:text-gray-300">Active Polls</p>
          </div>
          
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalVotes}</h3>
            <p className="text-gray-600 dark:text-gray-300">Total Options</p>
          </div>
          
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24/7</h3>
            <p className="text-gray-600 dark:text-gray-300">Available</p>
          </div>
        </div>

        {/* Polls Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Active Polls</h2>
            <Link 
              to="/polls"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 text-base rounded-xl font-medium border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-400 transition-all duration-200"
            >
              View All
            </Link>
          </div>
          
          {activePolls.length === 0 ? (
            <EmptyState 
              title="No active polls" 
              description="Check back later for new polls or create one if you're an admin." 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePolls.map((poll, index) => (
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
    </div>
  )
}


