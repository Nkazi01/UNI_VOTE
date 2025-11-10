import { Radio } from '@/components/ui/radio-group'
import { Users } from 'lucide-react'
import { fixImageUrl } from '@/utils/imageUpload'

type Props = {
  id: string
  partyName: string
  partyLogo?: string
  president: string
  presidentPhoto?: string
  deputyPresident: string
  deputyPresidentPhoto?: string
  selected: boolean
  onToggle: (id: string) => void
}

export default function PartyCard({ 
  id, 
  partyName, 
  partyLogo,
  president, 
  presidentPhoto,
  deputyPresident, 
  deputyPresidentPhoto,
  selected, 
  onToggle 
}: Props) {
  return (
    <button 
      onClick={() => onToggle(id)} 
      className={`w-full text-left card p-5 transition-all hover:shadow-lg ${
        selected 
          ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-md' 
          : 'hover:border-brand-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Radio button */}
        <Radio checked={selected} readOnly name="party-vote" className="mt-6" />
        
        <div className="flex-1 space-y-4">
          {/* Party Header with Logo */}
          <div className="flex items-center gap-3">
            {partyLogo ? (
              <img 
                src={fixImageUrl(partyLogo)} 
                alt={`${partyName} logo`} 
                className="h-12 w-12 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{partyName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Click to select this party</p>
            </div>
          </div>

          {/* Candidates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* President */}
            <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              {presidentPhoto ? (
                <img 
                  src={fixImageUrl(presidentPhoto)} 
                  alt={president} 
                  className="h-16 w-16 object-cover rounded-full border-2 border-brand-200 dark:border-brand-700"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Ccircle fill="%23e5e7eb" cx="32" cy="32" r="32"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="24"%3E👤%3C/text%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide">President</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{president}</p>
              </div>
            </div>

            {/* Deputy President */}
            <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              {deputyPresidentPhoto ? (
                <img 
                  src={fixImageUrl(deputyPresidentPhoto)} 
                  alt={deputyPresident} 
                  className="h-16 w-16 object-cover rounded-full border-2 border-brand-200 dark:border-brand-700"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Ccircle fill="%23e5e7eb" cx="32" cy="32" r="32"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="24"%3E👤%3C/text%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide">Deputy President</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{deputyPresident}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

