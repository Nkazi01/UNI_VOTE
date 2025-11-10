// Simple localStorage-based api client mock
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export async function request<T>(key: string, method: HttpMethod, body?: unknown): Promise<T> {
  await new Promise((r) => setTimeout(r, 300))
  if (method === 'GET') {
    const raw = localStorage.getItem(key)
    return (raw ? JSON.parse(raw) : null) as T
  }
  if (method === 'POST' || method === 'PUT') {
    localStorage.setItem(key, JSON.stringify(body))
    return body as T
  }
  if (method === 'DELETE') {
    localStorage.removeItem(key)
    return null as unknown as T
  }
  throw new Error('Unsupported method')
}


