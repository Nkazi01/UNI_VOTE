import { useState } from 'react'
import { requestPasswordReset } from '@/api/authApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await requestPasswordReset(email)
      toast.success('If the email exists, a reset link was sent')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Enter your account email to receive a reset token.</p>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />
        <Button type="submit" loading={loading} className="w-full">Send reset token</Button>
      </form>
    </div>
  )
}


