import { useAuth } from '@/contexts/AuthContext'
import DeviceSessionList from '@/components/DeviceSessionList'

export default function ProfileScreen() {
  const { user } = useAuth()
  return (
    <div className="container-app py-6 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      {!user ? (
        <p>Please log in.</p>
      ) : (
        <div className="space-y-3">
          <div className="card p-4">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Active devices</h2>
            <DeviceSessionList />
          </div>
        </div>
      )}
    </div>
  )
}


