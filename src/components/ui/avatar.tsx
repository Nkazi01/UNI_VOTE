export function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-100">
      <span className="text-sm font-semibold" aria-hidden>
        {initials || '?'}
      </span>
    </div>
  )
}


