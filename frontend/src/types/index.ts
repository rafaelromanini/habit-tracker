// ---- Auth ----

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  user: User
}

// ---- Habits ----

export interface Habit {
  id: string
  title: string
  weekDays: number[]
  createdAt: string
}

export interface DaySummary {
  id: string
  date: string
  amountHabits: number
  completedHabits: number
}

export interface DayHabits {
  date: string
  possibleHabits: Habit[]
  completedHabitIds: string[]
}

// ---- Requests ----

export interface CreateHabitRequest {
  title: string
  weekDays: number[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  name?: string
  password?: string
}

// ---- API Error ----

export interface ApiError {
  status: number
  error: string
  message: string
  path: string
  timestamp: string
  fieldErrors?: Record<string, string>
}
