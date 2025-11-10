import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '@/api/authApi'
import { supabase } from '@/lib/supabase'

type AuthState = {
  user: api.User | null
  loading: boolean
  initializing: boolean
  login: (email: string, password: string) => Promise<api.User>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<string>
  resetPassword: (token: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<api.User | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Add timeout to prevent hanging indefinitely
    const timeout = setTimeout(() => setInitializing(false), 3000)
    api.getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => setUser(null)) // If auth check fails, treat as logged out
      .finally(() => {
        clearTimeout(timeout)
        setInitializing(false)
      })
    
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event)
      
      // Update localStorage token whenever session changes
      if (session?.access_token) {
        try {
          localStorage.setItem('sb-access-token', session.access_token)
          console.log('[AuthContext] Updated stored access token')
          // Dispatch event to notify other parts of the app
          window.dispatchEvent(new CustomEvent('auth-token-refreshed'))
        } catch (err) {
          console.warn('[AuthContext] Could not store token:', err)
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear token on sign out
        try {
          localStorage.removeItem('sb-access-token')
          console.log('[AuthContext] Cleared stored access token')
        } catch (err) {
          console.warn('[AuthContext] Could not clear token:', err)
        }
      }
      
      const u = await api.getCurrentUser()
      setUser(u)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('[AuthContext] Starting login...')
      const res = await api.login(email, password)
      console.log('[AuthContext] Login API response:', res)
      if (res.user) {
        console.log('[AuthContext] Setting user:', res.user.email)
        setUser(res.user)
        return res.user
      } else {
        console.warn('[AuthContext] Login response has no user')
        throw new Error('Login failed: No user returned')
      }
      console.log('[AuthContext] Login completed successfully')
    } catch (err) {
      console.error('[AuthContext] Login error:', err)
      // Propagate so UI can show error
      throw err
    } finally {
      setLoading(false)
      console.log('[AuthContext] Login finally block - loading set to false')
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const u = await api.register(name, email, password)
      setUser(u)
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch (e) {
      console.warn('[AuthContext] logout error ignored to ensure UI clears:', e)
    } finally {
      setUser(null)
    }
  }, [])

  // Listen for session expiration events from API calls
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('[AuthContext] Session expired, logging out...')
      setUser(null)
      // The router will redirect to login automatically when user becomes null
    }
    
    window.addEventListener('auth-session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth-session-expired', handleSessionExpired)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      initializing,
      login,
      register,
      logout,
      requestPasswordReset: async (email: string) => {
        const { token } = await api.requestPasswordReset(email)
        return token
      },
      resetPassword: api.resetPassword
    }),
    [user, loading, initializing, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // In rare dev/hot-reload cases, context can be temporarily undefined
    // Return a safe fallback instead of crashing the app during development.
    // This typically happens during React's strict mode double-mounting in dev.
    const isDev = import.meta.env.DEV
    if (isDev) {
      console.warn('[AuthContext] useAuth called outside provider; returning safe fallback (dev mode)')
      return {
        user: null,
        loading: false,
        initializing: false,
        login: async () => { throw new Error('Auth unavailable') },
        register: async () => { throw new Error('Auth unavailable') },
        logout: async () => {},
        requestPasswordReset: async () => '',
        resetPassword: async () => {}
      } as AuthState
    } else {
      // In production, throw an error since this should never happen
      throw new Error('useAuth must be used within AuthProvider')
    }
  }
  return ctx
}


