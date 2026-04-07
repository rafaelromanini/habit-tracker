import { useMemo } from 'react'
import { HabitDay } from '@/components/HabitDay'
import type { DaySummary } from '@/types'

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MIN_SUMMARY_LENGTH = 18 * 7 // ~18 weeks

interface HabitGridProps {
  summary: DaySummary[]
  isLoading: boolean
  onDayClick: (day: DaySummary) => void
}

export function HabitGrid({ summary, isLoading, onDayClick }: HabitGridProps) {
  // Pad summary to always show a full grid
  const paddedSummary = useMemo(() => {
    if (summary.length >= MIN_SUMMARY_LENGTH) return summary
    const empty: DaySummary[] = Array.from(
      { length: MIN_SUMMARY_LENGTH - summary.length },
      (_, i) => ({
        id: `empty-${i}`,
        date: '',
        amountHabits: 0,
        completedHabits: 0,
      })
    )
    return [...empty, ...summary]
  }, [summary])

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        <div className="flex flex-col gap-3 mr-2">
          {WEEK_DAYS.map((d, i) => (
            <div key={i} className="h-10 w-4 flex items-center justify-center text-xs text-muted">
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
            className="h-10 w-4 flex items-center justify-center text-xs font-medium text-muted"
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
