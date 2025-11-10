import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utils/formatters'
import { Clock, Users, ArrowRight } from 'lucide-react'

type Props = {
  id: string
  title: string
  description: string
  endsAt: string
  type?: 'single' | 'multiple' | 'party'
  optionsCount?: number
  partiesCount?: number
}

export default function VoteCard({ id, title, description, endsAt, type = 'single', optionsCount = 0, partiesCount = 0 }: Props) {
  const isActive = new Date(endsAt).getTime() > Date.now()
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {title}
          </CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {isActive ? 'Active' : 'Closed'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Ends {formatDateTime(endsAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{type === 'party' ? `${partiesCount} parties` : `${optionsCount} options`}</span>
          </div>
          <div className="px-2 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 text-xs font-medium">
            {type === 'party' ? 'Party Vote (SRC)' : type === 'single' ? 'Single Choice' : 'Multiple Choice'}
          </div>
        </div>
        
        <div className="pt-2">
          <Link to={`/polls/${id}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:border-brand-300 dark:group-hover:border-brand-600 transition-all duration-200"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


