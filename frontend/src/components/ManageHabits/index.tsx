import * as Dialog from '@radix-ui/react-dialog'
import { Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { habitService } from '@/services/api'
import type { Habit } from '@/types'
import toast from 'react-hot-toast'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface ManageHabitsProps {
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

export function ManageHabits({ open, onClose, onDeleted }: ManageHabitsProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await habitService.list()
      setHabits(data)
    } catch {
      toast.error('Failed to load habits')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchHabits()
  }, [open, fetchHabits])

  async function handleDelete(habitId: string) {
    try {
      setDeletingId(habitId)
      await habitService.delete(habitId)
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
      setConfirmId(null)
      toast.success('Habit deleted')
      onDeleted()
    } catch {
      toast.error('Failed to delete habit')
    } finally {
      setDeletingId(null)
    }
  }

  function handleClose() {
    setConfirmId(null)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-8 shadow-2xl animate-dialog-enter focus:outline-none">

          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-brand">
            <X size={20} />
          </Dialog.Close>

          <Dialog.Title className="text-xl font-bold text-foreground mb-6">
            Manage habits
          </Dialog.Title>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-surface-hover animate-pulse" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <p className="text-center text-muted py-8">No habits created yet.</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {habits.map((habit) => (
                <li
                  key={habit.id}
                  className="rounded-lg bg-surface-hover p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {habit.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {habit.weekDays.map((d) => DAY_LABELS[d]).join(' · ')}
                      </p>
                    </div>

                    {confirmId === habit.id ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted">Delete?</span>
                        <button
                          onClick={() => handleDelete(habit.id)}
                          disabled={deletingId === habit.id}
                          className="rounded px-2 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === habit.id ? '…' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded px-2 py-1 text-xs font-semibold text-muted hover:text-foreground transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(habit.id)}
                        className="shrink-0 rounded-lg p-2 text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Delete ${habit.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
