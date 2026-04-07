import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { formatFullDate } from '@/lib/utils'
import { ProgressBar } from '@/components/ProgressBar'
import { useDayHabits } from '@/hooks/useHabits'
import type { DaySummary } from '@/types'

interface DayPopupProps {
  day: DaySummary | null
  onClose: () => void
}

export function DayPopup({ day, onClose }: DayPopupProps) {
  const { dayHabits, isLoading, toggleHabit } = useDayHabits(day?.date ?? null)

  const percentage =
    dayHabits && dayHabits.possibleHabits.length > 0
      ? Math.round((dayHabits.completedHabitIds.length / dayHabits.possibleHabits.length) * 100)
      : 0

  return (
    <Dialog.Root open={!!day} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-8 shadow-2xl animate-dialog-enter focus:outline-none">

          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-brand">
            <X size={20} />
          </Dialog.Close>

          {/* Header */}
          {day && (
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-widest text-muted">
                {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long' })}
              </p>
              <p className="text-5xl font-extrabold text-foreground mt-1">
                {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { day: '2-digit', month: '2-digit' })}
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span>Daily progress</span>
              <span className="font-semibold text-brand">{percentage}%</span>
            </div>
            <ProgressBar percentage={percentage} />
          </div>

          {/* Habits list */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-surface-hover animate-pulse" />
              ))}
            </div>
          ) : dayHabits?.possibleHabits.length === 0 ? (
            <p className="text-center text-muted py-6">No habits scheduled for this day.</p>
          ) : (
            <ul className="space-y-3">
              {dayHabits?.possibleHabits.map((habit) => {
                const completed = dayHabits.completedHabitIds.includes(habit.id)
                return (
                  <li key={habit.id}>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className="flex w-full items-center gap-4 rounded-lg p-3 transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                          completed
                            ? 'border-success bg-success/20'
                            : 'border-border bg-transparent'
                        }`}
                      >
                        {completed && (
                          <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${completed ? 'line-through text-muted' : 'text-foreground'}`}>
                        {habit.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
