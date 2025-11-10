import { InputHTMLAttributes } from 'react'

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-brand-600" {...props} />
}


