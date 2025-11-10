import { clsx } from 'clsx'

export function cn(...inputs: Array<string | number | null | undefined | Record<string, boolean>>): string {
  return clsx(inputs)
}


