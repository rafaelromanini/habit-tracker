import { Plus, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  onNewHabit: () => void
}

export function Header({ onNewHabit }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between py-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor: `hsl(${260 + i * 8}, 80%, ${40 + i * 8}%)`,
              }}
            />
          ))}
        </div>
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          habits
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted hidden sm:block">
          {user?.name}
        </span>

        <button
          onClick={onNewHabit}
          className="flex items-center gap-2 rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background"
        >
          <Plus size={16} />
          New habit
        </button>

        <button
          onClick={logout}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
