export function formatDateTime(date: Date | number | string): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

export function pluralize(word: string, count: number): string {
  return `${count} ${count === 1 ? word : word + 's'}`
}


