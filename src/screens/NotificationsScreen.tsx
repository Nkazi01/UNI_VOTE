import { useNotifications } from '@/contexts/NotificationContext'
import NotificationItem from '@/components/NotificationItem'

export default function NotificationsScreen() {
  const { notifications, clear } = useNotifications()
  return (
    <div className="container-app py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && <button onClick={clear} className="text-sm text-brand-600">Clear</button>}
      </div>
      <div className="space-y-2" role="list" aria-label="Notifications list">
        {notifications.map((n) => <NotificationItem key={n.id} item={n} />)}
        {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
      </div>
    </div>
  )
}


