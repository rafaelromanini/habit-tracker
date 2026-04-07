import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percentage: number
  className?: string
}

export function ProgressBar({ percentage, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage))

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-surface', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
