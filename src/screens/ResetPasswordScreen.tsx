import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { resetPassword } from '@/api/authApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function ResetPasswordScreen() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const nav = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await resetPassword(token, password)
      toast.success('Password updated')
      nav('/login')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Reset password</h1>
        {!token && (
          <p className="text-sm text-red-600">Invalid or missing token. Request a new reset link.</p>
        )}
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} required />
        <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} icon={<Lock className="w-4 h-4" />} required />
        <Button type="submit" loading={loading} className="w-full">Update password</Button>
        <div className="text-center text-sm"><Link to="/login" className="text-brand-600">Back to login</Link></div>
      </form>
    </div>
  )
}


