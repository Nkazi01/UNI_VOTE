import { useEffect, useState } from 'react'

type Toast = { id: string; title: string; description?: string }

let pushFn: ((t: Omit<Toast, 'id'>) => void) | null = null

export function pushToast(t: Omit<Toast, 'id'>) {
  pushFn?.(t)
}

export function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    pushFn = (t) => setToasts((prev) => [...prev, { id: crypto.randomUUID(), ...t }])
    return () => { pushFn = null }
  }, [])
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="card p-3 min-w-[240px]">
          <div className="font-semibold">{t.title}</div>
          {t.description && <div className="text-sm text-gray-500 dark:text-gray-400">{t.description}</div>}
        </div>
      ))}
    </div>
  )
}


