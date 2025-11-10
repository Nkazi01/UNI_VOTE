import { createContext, useContext, useMemo, useState } from 'react'

export type NotificationItem = {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

type Ctx = {
  notifications: NotificationItem[]
  add: (n: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => void
  markRead: (id: string) => void
  clear: () => void
}

const NotificationContext = createContext<Ctx | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const add: Ctx['add'] = (n) => {
    setNotifications((prev) => [{ id: crypto.randomUUID(), title: n.title, body: n.body, read: false, createdAt: new Date().toISOString() }, ...prev])
  }
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const clear = () => setNotifications([])

  const value = useMemo(() => ({ notifications, add, markRead, clear }), [notifications])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}


