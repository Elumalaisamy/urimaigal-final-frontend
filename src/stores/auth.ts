// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthResponse, ApiResponse, LoginRequest, RegisterRequest } from '@/types'

const API_BASE = 'http://localhost:8080'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null && token.value !== null)
  const isAdvocate = computed(() => user.value?.role === 'advocate')
  const userName = computed(() => user.value?.name ?? '')

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password } as LoginRequest),
      })
      const result: ApiResponse<AuthResponse> = await response.json()
      if (result.success) {
        token.value = result.data.token
        user.value = {
          id: result.data.userId,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role as unknown as 'client' | 'advocate',
          consultations: [],
        }
        // Store token + user in localStorage
        localStorage.setItem('authToken', result.data.token)
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            id: result.data.userId,
            name: result.data.name,
            email: result.data.email,
            role: result.data.role,
          })
        )
        return true
      } else {
        throw new Error(result.message)
      }
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: 'client' | 'advocate' = 'client'
  ): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role } as RegisterRequest),
      })
      const result: ApiResponse<AuthResponse> = await response.json()
      if (result.success) {
        token.value = result.data.token
        user.value = {
          id: result.data.userId,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role as unknown as 'client' | 'advocate',
          consultations: [],
        }
        localStorage.setItem('authToken', result.data.token)
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            id: result.data.userId,
            name: result.data.name,
            email: result.data.email,
            role: result.data.role,
          })
        )
        return true
      } else {
        throw new Error(result.message)
      }
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  function clearError() {
    error.value = null
  }

  // Initialize from localStorage
  const storedToken = localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('authUser')
  if (storedToken) {
    token.value = storedToken
  }
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      user.value = {
        ...parsed,
        consultations: [],
      }
    } catch (e) {
      console.warn('Invalid auth user in storage', e)
    }
  }

  return { user, token, isLoading, error, isAuthenticated, isAdvocate, userName, login, register, logout, clearError }
})
