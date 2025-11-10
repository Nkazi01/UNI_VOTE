import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, User, Vote } from 'lucide-react'

export default function BottomNav() {
  const { pathname } = useLocation()
  const items = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/polls', label: 'Polls', icon: Vote },
    { to: '/results', label: 'Results', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:hidden glass border-t border-white/20 dark:border-gray-700/20 z-40">
      <ul className="grid grid-cols-4 h-16">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.to
          
          return (
            <li key={item.to} className="flex items-center justify-center">
              <Link 
                to={item.to} 
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}


