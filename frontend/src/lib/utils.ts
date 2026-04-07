import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

// ---- Tailwind class merger ----

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---- Date helpers ----

export function formatDate(date: string | Date, pattern = 'dd/MM') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern)
}

export function formatFullDate(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "EEEE, MMMM d")
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ---- Completion color ----

/**
 * Returns a Tailwind background color based on completion percentage.
 * Matches the design from the Figma (dark → light purple).
 */
export function getCompletionColor(percentage: number): string {
  if (percentage === 0) return 'bg-surface'
  if (percentage < 20) return 'bg-violet-900'
  if (percentage < 40) return 'bg-violet-800'
  if (percentage < 60) return 'bg-violet-700'
  if (percentage < 80) return 'bg-violet-600'
  return 'bg-violet-500'
}

// ---- API error parser ----

export function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = error.response.data as { message?: string }
    return data.message ?? 'An error occurred'
  }
  return 'An error occurred'
}
