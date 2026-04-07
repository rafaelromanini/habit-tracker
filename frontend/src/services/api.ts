import axios, { AxiosError } from 'axios'
import type {
  AuthResponse,
  CreateHabitRequest,
  DayHabits,
  DaySummary,
  Habit,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from '@/types'

// ---- Axios instance ----

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@habittracker:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@habittracker:token')
      localStorage.removeItem('@habittracker:user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---- Auth ----

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },
}

// ---- Habits ----

export const habitService = {
  create: async (data: CreateHabitRequest): Promise<Habit> => {
    const response = await api.post<Habit>('/habits', data)
    return response.data
  },

  getSummary: async (): Promise<DaySummary[]> => {
    const response = await api.get<DaySummary[]>('/habits/summary')
    return response.data
  },

  getDayHabits: async (date: string): Promise<DayHabits> => {
    const response = await api.get<DayHabits>('/habits/day', { params: { date } })
    return response.data
  },

  toggle: async (habitId: string): Promise<void> => {
    await api.patch(`/habits/${habitId}/toggle`)
  },
}

// ---- Users ----

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me')
    return response.data
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.put<User>('/users/me', data)
    return response.data
  },
}
