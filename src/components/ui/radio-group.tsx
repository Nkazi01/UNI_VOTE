import { InputHTMLAttributes } from 'react'

export function Radio(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="radio" className="w-5 h-5 text-brand-600" {...props} />
}


