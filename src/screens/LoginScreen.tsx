import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { validateEmail, validatePassword } from '@/utils/validators'
import { Mail, Lock, ArrowLeft, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginScreen() {
  const { login, loading, initializing, user } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('student@university.edu')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateEmail(email) || !validatePassword(password)) {
      setError('Enter a valid email and password')
      return
    }
    setError(null)
    try {
      setSubmitting(true)
      console.log('[LoginScreen] Calling login function...')
      const u = await login(email, password)
      console.log('[LoginScreen] Login function completed, navigating...')
      // Role-based redirect: admins go to admin dashboard, students go to home
      const redirectTo = u.role === 'admin' ? '/admin' : '/home'
      console.log('[LoginScreen] Redirecting to:', redirectTo, 'for role:', u.role)
      nav(redirectTo, { replace: true })
    } catch (err: any) {
      console.error('[LoginScreen] Login error caught:', err)
      
      // Check if it's an email verification error
      if (err.message?.toLowerCase().includes('email') && 
          (err.message?.toLowerCase().includes('confirm') || 
           err.message?.toLowerCase().includes('verify') ||
           err.message?.toLowerCase().includes('not confirmed'))) {
        setError('Email not verified. Please check your email and click the confirmation link first.')
        toast.error('❌ Email not verified', {
          description: 'You must verify your email before logging in. Check your inbox (and spam folder) for the confirmation link we sent you.',
          duration: 10000,
        })
      } else if (err.message?.toLowerCase().includes('invalid') && err.message?.toLowerCase().includes('credentials')) {
        setError('Invalid email or password')
        toast.error('Login failed', {
          description: 'The email or password you entered is incorrect. Please try again.',
        })
      } else {
        setError(err.message)
        toast.error('Login failed', {
          description: err.message || 'Please try again or contact support.',
        })
      }
    } finally {
      console.log('[LoginScreen] Setting submitting to false')
      setSubmitting(false)
    }
  }

  if (user) {
    // Role-based redirect: admins go to admin dashboard, students go to home
    const redirectTo = user.role === 'admin' ? '/admin' : '/home'
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sign in to your UniVote account
            </p>
          </div>
        </div>

        {/* Email Verification Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📧</div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Just registered? Verify your email first!
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                If you just created an account, you must click the confirmation link in your email before you can login. Check your inbox (and spam folder) for the verification email.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8 space-y-6">
          <form onSubmit={onSubmit} className="space-y-6" aria-label="Login form">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="student@university.edu"
                />
                
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button type="submit" loading={submitting || initializing} className="w-full" size="lg" disabled={submitting}>
                Sign In
              </Button>
            </form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account? <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">Create one here</Link>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="text-brand-600 hover:text-brand-700 font-medium">Forgot password?</Link>
            </div>
            
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Your data is protected with enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  )
}


