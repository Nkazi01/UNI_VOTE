import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { Role } from '@/api/authApi'

export default function RequireRole({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth() as any
  if (loading) return <div className="container-app py-6">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/home" replace />
  return <Outlet />
}


