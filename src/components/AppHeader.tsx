import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Sun, Moon, User, LogOut, Bell, Menu, X } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function AppHeader() {
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  
  const baseHref = useMemo(() => (user ? '/home' : '/'), [user])
  const navItems = useMemo(() => [
    { to: '/home', label: 'Home' },
    { to: '/polls', label: 'Polls' },
    { to: '/results', label: 'Results' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/profile', label: 'Profile' }
  ], [])
  
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/30 dark:border-gray-700/30">
      <div className="container-app h-16 flex items-center justify-between">
        <Link to={baseHref} className="flex items-center gap-3 font-bold text-xl group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-200">
            U
          </div>
          <span className="gradient-text">UniVote</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 h-16 flex items-center border-b-2 transition-colors text-sm font-medium ${
                  active
                    ? 'border-brand-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Toggle theme" 
            onClick={toggle}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/notifications" className="relative inline-flex">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 dark:text-gray-300">
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button className="gap-2">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/30 dark:border-gray-700/30">
          <div className="container-app py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`py-3 border-b last:border-b-0 text-sm ${location.pathname === item.to ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}


