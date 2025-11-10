import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div role="status" aria-live="polite" className="w-full bg-yellow-100 text-yellow-900 text-sm py-1 text-center">
      You are offline. Actions will be queued and synced when back online.
    </div>
  )
}


