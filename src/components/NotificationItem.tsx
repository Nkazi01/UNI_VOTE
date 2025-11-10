import { formatDateTime } from '@/utils/formatters'
import { NotificationItem as N } from '@/contexts/NotificationContext'

export default function NotificationItem({ item }: { item: N }) {
  return (
    <div className={`card p-3 ${item.read ? 'opacity-70' : ''}`} role="listitem">
      <div className="flex items-center justify-between">
        <div className="font-medium">{item.title}</div>
        <div className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.body}</p>
    </div>
  )
}


