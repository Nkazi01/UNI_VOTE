import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute() {
  const { user, initializing, loading } = useAuth() as any
  const location = useLocation()

  // Wait for both initial auth check and any in-flight login/logout
  if (initializing || loading) return <div className="container-app py-6">Loading…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}


