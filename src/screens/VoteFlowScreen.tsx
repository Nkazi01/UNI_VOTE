import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPoll, submitVote, hasUserVoted } from '@/api/pollApi'
// Switch between development and production OTP
// For production with real emails, use: '@/api/otpApi.production'
// For development with console codes, use: '@/api/otpApi.v2'
import { sendVoteOTP, verifyVoteOTP } from '@/api/otpApi.production'
import { useAuth } from '@/contexts/AuthContext'
import PollOptionCard from '@/components/PollOptionCard'
import PartyCard from '@/components/PartyCard'
import ProgressStepper from '@/components/ProgressStepper'
import { Button } from '@/components/ui/button'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import TwoFactorChallenge from '@/components/TwoFactorChallenge'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

export default function VoteFlowScreen() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const { success } = useHapticFeedback()
  const [step, setStep] = useState(1)
  const [poll, setPoll] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [selection, setSelection] = useState<string[]>([])
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [verifying2FA, setVerifying2FA] = useState(false)
  const totalSteps = 4

  useEffect(() => { 
    (async () => { 
      const pollData = await getPoll(id || '')
      setPoll(pollData)
      // Check if user has already voted
      if (pollData) {
        const voted = await hasUserVoted(pollData.id)
        setAlreadyVoted(voted)
      }
      setLoading(false)
    })()
  }, [id])

  // Send OTP when user reaches step 3 (2FA verification)
  useEffect(() => {
    if (step === 3 && user && poll) {
      sendOTP()
    }
  }, [step, user, poll])

  const multiple = useMemo(() => poll?.type === 'multiple', [poll])
  const isPartyVote = useMemo(() => poll?.type === 'party', [poll])

  // Send OTP to user's email
  async function sendOTP() {
    if (!user || !poll) return
    
    try {
      await sendVoteOTP(user.email, poll.id, poll.title)
      
      // Success message
      toast.success('Verification code sent!', {
        description: 'Check your email for the 6-digit code.'
      })
    } catch (err: any) {
      console.error('[VoteFlow] Failed to send OTP:', err)
      toast.error('Failed to send verification code', {
        description: err.message || 'Please try again.'
      })
    }
  }

  // Verify OTP code
  async function verifyOTP(code: string) {
    if (!user || !poll) return
    
    setVerifying2FA(true)
    try {
      await verifyVoteOTP(user.email, code, poll.id)
      toast.success('Verified!', { description: 'Code verified successfully.' })
      setStep(4)
    } catch (err: any) {
      console.error('[VoteFlow] OTP verification failed:', err)
      throw new Error(err.message || 'Invalid code. Please try again.')
    } finally {
      setVerifying2FA(false)
    }
  }

  // Resend OTP
  async function resendOTP() {
    await sendOTP()
  }

  function toggle(id: string) {
    setSelection((prev) => {
      if (multiple) return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      return prev[0] === id ? [] : [id]
    })
  }

  async function confirm() {
    if (!poll) return
    try {
      await submitVote(poll.id, selection)
      success()
      
      // Show success message
      toast.success('Vote submitted successfully!', {
        description: 'Your vote has been recorded. Thank you for participating!',
        duration: 3000
      })
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        nav('/home', { replace: true })
      }, 2000)
    } catch (error: any) {
      console.error('[VoteFlow] Failed to submit vote:', error)
      toast.error('Failed to submit vote', {
        description: error.message || 'Please try again.'
      })
    }
  }

  if (loading) return <div className="container-app py-6">Loading…</div>
  if (!poll) return <div className="container-app py-6">Poll not found</div>
  if (!user) { nav('/login'); return null }
  
  // Show "Already Voted" message
  if (alreadyVoted) {
    return (
      <div className="container-app py-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">You've Already Voted!</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            You have already cast your vote on <span className="font-semibold">{poll.title}</span>. 
            Each user can only vote once to ensure fair results.
          </p>
        </div>
        
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Your vote has been securely recorded and cannot be changed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Your vote is completely anonymous and cannot be traced back to you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Results will be published by the admin after the poll closes</span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => nav('/polls')}>
            View All Polls
          </Button>
          <Button onClick={() => nav('/results?poll=' + poll.id)}>
            View Results
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{poll.title}</h1>
        <ProgressStepper step={step} total={totalSteps} />
      </div>
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Select your choice{multiple ? 's' : ''}</h2>
          {isPartyVote && poll.parties ? (
            <div className="space-y-3">
              {poll.parties.map((party: any) => (
                <PartyCard
                  key={party.id}
                  id={party.id}
                  partyName={party.name}
                  partyLogo={party.logo}
                  president={party.president.name}
                  presidentPhoto={party.president.photo}
                  deputyPresident={party.deputyPresident.name}
                  deputyPresidentPhoto={party.deputyPresident.photo}
                  selected={selection.includes(party.id)}
                  onToggle={toggle}
                />
              ))}
            </div>
          ) : (
            poll.options.map((o: any) => (
              <PollOptionCard key={o.id} id={o.id} label={o.label} multiple={multiple} selected={selection.includes(o.id)} onToggle={toggle} />
            ))
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => nav(-1)}>Back</Button>
            <Button onClick={() => setStep(2)} disabled={selection.length === 0}>Continue</Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Review your vote</h2>
          {isPartyVote && poll.parties ? (
            <div className="space-y-2">
              {selection.map((id) => {
                const party = poll.parties?.find((p: any) => p.id === id)
                return party ? (
                  <div key={id} className="card p-3">
                    <div className="font-semibold mb-1">{party.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>President: {party.president.name}</div>
                      <div>Deputy President: {party.deputyPresident.name}</div>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          ) : (
            <ul className="list-disc ml-6">
              {selection.map((id) => <li key={id}>{poll.options.find((o: any) => o.id === id)?.label}</li>)}
            </ul>
          )}
          <p className="text-xs text-gray-500">Your vote is anonymous. It cannot be traced back to your account.</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Confirm</Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Two-Factor Verification</h2>
          <TwoFactorChallenge 
            onVerify={verifyOTP} 
            loading={verifying2FA}
            onResend={resendOTP}
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Submit vote</h2>
          <p>Press submit to cast your vote.</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={confirm}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  )
}


