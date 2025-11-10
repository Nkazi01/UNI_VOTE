import { getDeviceLabel } from '@/utils/deviceUtils'
import { formatDateTime } from '@/utils/formatters'

type Session = { id: string; device: string; lastActive: string }

export default function DeviceSessionList() {
  const sessions: Session[] = [
    { id: '1', device: getDeviceLabel(), lastActive: new Date().toISOString() },
    { id: '2', device: 'Android', lastActive: new Date(Date.now() - 86400000).toISOString() }
  ]
  return (
    <div className="space-y-2">
      {sessions.map((s) => (
        <div key={s.id} className="card p-3 flex items-center justify-between">
          <div className="font-medium">{s.device}</div>
          <div className="text-xs text-gray-500">Last active {formatDateTime(s.lastActive)}</div>
        </div>
      ))}
    </div>
  )
}


