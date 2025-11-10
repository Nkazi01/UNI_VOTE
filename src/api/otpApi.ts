/**
 * OTP (One-Time Password) API for voting verification
 * Uses Supabase's built-in OTP functionality
 */

import { supabase } from '@/lib/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

// In-memory OTP storage for demo/fallback (production should use database)
const otpStore = new Map<string, { code: string; expiresAt: number; pollId: string }>()

/**
 * Generate a random 6-digit OTP code
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to user's email for vote verification
 * @param email User's email address
 * @param pollId Poll ID for context
 * @param pollTitle Poll title for email context
 * @returns Promise with success status and demo code
 */
export async function sendVoteOTP(
  email: string, 
  pollId: string, 
  pollTitle: string
): Promise<{ success: boolean; demoCode?: string }> {
  
  if (!hasSupabaseConfig) {
    // Demo mode - generate and store OTP locally
    const code = generateOTP()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
    otpStore.set(email, { code, expiresAt, pollId })
    
    console.log('[OTP Demo] Code for', email, ':', code)
    return { success: true, demoCode: code }
  }

  try {
    // Use Supabase's OTP functionality
    // Note: This requires Supabase email templates to be configured
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          poll_id: pollId,
          poll_title: pollTitle,
          verification_type: 'vote'
        }
      }
    })

    if (error) {
      console.error('[OTP] Failed to send OTP:', error)
      
      // Fallback to demo mode if Supabase OTP fails
      const code = generateOTP()
      const expiresAt = Date.now() + 5 * 60 * 1000
      otpStore.set(email, { code, expiresAt, pollId })
      
      return { success: true, demoCode: code }
    }

    console.log('[OTP] Sent successfully to', email)
    return { success: true }
    
  } catch (err: any) {
    console.error('[OTP] Error sending OTP:', err)
    
    // Fallback to demo mode
    const code = generateOTP()
    const expiresAt = Date.now() + 5 * 60 * 1000
    otpStore.set(email, { code, expiresAt, pollId })
    
    return { success: true, demoCode: code }
  }
}

/**
 * Verify OTP code for vote submission
 * @param email User's email
 * @param code 6-digit OTP code
 * @param pollId Poll ID to verify context
 * @returns Promise<boolean> - true if valid, throws error if invalid
 */
export async function verifyVoteOTP(
  email: string, 
  code: string, 
  pollId: string
): Promise<boolean> {
  
  if (!hasSupabaseConfig) {
    // Demo mode - check local storage
    const stored = otpStore.get(email)
    
    if (!stored) {
      throw new Error('No OTP found. Please request a new code.')
    }
    
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email)
      throw new Error('OTP has expired. Please request a new code.')
    }
    
    if (stored.pollId !== pollId) {
      throw new Error('OTP is for a different poll.')
    }
    
    if (stored.code !== code) {
      throw new Error('Invalid code. Please check and try again.')
    }
    
    // Valid - remove from store
    otpStore.delete(email)
    return true
  }

  try {
    console.log('[OTP] Attempting to verify code for:', email)
    console.log('[OTP] Code provided:', code)
    console.log('[OTP] Poll ID:', pollId)
    
    // For Supabase, we verify by attempting to complete the OTP sign-in
    // This is a simplified approach - production might use a custom backend
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email'
    })

    console.log('[OTP] Verification response:', { data, error })

    if (error) {
      console.error('[OTP] Verification failed:', error)
      console.error('[OTP] Error code:', error.code)
      console.error('[OTP] Error message:', error.message)
      
      // Try fallback to demo mode
      const stored = otpStore.get(email)
      console.log('[OTP] Checking fallback storage:', stored)
      
      if (stored && stored.code === code && Date.now() <= stored.expiresAt && stored.pollId === pollId) {
        console.log('[OTP] Fallback verification successful')
        otpStore.delete(email)
        return true
      }
      
      // Provide more specific error message
      if (error.message?.includes('expired')) {
        throw new Error('Code has expired. Please request a new code.')
      } else if (error.message?.includes('invalid')) {
        throw new Error('Invalid code. Please check and try again.')
      }
      
      throw new Error('Invalid or expired code. Please try again.')
    }

    console.log('[OTP] ✅ Verified successfully for', email)
    return true
    
  } catch (err: any) {
    console.error('[OTP] ❌ Error verifying OTP:', err)
    console.error('[OTP] Error details:', err.message, err.code)
    
    // Try fallback to demo mode
    const stored = otpStore.get(email)
    console.log('[OTP] Checking fallback storage after error:', stored)
    
    if (stored && stored.code === code && Date.now() <= stored.expiresAt && stored.pollId === pollId) {
      console.log('[OTP] ✅ Fallback verification successful')
      otpStore.delete(email)
      return true
    }
    
    console.error('[OTP] ❌ Fallback verification also failed')
    throw new Error(err.message || 'Failed to verify code. Please try again.')
  }
}

/**
 * Clear expired OTPs from memory (cleanup function)
 */
export function cleanupExpiredOTPs(): void {
  const now = Date.now()
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email)
    }
  }
}

// Run cleanup every minute
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredOTPs, 60000)
}

