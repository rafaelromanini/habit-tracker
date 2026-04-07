import { useState } from 'react'
import { Header } from '@/components/Header'
import { HabitGrid } from '@/components/HabitGrid'
import { DayPopup } from '@/components/DayPopup'
import { NewHabitForm } from '@/components/NewHabitForm'
import { useSummary } from '@/hooks/useHabits'
import type { DaySummary } from '@/types'

export function Dashboard() {
  const { summary, isLoading, refetch } = useSummary()
  const [selectedDay, setSelectedDay] = useState<DaySummary | null>(null)
  const [newHabitOpen, setNewHabitOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <Header onNewHabit={() => setNewHabitOpen(true)} />

        <main className="mt-6 animate-fade-in">
          <HabitGrid
            summary={summary}
            isLoading={isLoading}
            onDayClick={setSelectedDay}
          />
        </main>
      </div>

      <DayPopup
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
      />

      <NewHabitForm
        open={newHabitOpen}
        onClose={() => setNewHabitOpen(false)}
        onCreated={refetch}
      />
    </div>
  )
}
