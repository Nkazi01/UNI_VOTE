import { supabase, hasSupabaseConfig, type InviteRow } from '@/lib/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string

export type Role = 'admin' | 'driver' | 'student'

export type User = {
  id: string
  name: string
  email: string
  twoFactorEnabled: boolean
  role: Role
}

// Supabase-backed implementation; local keys removed

// Helpers to map Supabase user to our shape
function mapUser(u: any): User {
  return {
    id: u.id,
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
    email: u.email,
    twoFactorEnabled: false,
    role: (u.user_metadata?.role as Role) || 'student'
  }
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, role: 'student' } } })
  if (error) throw error
  // Only treat as logged-in if a session exists (email confirmation disabled)
  if (!data.session || !data.user) {
    throw new Error('Check your email to confirm your account before signing in.')
  }
  return mapUser(data.user)
}

export async function login(email: string, password: string): Promise<{ requires2FA: boolean; user?: User; demoCode?: string }> {
  // Fallback for local/dev when Supabase env vars are missing
  if (!hasSupabaseConfig) {
    return {
      requires2FA: false,
      user: {
        id: crypto.randomUUID(),
        name: email.split('@')[0] || 'User',
        email,
        twoFactorEnabled: false,
        role: 'student'
      }
    }
  }

  try {
    console.log('[UniVote] Attempting login...')
    console.log('[UniVote] Supabase URL configured:', !!supabaseUrl)
    const startTime = Date.now()
    
    // Try direct fetch approach as fallback if SDK hangs
    console.log('[UniVote] Attempting direct fetch login...')
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
    const loginUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`
    
    const fetchResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ email, password })
    })
    
    const duration = Date.now() - startTime
    console.log(`[UniVote] Fetch request completed in ${duration}ms, status: ${fetchResponse.status}`)
    
    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json()
      console.error('[UniVote] Login fetch error:', errorData)
      throw new Error(errorData.error_description || errorData.message || 'Login failed')
    }
    
    const authData = await fetchResponse.json()
    console.log('[UniVote] Login fetch success, setting session...')
    
    // Manually set the session in Supabase (with timeout fallback)
    if (authData.access_token && authData.user) {
      // Store access token for API calls (since setSession might timeout)
      try {
        localStorage.setItem('sb-access-token', authData.access_token)
        console.log('[UniVote] Access token stored in localStorage')
        
        // Dispatch custom event to trigger poll reload
        window.dispatchEvent(new CustomEvent('auth-token-set'))
      } catch (err) {
        console.warn('[UniVote] Could not store token in localStorage:', err)
      }
      
      try {
        const setSessionPromise = supabase.auth.setSession({
          access_token: authData.access_token,
          refresh_token: authData.refresh_token
        })

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('setSession timed out')), 3000)
        })

        const { error: sessionError } = await Promise.race([setSessionPromise, timeoutPromise]) as any

        if (sessionError) {
          console.warn('[UniVote] setSession returned error; proceeding with mapped user:', sessionError)
        } else {
          console.log('[UniVote] Session set successfully')
        }
      } catch (e) {
        console.warn('[UniVote] setSession failed or timed out; proceeding with mapped user:', (e as Error).message)
      }

      // Return user regardless so UI can navigate immediately; auth state listener will reconcile
      return { requires2FA: false, user: mapUser(authData.user) }
    }
    
    throw new Error('Login response missing required data')
    
  } catch (fetchErr: any) {
    // Fallback to SDK approach if fetch fails
    console.warn('[UniVote] Direct fetch failed, trying SDK approach:', fetchErr.message)
    
    try {
      // Original SDK approach as fallback
      const loginResponse = supabase.auth.signInWithPassword({ 
        email, 
        password, 
        options: { 
          redirectTo: undefined,
          shouldCreateUser: false
        } 
      })
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Login request timed out. Please check your internet connection and try again.'))
        }, 25000)
      })
      
      console.log('[UniVote] Waiting for Supabase SDK response...')
      const result = await Promise.race([loginResponse, timeoutPromise])
      console.log('[UniVote] Supabase SDK response received')
      
      const duration = Date.now() - startTime
      console.log(`[UniVote] Login request completed in ${duration}ms`)
      
      const { data, error } = result
      
      if (error) {
        console.error('[UniVote] Login error:', error)
        // Provide more specific error messages
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }
        if (error.message?.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before logging in. Check your inbox for a confirmation link.')
        }
        throw error
      }
      
      if (!data.user) {
        console.error('[UniVote] Login succeeded but no user data returned')
        throw new Error('Login failed: No user data returned')
      }
      
      console.log('[UniVote] Login successful for user:', data.user.email)
      return { requires2FA: false, user: mapUser(data.user) }
    } catch (sdkErr: any) {
      console.error('[UniVote] SDK login also failed:', sdkErr)
      // Throw the original fetch error which is more informative
      throw fetchErr
    }
  }
}

export async function verifyOTP(code: string): Promise<User> {
  // If enabling 2FA later, implement here. For now, just return current user.
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('No session')
  return mapUser(data.user)
}

export async function resendOTP(): Promise<string> {
  return ''
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  return data.user ? mapUser(data.user) : null
}

export async function logout(): Promise<void> {
  // Clear stored token
  try {
    localStorage.removeItem('sb-access-token')
  } catch (err) {
    console.warn('[UniVote] Could not clear token from localStorage:', err)
  }
  
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('[UniVote] signOut failed:', err)
  }
}

// Password reset (demo): generate token and verify to set new password
export async function requestPasswordReset(email: string): Promise<{ token: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset-password` })
  if (error) throw error
  return { token: '' }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // Supabase completes reset via emailed link; this function is a no-op placeholder.
  // If handling inside app after redirect, use supabase.auth.updateUser({ password }) once session exists.
  await supabase.auth.updateUser({ password: newPassword })
}

// Invitations via Supabase table 'invites'
export async function createInvitation(email: string): Promise<{ token: string; email: string; used: boolean }> {
  const token = crypto.randomUUID()
  const { error } = await supabase.from('invites').insert({ email, token, used: false })
  if (error) throw error
  return { token, email, used: false }
}

export async function getInvite(token: string): Promise<InviteRow | null> {
  const { data, error } = await supabase.from('invites').select('*').eq('token', token).maybeSingle<InviteRow>()
  if (error) throw error
  return data
}

export async function registerWithInvitation(token: string, name: string, password: string): Promise<User> {
  const invite = await getInvite(token)
  if (!invite || invite.used) throw new Error('Invalid or used invitation')
  const { data, error } = await supabase.auth.signUp({ email: invite.email, password, options: { data: { name } } })
  if (error) throw error
  const { error: upErr } = await supabase.from('invites').update({ used: true }).eq('token', token)
  if (upErr) throw upErr
  return mapUser(data.user)
}

