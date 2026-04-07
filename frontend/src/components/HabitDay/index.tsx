import * as Tooltip from '@radix-ui/react-tooltip'
import { cn, formatDate, getCompletionColor } from '@/lib/utils'
import type { DaySummary } from '@/types'

interface HabitDayProps {
  day: DaySummary
  onClick: (day: DaySummary) => void
}

export function HabitDay({ day, onClick }: HabitDayProps) {
  const percentage =
    day.amountHabits > 0
      ? Math.round((day.completedHabits / day.amountHabits) * 100)
      : 0

  const colorClass = getCompletionColor(percentage)
  const label = `${formatDate(day.date)} — ${day.completedHabits}/${day.amountHabits} habits`

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={() => onClick(day)}
            className={cn(
              'h-10 w-10 rounded-lg border border-border transition-all duration-150',
              'hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background',
              colorClass
            )}
            aria-label={label}
          />
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-lg bg-surface px-3 py-2 text-xs text-foreground shadow-xl"
            sideOffset={6}
          >
            <p className="font-semibold">{formatDate(day.date, 'EEE, MMM d')}</p>
            <p className="text-muted">
              {day.amountHabits === 0
                ? 'No habits scheduled'
                : `${day.completedHabits} of ${day.amountHabits} completed`}
            </p>
            <Tooltip.Arrow className="fill-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
