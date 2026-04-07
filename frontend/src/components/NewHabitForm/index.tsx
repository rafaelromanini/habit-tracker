import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useCreateHabit } from '@/hooks/useHabits'

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface NewHabitFormProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function NewHabitForm({ open, onClose, onCreated }: NewHabitFormProps) {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])
  const { createHabit, isLoading } = useCreateHabit(() => {
    setTitle('')
    setWeekDays([])
    onCreated()
    onClose()
  })

  function toggleDay(day: number) {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || weekDays.length === 0) return
    await createHabit(title.trim(), weekDays)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-8 shadow-2xl animate-dialog-enter focus:outline-none">

          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-brand">
            <X size={20} />
          </Dialog.Close>

          <Dialog.Title className="text-xl font-bold text-foreground mb-6">
            Create habit
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                What is your commitment?
              </label>
              <input
                type="text"
                placeholder="Exercise, sleep well, etc..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-background px-4 py-3 text-sm text-foreground placeholder-muted border border-border focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                maxLength={100}
                required
              />
            </div>

            {/* Week days */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                What is the recurrence?
              </label>
              <ul className="space-y-2">
                {WEEK_DAYS.map((day, index) => {
                  const selected = weekDays.includes(index)
                  return (
                    <li key={day}>
                      <button
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand ${
                          selected
                            ? 'bg-brand/20 text-brand'
                            : 'bg-surface-hover text-foreground hover:bg-border'
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
                            selected ? 'border-brand bg-brand' : 'border-border'
                          }`}
                        >
                          {selected && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {day}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !title.trim() || weekDays.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-4 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Confirm'
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
