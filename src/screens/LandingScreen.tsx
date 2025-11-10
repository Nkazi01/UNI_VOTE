import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function LandingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-app py-20 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text">Welcome to UniVote</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A simple, secure way to run university polls and elections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login"><Button size="lg">Log In</Button></Link>
          <Link to="/register"><Button variant="outline" size="lg">Create Account</Button></Link>
        </div>
      </div>
    </div>
  )
}


