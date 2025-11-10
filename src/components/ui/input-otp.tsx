import { useEffect, useRef } from 'react'

export function InputOTP({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const inputs = useRef<Array<HTMLInputElement | null>>([])
  useEffect(() => { inputs.current[0]?.focus() }, [])
  function onInput(i: number, v: string) {
    const next = (value.slice(0, i) + v.replace(/\D/g, '').slice(-1) + value.slice(i + 1)).slice(0, length)
    onChange(next)
    if (v && i < length - 1) inputs.current[i + 1]?.focus()
  }
  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[i] && i > 0) inputs.current[i - 1]?.focus()
  }
  return (
    <div className="flex gap-2" role="group" aria-label="One-time passcode">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          inputMode="numeric"
          aria-label={`Digit ${i + 1}`}
          value={value[i] || ''}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="w-11 h-12 text-center text-lg rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus-ring"
        />
      ))}
    </div>
  )
}


