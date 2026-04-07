import { useMemo } from 'react'
import { HabitDay } from '@/components/HabitDay'
import type { DaySummary } from '@/types'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MIN_WEEKS = 18

interface HabitGridProps {
  summary: DaySummary[]
  isLoading: boolean
  onDayClick: (day: DaySummary) => void
}

export function HabitGrid({ summary, isLoading, onDayClick }: HabitGridProps) {
  // Prepend empty cells so the first real day lands on the correct weekday row,
  // then ensure a minimum number of weeks are shown.
  const paddedSummary = useMemo(() => {
    const firstReal = summary.find((d) => d.date)
    const dayOffset = firstReal
      ? new Date(firstReal.date + 'T12:00:00').getDay() // 0=Sun … 6=Sat
      : 0

    // Smallest k so that k*7 + dayOffset + summary.length >= MIN_WEEKS * 7
    const k = Math.ceil(Math.max(0, MIN_WEEKS * 7 - dayOffset - summary.length) / 7)
    const padCount = k * 7 + dayOffset

    const pad: DaySummary[] = Array.from({ length: padCount }, (_, i) => ({
      id: `pad-${i}`,
      date: '',
      amountHabits: 0,
      completedHabits: 0,
    }))

    return [...pad, ...summary]
  }, [summary])

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        <div className="flex flex-col gap-3 mr-2">
          {WEEK_DAYS.map((d, i) => (
            <div key={i} className="h-10 w-8 flex items-center justify-center text-xs text-muted">
              {d}
            </div>
          ))}
        </div>
        {Array.from({ length: 18 }).map((_, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-3">
            {Array.from({ length: 7 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="h-10 w-10 rounded-lg bg-surface animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Group by columns of 7 (one week per column)
  const columns: DaySummary[][] = []
  for (let i = 0; i < paddedSummary.length; i += 7) {
    columns.push(paddedSummary.slice(i, i + 7))
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {/* Week day labels */}
      <div className="flex flex-col gap-3 mr-2 shrink-0">
        {WEEK_DAYS.map((d, i) => (
          <div
            key={i}
            className="h-10 w-8 flex items-center justify-center text-xs font-medium text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day columns */}
      {columns.map((week, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-3 shrink-0">
          {week.map((day, rowIdx) =>
            day.date ? (
              <HabitDay key={day.id} day={day} onClick={onDayClick} />
            ) : (
              <div
                key={`placeholder-${colIdx}-${rowIdx}`}
                className="h-10 w-10 rounded-lg bg-surface opacity-40 cursor-not-allowed"
              />
            )
          )}
        </div>
      ))}
    </div>
  )
}
