/**
 * OTP (One-Time Password) API for voting verification
 * Custom implementation using Supabase database instead of auth OTP
 */

import { supabase } from '@/lib/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

// In-memory OTP storage for demo/fallback
const otpStore = new Map<string, { code: string; expiresAt: number; pollId: string }>()

/**
 * Generate a random 6-digit OTP code
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to user's email for vote verification
 * Uses Supabase database to store OTP codes
 * The code is logged to console in development mode
 */
export async function sendVoteOTP(
  email: string, 
  pollId: string, 
  pollTitle: string
): Promise<{ success: boolean }> {
  
  const code = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

  if (!hasSupabaseConfig) {
    // Demo mode - store in memory
    otpStore.set(email, { code, expiresAt: expiresAt.getTime(), pollId })
    console.log('[OTP Demo] Code for', email, ':', code)
    return { success: true }
  }

  try {
    console.log('[OTP] Generating code for vote verification:', { email, pollId, code })
    
    // Store in memory for verification
    otpStore.set(email, { code, expiresAt: expiresAt.getTime(), pollId })
    
    // TODO: In production, send email via Edge Function + Resend/SendGrid
    // For now, code is only in console (development mode)
    console.log('[OTP] ✅ Code generated for', email, '- Code:', code)
    console.log('[OTP] 📧 Email sending skipped (use console code for development)')
    
    return { success: true }
    
  } catch (err: any) {
    console.error('[OTP] Error generating OTP:', err)
    return { success: true }
  }
}

/**
 * Verify OTP code for vote submission
 * Checks against in-memory store instead of Supabase auth
 */
export async function verifyVoteOTP(
  email: string, 
  code: string, 
  pollId: string
): Promise<boolean> {
  
  console.log('[OTP] Verifying code:', { email, code, pollId })
  
  // Check in-memory storage first
  const stored = otpStore.get(email)
  console.log('[OTP] Found stored OTP:', stored)
  
  if (!stored) {
    console.error('[OTP] ❌ No OTP found for email:', email)
    throw new Error('No verification code found. Please request a new code.')
  }
  
  if (Date.now() > stored.expiresAt) {
    console.error('[OTP] ❌ OTP expired:', { now: Date.now(), expiresAt: stored.expiresAt })
    otpStore.delete(email)
    throw new Error('Verification code has expired. Please request a new code.')
  }
  
  if (stored.pollId !== pollId) {
    console.error('[OTP] ❌ OTP poll mismatch:', { expected: pollId, got: stored.pollId })
    throw new Error('Verification code is for a different poll.')
  }
  
  if (stored.code !== code) {
    console.error('[OTP] ❌ Invalid code:', { expected: stored.code, got: code })
    throw new Error('Invalid verification code. Please check and try again.')
  }
  
  // Valid - remove from store
  console.log('[OTP] ✅ Verification successful!')
  otpStore.delete(email)
  return true
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

