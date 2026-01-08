import { create } from 'zustand'
import { User } from '../types'

// Mock user for testing - backend not ready
const MOCK_USER: User = {
  id: 'customer-001',
  email: 'test@example.com',
  name: 'Test Customer',
  phone: '+91-9876543210',
  role: 'CUSTOMER',
  createdAt: new Date().toISOString(),
}

const MOCK_TOKEN = 'mock-jwt-token-for-testing-' + Date.now()

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (user: User, token: string) => void
  logout: () => void
  setError: (error: string | null) => void
  setMockUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with mock user directly (bypass localStorage restoration)
  return {
    user: MOCK_USER,
    token: MOCK_TOKEN,
    loading: false,
    error: null,

    login: (user, token) => {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      set({ user, token, error: null })
    },

    logout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // Still keep mock user for testing
      set({ user: MOCK_USER, token: MOCK_TOKEN })
    },

    setError: (error) => set({ error }),

    setMockUser: (user) => set({ user }),
  }
})
