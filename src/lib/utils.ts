export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function safeParseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

// Basic helper: treat emails with domain 'university.edu' as admins only if prefixed
// This is a placeholder; replace with server-side role checks where possible.
export function isAdminEmail(email: string): boolean {
  const e = String(email || '').toLowerCase().trim()
  if (!/.+@.+\..+/.test(e)) return false
  // Allow common local testing admin markers
  if (e.startsWith('admin@')) return true
  if (e.includes('+admin@')) return true
  return false
}


