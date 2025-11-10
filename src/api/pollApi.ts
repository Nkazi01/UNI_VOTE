import { supabase, hasSupabaseConfig } from '@/lib/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Helper to refresh token if expired
async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    console.log('[pollApi] Attempting to refresh token...')
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error || !data.session) {
      console.warn('[pollApi] Token refresh failed:', error?.message)
      return false
    }
    
    // Update localStorage with new token
    if (data.session.access_token) {
      localStorage.setItem('sb-access-token', data.session.access_token)
      console.log('[pollApi] Token refreshed successfully')
      return true
    }
    
    return false
  } catch (err) {
    console.warn('[pollApi] Token refresh error:', err)
    return false
  }
}

// Helper to get auth headers for authenticated requests
async function getAuthHeaders(retryCount = 0): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'apikey': supabaseAnonKey,
    'Content-Type': 'application/json'
  }
  
  // First, try to get token from localStorage (faster and more reliable)
  try {
    const storedSession = localStorage.getItem('sb-access-token')
    if (storedSession) {
      headers['Authorization'] = `Bearer ${storedSession}`
      console.log('[pollApi] Using stored access token')
      return headers
    }
  } catch (err) {
    console.warn('[pollApi] Could not read from localStorage:', err)
  }
  
  // Fallback: Try to get the session token from Supabase client (with timeout)
  try {
    const sessionPromise = supabase.auth.getSession()
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('getSession timed out')), 1000)
    })
    
    const result = await Promise.race([sessionPromise, timeoutPromise]) as any
    const session = result?.data?.session
    
    if (session?.access_token) {
      // Store for future use
      localStorage.setItem('sb-access-token', session.access_token)
      headers['Authorization'] = `Bearer ${session.access_token}`
      console.log('[pollApi] Using authenticated session token from Supabase')
    } else {
      headers['Authorization'] = `Bearer ${supabaseAnonKey}`
      console.log('[pollApi] No session found, using anon key')
    }
  } catch (err) {
    console.warn('[pollApi] Could not get session (timeout or error), using anon key:', (err as Error).message)
    headers['Authorization'] = `Bearer ${supabaseAnonKey}`
  }
  
  return headers
}

// Helper to handle 401 errors and retry with refreshed token
async function handleAuthenticatedRequest<T>(
  requestFn: (headers: Record<string, string>) => Promise<Response>,
  errorContext: string
): Promise<T> {
  let headers = await getAuthHeaders()
  let response = await requestFn(headers)
  
  // If we get a 401 and haven't retried yet, try to refresh the token
  if (response.status === 401) {
    console.log('[pollApi] Got 401, attempting token refresh...')
    const refreshed = await refreshTokenIfNeeded()
    
    if (refreshed) {
      // Retry the request with the new token
      console.log('[pollApi] Retrying request with refreshed token...')
      headers = await getAuthHeaders()
      response = await requestFn(headers)
    } else {
      // Token refresh failed, clear localStorage and redirect to login
      console.error('[pollApi] Token refresh failed, clearing session...')
      localStorage.removeItem('sb-access-token')
      
      // Dispatch event to notify AuthContext to log out
      window.dispatchEvent(new CustomEvent('auth-session-expired'))
      
      throw new Error('Your session has expired. Please log in again.')
    }
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    console.error(`[pollApi] ${errorContext} failed:`, response.status, errorData)
    throw new Error(errorData.message || `${errorContext} failed (${response.status})`)
  }
  
  // Check if response has content before parsing JSON
  // Some operations (DELETE, PATCH) return empty responses (204 No Content)
  const contentType = response.headers.get('content-type')
  const contentLength = response.headers.get('content-length')
  
  if (contentLength === '0' || !contentType?.includes('application/json')) {
    // Empty response or non-JSON response, return null
    return null as T
  }
  
  // Try to parse JSON, return null if empty
  try {
    return await response.json()
  } catch (err) {
    // Response has no JSON body (empty), return null
    console.log(`[pollApi] ${errorContext} completed with empty response`)
    return null as T
  }
}

export type PollOption = { id: string; label: string }
export type VotingParty = {
  id: string
  name: string
  logo?: string // Party logo URL
  president: { id: string; name: string; photo?: string }
  deputyPresident: { id: string; name: string; photo?: string }
}
export type Poll = {
  id: string
  title: string
  description: string
  type: 'single' | 'multiple' | 'party'
  options: PollOption[]
  parties?: VotingParty[]
  startsAt: string
  endsAt: string
  published?: boolean
}

export type Vote = {
  pollId: string
  optionIds: string[]
  createdAt: string
}

type PollRow = {
  id: string
  title: string
  description: string
  type: 'single' | 'multiple' | 'party'
  options: PollOption[]
  parties: VotingParty[] | null
  starts_at: string
  ends_at: string
  created_at: string
  published: boolean | null
}

// Local fallback (no Supabase)
const POLLS_KEY = 'univote_polls'
const VOTES_KEY = 'univote_votes'

function getPollsInternal(): Poll[] {
  return JSON.parse(localStorage.getItem(POLLS_KEY) || '[]')
}

function setPollsInternal(polls: Poll[]) {
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls))
}

function getVotesInternal(): Vote[] {
  return JSON.parse(localStorage.getItem(VOTES_KEY) || '[]')
}

function setVotesInternal(votes: Vote[]) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
}

function rowToPoll(row: PollRow): Poll {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    options: row.options,
    parties: row.parties || undefined,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    published: row.published ?? false
  }
}

function pollToRow(poll: Omit<Poll, 'id'> | Poll): Omit<PollRow, 'id' | 'created_at'> {
  return {
    title: poll.title,
    description: poll.description,
    type: poll.type,
    options: poll.options,
    parties: poll.parties || null,
    starts_at: poll.startsAt,
    ends_at: poll.endsAt,
    published: !!poll.published
  }
}

export async function seedDemoPolls(): Promise<Poll[]> {
  if (!hasSupabaseConfig) {
    if (getPollsInternal().length) return getPollsInternal()
    const demo: Poll[] = [
      {
        id: crypto.randomUUID(),
        title: 'Student Representative Council',
        description: 'Elect the SRC President and Deputy President',
        type: 'party',
        options: [],
        parties: [
          {
            id: crypto.randomUUID(),
            name: 'Progressive Students Alliance',
            president: { id: crypto.randomUUID(), name: 'Alex Johnson' },
            deputyPresident: { id: crypto.randomUUID(), name: 'Sarah Williams' }
          },
          {
            id: crypto.randomUUID(),
            name: 'Unity Party',
            president: { id: crypto.randomUUID(), name: 'Priya Singh' },
            deputyPresident: { id: crypto.randomUUID(), name: 'Michael Chen' }
          }
        ],
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        published: false
      },
      {
        id: crypto.randomUUID(),
        title: 'Cafeteria Menu Additions',
        description: 'Vote on new items to add to the menu',
        type: 'multiple',
        options: [
          { id: crypto.randomUUID(), label: 'Vegan Bowl' },
          { id: crypto.randomUUID(), label: 'Cold Brew Coffee' },
          { id: crypto.randomUUID(), label: 'Gluten-free Pasta' }
        ],
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        published: false
      }
    ]
    setPollsInternal(demo)
    return demo
  }

  // Check if polls already exist using handleAuthenticatedRequest
  try {
    const data = await handleAuthenticatedRequest<any[]>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls?select=id&limit=1`, { method: 'GET', headers }),
      'Seed check'
    )
    
    if (data && data.length > 0) {
      console.log('[pollApi] Polls already exist, skipping seed')
      return []
    }
  } catch (err) {
    console.warn('[pollApi] Could not check existing polls, skipping seed:', err)
    return []
  }

  console.log('[pollApi] Seed check complete')
  return []
}

export async function listPolls(): Promise<Poll[]> {
  if (!hasSupabaseConfig) {
    console.log('[pollApi] No Supabase config, using localStorage')
    return getPollsInternal()
  }
  
  try {
    console.log('[pollApi] Fetching polls from:', `${supabaseUrl}/rest/v1/polls`)
    
    const data = await handleAuthenticatedRequest<PollRow[]>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls?select=*&order=created_at.desc`, {
        method: 'GET',
        headers
      }),
      'List polls'
    )
    
    console.log('[pollApi] ✅ listPolls success, found:', data?.length ?? 0, 'polls')
    
    const polls = (data || []).map(rowToPoll)
    return polls
  } catch (err: any) {
    console.error('[pollApi] ❌ listPolls error:', err)
    throw err
  }
}

export async function getPoll(pollId: string): Promise<Poll | null> {
  if (!hasSupabaseConfig) return getPollsInternal().find((p) => p.id === pollId) || null
  
  try {
    const data = await handleAuthenticatedRequest<PollRow[]>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls?id=eq.${pollId}&select=*`, {
        method: 'GET',
        headers
      }),
      'Get poll'
    )
    
    return data && data.length > 0 ? rowToPoll(data[0]) : null
  } catch (err: any) {
    console.error('[pollApi] getPoll error:', err)
    throw err
  }
}

export async function hasUserVoted(pollId: string): Promise<boolean> {
  if (!hasSupabaseConfig) {
    const votes = getVotesInternal()
    return votes.some(v => v.pollId === pollId)
  }
  
  try {
    const data = await handleAuthenticatedRequest<any[]>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/votes?poll_id=eq.${pollId}&select=id&limit=1`, {
        method: 'GET',
        headers
      }),
      'Check if user voted'
    )
    
    return data && data.length > 0
  } catch (err) {
    console.warn('[pollApi] Could not check if user voted:', err)
    return false
  }
}

export async function submitVote(pollId: string, optionIds: string[]): Promise<Vote> {
  const vote: Vote = { pollId, optionIds, createdAt: new Date().toISOString() }
  if (!hasSupabaseConfig) {
    // Check for duplicate in localStorage
    const existing = getVotesInternal()
    const alreadyVoted = existing.some(v => v.pollId === pollId)
    if (alreadyVoted) {
      throw new Error('You have already voted on this poll')
    }
    setVotesInternal([...existing, vote])
    return vote
  }
  
  try {
    // First check if user has already voted
    const alreadyVoted = await hasUserVoted(pollId)
    if (alreadyVoted) {
      throw new Error('You have already voted on this poll. Each user can only vote once.')
    }
    
    // Submit vote with token refresh support
    let headers = await getAuthHeaders()
    let response = await fetch(`${supabaseUrl}/rest/v1/votes`, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        poll_id: pollId,
        option_ids: optionIds,
        created_at: new Date().toISOString()
      })
    })
    
    // Handle 401 with token refresh
    if (response.status === 401) {
      console.log('[pollApi] submitVote got 401, attempting token refresh...')
      const refreshed = await refreshTokenIfNeeded()
      
      if (refreshed) {
        headers = await getAuthHeaders()
        response = await fetch(`${supabaseUrl}/rest/v1/votes`, {
          method: 'POST',
          headers: {
            ...headers,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            poll_id: pollId,
            option_ids: optionIds,
            created_at: new Date().toISOString()
          })
        })
      } else {
        localStorage.removeItem('sb-access-token')
        window.dispatchEvent(new CustomEvent('auth-session-expired'))
        throw new Error('Your session has expired. Please log in again.')
      }
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      
      // Provide better error messages for common issues
      if (response.status === 403 || errorData.message?.includes('row-level security')) {
        throw new Error('Cannot submit vote: This poll may be closed or you may not have permission. Please check if the poll is still active.')
      }
      
      // Check for duplicate vote constraint violation
      if (response.status === 409 || errorData.message?.includes('unique') || errorData.message?.includes('duplicate')) {
        throw new Error('You have already voted on this poll. Each user can only vote once.')
      }
      
      throw new Error(errorData.message || 'Failed to submit vote')
    }
    
    const data = await response.json()
    const responseData = Array.isArray(data) ? data[0] : data
    return { pollId: responseData.poll_id, optionIds: responseData.option_ids, createdAt: responseData.created_at }
  } catch (err: any) {
    console.error('[pollApi] submitVote error:', err)
    throw err
  }
}

export async function getResults(pollId: string): Promise<Record<string, number>> {
  if (!hasSupabaseConfig) {
    const votes = getVotesInternal().filter((v) => v.pollId === pollId)
    const tally: Record<string, number> = {}
    for (const v of votes) for (const id of v.optionIds) tally[id] = (tally[id] || 0) + 1
    return tally
  }
  
  try {
    const data = await handleAuthenticatedRequest<any[]>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/votes?poll_id=eq.${pollId}&select=option_ids`, {
        method: 'GET',
        headers
      }),
      'Get results'
    )
    
    const tally: Record<string, number> = {}
    for (const v of data || []) for (const id of v.option_ids) tally[id] = (tally[id] || 0) + 1
    return tally
  } catch (err: any) {
    console.error('[pollApi] getResults error:', err)
    throw err
  }
}

export async function createPoll(poll: Omit<Poll, 'id'>): Promise<Poll> {
  const newPoll: Poll = { 
    ...poll, 
    id: crypto.randomUUID(), 
    published: true  // Auto-publish so voters can see it
  }
  if (!hasSupabaseConfig) {
    const polls = getPollsInternal()
    setPollsInternal([newPoll, ...polls])
    return newPoll
  }
  
  try {
    console.log('[pollApi] Creating poll:', { id: newPoll.id, title: newPoll.title, type: newPoll.type })
    
    const rowData = { id: newPoll.id, ...pollToRow(newPoll), created_at: new Date().toISOString() }
    
    const data = await handleAuthenticatedRequest<PollRow[]>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(rowData)
      }),
      'Create poll'
    )
    
    console.log('[pollApi] Poll created successfully')
    
    // The response is an array when using Prefer: return=representation
    const pollData = Array.isArray(data) ? data[0] : data
    
    if (!pollData) {
      throw new Error('Poll creation succeeded but no data returned')
    }
    
    return rowToPoll(pollData)
  } catch (err: any) {
    console.error('[pollApi] createPoll error:', err)
    
    // Provide better error messages
    if (err.message?.includes('403') || err.message?.includes('Permission denied')) {
      throw new Error('Permission denied. Your user may not have the admin role.')
    }
    if (err.message?.includes('404')) {
      throw new Error('Table not found. Database schema may not be set up.')
    }
    if (err.message?.includes('policy')) {
      throw new Error('Row Level Security is blocking this operation.')
    }
    
    throw err
  }
}

export async function setPollPublished(pollId: string, published: boolean): Promise<void> {
  if (!hasSupabaseConfig) {
    const list = getPollsInternal()
    const updated = list.map((p) => (p.id === pollId ? { ...p, published } : p))
    setPollsInternal(updated)
    return
  }
  
  try {
    await handleAuthenticatedRequest<void>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls?id=eq.${pollId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ published })
      }),
      'Update poll published status'
    )
  } catch (err: any) {
    console.error('[pollApi] setPollPublished error:', err)
    throw err
  }
}

export async function closePoll(pollId: string): Promise<void> {
  if (!hasSupabaseConfig) {
    const list = getPollsInternal()
    const updated = list.map((p) => (p.id === pollId ? { ...p, endsAt: new Date().toISOString() } : p))
    setPollsInternal(updated)
    return
  }
  
  try {
    await handleAuthenticatedRequest<void>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls?id=eq.${pollId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ ends_at: new Date().toISOString() })
      }),
      'Close poll'
    )
    
    console.log('[pollApi] Poll closed successfully')
  } catch (err: any) {
    console.error('[pollApi] closePoll error:', err)
    throw err
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  if (!hasSupabaseConfig) {
    const list = getPollsInternal().filter(p => p.id !== pollId)
    setPollsInternal(list)
    return
  }
  
  try {
    await handleAuthenticatedRequest<void>(
      (headers) => fetch(`${supabaseUrl}/rest/v1/polls?id=eq.${pollId}`, {
        method: 'DELETE',
        headers
      }),
      'Delete poll'
    )
    
    console.log('[pollApi] Poll deleted successfully')
  } catch (err: any) {
    console.error('[pollApi] deletePoll error:', err)
    throw err
  }
}


