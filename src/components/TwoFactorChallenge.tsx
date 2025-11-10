import { useEffect, useMemo, useRef, useState } from 'react'
import { InputOTP } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { validateOTP } from '@/utils/validators'
import { toast } from 'sonner'

export default function TwoFactorChallenge({ onVerify, loading, onResend }: { onVerify: (code: string) => Promise<void>; loading?: boolean; onResend?: () => Promise<void> }) {
  const [otp, setOtp] = useState(''.padEnd(6, ' '))
  const [error, setError] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number>(Date.now() + 5 * 60 * 1000)
  const [cooldownUntil, setCooldownUntil] = useState<number>(0)
  const [shake, setShake] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const cooldown = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
  const progress = useMemo(() => ((5 * 60 - remaining) / (5 * 60)) * 100, [remaining])

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      // trigger re-render
      setExpiresAt((v) => v)
    }, 500)
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current) }
  }, [])

  async function submit() {
    const clean = otp.replace(/\s/g, '')
    if (!validateOTP(clean)) {
      setError('Enter a valid 6-digit code')
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }
    setError(null)
    try {
      await onVerify(clean)
    } catch (e: any) {
      setError(e.message || 'Invalid code')
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
  }

  async function resend() {
    if (cooldown > 0) return
    setCooldownUntil(Date.now() + 30 * 1000)
    if (onResend) await onResend()
    setExpiresAt(Date.now() + 5 * 60 * 1000)
    toast.success('New code sent', { description: 'For demo, we also show it in a toast.' })
  }

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-xl font-semibold">Two-Factor Authentication</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">Enter the 6-digit code we sent to your email. For demo, check the toast.</p>

      <div className={`space-y-3 ${shake ? 'animate-[shake_0.3s]' : ''}`}>
        <InputOTP value={otp} onChange={setOtp} />
        <style>
          {`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`}
        </style>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-300">Expires in {mm}:{ss}</div>
        <button onClick={resend} disabled={cooldown > 0} className={`text-sm ${cooldown>0? 'text-gray-400 cursor-not-allowed':'text-brand-600 hover:underline'}`}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-2 bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <Button onClick={submit} disabled={loading} className="w-full">Verify</Button>
      </div>
      <p className="text-xs text-gray-500">Your vote and identity are kept separate to ensure anonymous voting.</p>
    </div>
  )
}


