export default function ProgressStepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-2 rounded-full ${i < step ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ width: i === step - 1 ? 32 : 20 }} />
      ))}
    </div>
  )
}


