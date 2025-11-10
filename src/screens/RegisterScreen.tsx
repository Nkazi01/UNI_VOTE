import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { validateEmail, validatePassword } from '@/utils/validators'
import { toast } from 'sonner'

export default function RegisterScreen() {
  const { register, user } = useAuth() as any
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validation
    if (name.length < 2) {
      setError('Name must be at least 2 characters')
      toast.error('Name too short', { description: 'Please enter your full name (at least 2 characters)' })
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      toast.error('Invalid email', { description: 'Please enter a valid email address' })
      return
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters')
      toast.error('Password too short', { description: 'Password must be at least 6 characters long' })
      return
    }
    
    setError(null)
    setSubmitting(true)
    
    try { 
      await register(name, email, password)
      
      // Success! Account created and logged in
      toast.success('🎉 Account created successfully!', {
        description: 'Welcome to UniVote! You can now participate in polls and elections.',
        duration: 5000,
      })
      
      // Navigate to home
      setTimeout(() => nav('/home'), 1000)
      
    } catch (err: any) { 
      setSubmitting(false)
      
      // Check if this is the email confirmation error
      if (err.message?.includes('Check your email to confirm your account')) {
        toast.success('✅ Account created successfully!', {
          description: 'Your account has been created but needs to be verified before you can login.',
          duration: 12000,
        })
        
        toast.info('📧 IMPORTANT: Verify your email first!', {
          description: `We sent a confirmation link to ${email}. You MUST click the link to activate your account BEFORE you can login. Check your spam/junk folder if you don't see it.`,
          duration: 15000,
        })
        
        toast.warning('⚠️ Cannot login until verified', {
          description: 'Do not try to login until you click the confirmation link in your email. The login will fail until your account is activated.',
          duration: 12000,
        })
        
        // Redirect to login after showing the message (longer delay to read messages)
        setTimeout(() => nav('/login'), 5000)
      } else if (err.message?.includes('already registered')) {
        setError('This email is already registered. Please login instead.')
        toast.error('Email already registered', {
          description: 'An account with this email already exists. Try logging in instead.',
        })
      } else {
        setError(err.message)
        toast.error('Registration failed', {
          description: err.message || 'Please try again or contact support.',
        })
      }
    }
  }

  if (user) { nav('/home'); return null }

  return (
    <div className="container-app py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Join UniVote to participate in polls and elections</p>
      </div>
      
      <form onSubmit={onSubmit} className="card p-4 space-y-4" aria-label="Registration form">
        <label className="block">
          <span className="text-sm font-medium">Full name</span>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="John Doe"
            disabled={submitting}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">At least 2 characters</p>
        </label>
        
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            type="email"
            placeholder="you@university.edu"
            autoComplete="email" 
            disabled={submitting}
            required 
          />
        </label>
        
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <Input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="••••••••"
            autoComplete="new-password" 
            disabled={submitting}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </label>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <Button type="submit" loading={submitting} disabled={submitting} className="w-full">
          {submitting ? 'Creating account...' : 'Create account'}
        </Button>
        
        <div className="text-sm text-center">
          Already have an account? <Link to="/login" className="text-brand-600 hover:underline font-medium">Login here</Link>
        </div>
      </form>
    </div>
  )
}


