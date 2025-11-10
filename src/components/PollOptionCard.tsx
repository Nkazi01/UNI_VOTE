import { Checkbox } from '@/components/ui/checkbox'
import { Radio } from '@/components/ui/radio-group'

type Props = {
  id: string
  label: string
  selected: boolean
  multiple: boolean
  onToggle: (id: string) => void
}

export default function PollOptionCard({ id, label, selected, multiple, onToggle }: Props) {
  return (
    <button onClick={() => onToggle(id)} className={`w-full text-left card p-3 flex items-center gap-3 ${selected ? 'ring-2 ring-brand-500' : ''}`}>
      {multiple ? <Checkbox checked={selected} readOnly /> : <Radio checked={selected} readOnly />}
      <span>{label}</span>
    </button>
  )
}


