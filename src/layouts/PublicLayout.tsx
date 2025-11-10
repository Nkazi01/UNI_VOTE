import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors closeButton />
      <main><Outlet /></main>
    </div>
  )
}


