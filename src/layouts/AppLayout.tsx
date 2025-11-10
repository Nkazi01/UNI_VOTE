import { Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import OfflineBanner from '@/components/OfflineBanner'

export default function AppLayout() {
  const { user } = useAuth() as any
  return (
    <div className="min-h-full pb-16 sm:pb-0">
      <Toaster position="top-right" richColors closeButton />
      <OfflineBanner />
      <AppHeader />
      <Outlet />
      <footer className="container-app py-10 text-center text-sm text-gray-500">
        <div>
          Built with ❤️ for universities.
          {user?.role === 'admin' && <a href="/admin" className="text-brand-600 ml-1">Admin</a>}
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}


