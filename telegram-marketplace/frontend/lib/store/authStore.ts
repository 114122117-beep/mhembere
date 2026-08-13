import { create } from 'zustand'

interface User {
  id: number
  username: string
  email: string
  display_name: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null,
  token: typeof window !== 'undefined' 
    ? localStorage.getItem('token')
    : null,
  
  setUser: (user) => {
    set({ user })
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    }
  },
  
  setToken: (token) => {
    set({ token })
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },
  
  logout: () => {
    set({ user: null, token: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
}))
