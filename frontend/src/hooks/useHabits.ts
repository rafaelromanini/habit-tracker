import { useCallback, useEffect, useState } from 'react'
import { habitService } from '@/services/api'
import type { DayHabits, DaySummary } from '@/types'
import toast from 'react-hot-toast'

// ---- useSummary ----

export function useSummary() {
  const [summary, setSummary] = useState<DaySummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await habitService.getSummary()

      // Build a full calendar from Jan 1 to today so every day is clickable,
      // even before any habit is completed.
      const today = new Date()
      const startOfYear = new Date(today.getFullYear(), 0, 1)
      const summaryMap = new Map(data.map((d) => [d.date, d]))
      const allDays: DaySummary[] = []

      for (let d = new Date(startOfYear); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        allDays.push(
          summaryMap.get(dateStr) ?? {
            id: dateStr,
            date: dateStr,
            amountHabits: 0,
            completedHabits: 0,
          }
        )
      }

      setSummary(allDays)
    } catch {
      toast.error('Failed to load habit summary')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { summary, isLoading, refetch: fetchSummary }
}

// ---- useDayHabits ----

export function useDayHabits(date: string | null) {
  const [dayHabits, setDayHabits] = useState<DayHabits | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchDayHabits = useCallback(async (d: string) => {
    try {
      setIsLoading(true)
      const data = await habitService.getDayHabits(d)
      setDayHabits(data)
    } catch {
      toast.error('Failed to load habits for this day')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (date) fetchDayHabits(date)
    else setDayHabits(null)
  }, [date, fetchDayHabits])

  const toggleHabit = useCallback(
    async (habitId: string) => {
      if (!dayHabits) return

      // Optimistic update
      const wasCompleted = dayHabits.completedHabitIds.includes(habitId)
      setDayHabits((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          completedHabitIds: wasCompleted
            ? prev.completedHabitIds.filter((id) => id !== habitId)
            : [...prev.completedHabitIds, habitId],
        }
      })

      try {
        await habitService.toggle(habitId)
      } catch {
        // Rollback on error
        setDayHabits((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            completedHabitIds: wasCompleted
              ? [...prev.completedHabitIds, habitId]
              : prev.completedHabitIds.filter((id) => id !== habitId),
          }
        })
        toast.error('Failed to update habit')
      }
    },
    [dayHabits]
  )

  return { dayHabits, isLoading, toggleHabit }
}

// ---- useCreateHabit ----

export function useCreateHabit(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)

  const createHabit = useCallback(
    async (title: string, weekDays: number[]) => {
      try {
        setIsLoading(true)
        await habitService.create({ title, weekDays })
        toast.success('Habit created!')
        onSuccess?.()
      } catch {
        toast.error('Failed to create habit')
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess]
  )

  return { createHabit, isLoading }
}
