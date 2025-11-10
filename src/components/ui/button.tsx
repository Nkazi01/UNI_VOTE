import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children,
  disabled,
  ...props 
}, ref) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/80 hover:bg-white text-gray-900 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-400',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
  }
  
  const sizes = { 
    sm: 'h-9 px-3 text-sm', 
    md: 'h-11 px-6 text-base', 
    lg: 'h-12 px-8 text-lg',
    icon: 'h-11 w-11 p-0'
  }
  
  return (
    <button 
      ref={ref} 
      className={cn(base, variants[variant], sizes[size], className || '')} 
      disabled={disabled || loading}
      {...props} 
    >
      {loading && <div className="spinner mr-2" />}
      {children}
    </button>
  )
})


