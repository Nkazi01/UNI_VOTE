import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import * as api from '@/api/pollApi'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'

type Ctx = {
  polls: api.Poll[]
  results: Record<string, Record<string, number>>
  refresh: () => Promise<void>
}

const PollContext = createContext<Ctx | undefined>(undefined)

export function PollProvider({ children }: { children: React.ReactNode }) {
  const [polls, setPolls] = useState<api.Poll[]>([])
  const [results, setResults] = useState<Ctx['results']>({})
  const timer = useRef<number | null>(null)

  const load = useCallback(async () => {
    try {
      console.log('[PollContext] Starting to load polls...')
      
      // Seed demo polls
      try {
        await api.seedDemoPolls()
        console.log('[PollContext] Seed completed, fetching polls...')
      } catch (seedErr) {
        console.warn('[PollContext] Seed failed (might be okay):', seedErr)
      }
      
      // Fetch polls list
      const list = await api.listPolls()
      console.log('[PollContext] ✅ Polls fetched:', list.length, 'polls')
      console.log('[PollContext] Poll objects:', JSON.stringify(list, null, 2))
      
      setPolls(list)
      
      // Fetch results for each poll
      if (list.length > 0) {
        const resEntries = await Promise.all(list.map(async (p) => {
          try {
            const results = await api.getResults(p.id)
            return [p.id, results] as const
          } catch (err) {
            console.warn('[PollContext] Failed to fetch results for poll:', p.id, err)
            return [p.id, {}] as const
          }
        }))
        setResults(Object.fromEntries(resEntries))
      }
      
      console.log('[PollContext] ✅ Load complete! Total polls:', list.length)
    } catch (err) {
      console.error('[PollContext] ❌ Failed to load polls:', err)
      console.error('[PollContext] Error details:', (err as Error).message)
      // Set empty array so UI doesn't break
      setPolls([])
      setResults({})
    }
  }, [])

  async function refreshResults(pollList: api.Poll[]) {
    const resEntries = await Promise.all(pollList.map(async (p) => [p.id, await api.getResults(p.id)] as const))
    setResults(Object.fromEntries(resEntries))
  }

  // Load polls on mount and when auth token becomes available
  useEffect(() => {
    load()
    
    // Listen for custom auth token event
    const handleAuthToken = () => {
      console.log('[PollContext] Auth token set, reloading polls...')
      setTimeout(() => load(), 100) // Small delay to ensure token is fully set
    }
    
    window.addEventListener('auth-token-set', handleAuthToken)
    
    return () => {
      window.removeEventListener('auth-token-set', handleAuthToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hasSupabaseConfig) {
      const pollsChannel = supabase
        .channel('polls-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'polls' },
          async () => {
            const list = await api.listPolls()
            setPolls(list)
            await refreshResults(list)
          }
        )
        .subscribe()

      const votesChannel = supabase
        .channel('votes-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'votes' },
          async () => {
            const list = await api.listPolls()
            await refreshResults(list)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(pollsChannel)
        supabase.removeChannel(votesChannel)
      }
    } else {
      timer.current = window.setInterval(async () => {
        const list = await api.listPolls()
        setPolls(list)
        const resEntries = await Promise.all(list.map(async (p) => [p.id, await api.getResults(p.id)] as const))
        setResults(Object.fromEntries(resEntries))
      }, 3000)

      return () => {
        if (timer.current) window.clearInterval(timer.current)
      }
    }
  }, [])

  const value = useMemo<Ctx>(() => ({ polls, results, refresh: load }), [polls, results, load])
  
  return <PollContext.Provider value={value}>{children}</PollContext.Provider>
}

export function usePolls() {
  const ctx = useContext(PollContext)
  if (!ctx) throw new Error('usePolls must be used within PollProvider')
  return ctx
}


