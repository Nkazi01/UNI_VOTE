import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ 
  className, 
  label, 
  error, 
  icon,
  ...props 
}, ref) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 text-base focus-ring placeholder:text-gray-400 transition-all duration-200',
            icon ? 'pl-10' : '',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-brand-500 focus:ring-brand-500',
            className || ''
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})


