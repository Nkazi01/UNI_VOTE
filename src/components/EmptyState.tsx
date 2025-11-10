import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'

type Props = {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, action, icon }: Props) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-6">
        {icon || <div className="text-2xl">📭</div>}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.label === 'Refresh' ? <RefreshCw className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {action.label}
        </Button>
      )}
    </div>
  )
}


