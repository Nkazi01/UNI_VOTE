export function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
      <div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}


