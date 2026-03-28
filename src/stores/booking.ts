// src/stores/booking.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Consultation, ApiResponse } from '@/types'
import { useAuthStore } from './auth'

const API_BASE = 'http://localhost:8080'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<Consultation[]>([])
  const isLoading = ref(false)
  const successMessage = ref<string | null>(null)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  async function bookConsultation(
    lawyerId: string,
    lawyerName: string,
    date: string,
    time: string,
    mode: 'chat' | 'video',
    fee: number
  ): Promise<boolean> {
    isLoading.value = true
    successMessage.value = null
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          lawyerId,
          date,
          time,
          mode,
          fee,
        }),
      })
      const result: ApiResponse<Consultation> = await response.json()
      if (result.success) {
        bookings.value.push(result.data)
        successMessage.value = `Consultation with ${lawyerName} booked for ${date} at ${time}`
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBookings() {
    if (!authStore.token) return
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      })
      const result: ApiResponse<Consultation[]> = await response.json()
      if (result.success) {
        bookings.value = result.data
      }
    } catch (e: any) {
      console.error('Error fetching bookings:', e)
    } finally {
      isLoading.value = false
    }
  }

  function cancelBooking(id: string) {
    const booking = bookings.value.find((b) => b.id === id)
    if (booking) booking.status = 'cancelled'
  }

  function clearSuccess() {
    successMessage.value = null
  }

  function clearError() {
    error.value = null
  }

  async function fetchAdvocateConsultations() {
    if (!authStore.token || authStore.user?.role !== 'advocate') return []
    try {
      const response = await fetch(`${API_BASE}/api/advocate/consultations`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      })
      const result: ApiResponse<Consultation[]> = await response.json()
      if (result.success) {
        return result.data
      }
      return []
    } catch (e: any) {
      console.error('Error fetching advocate consultations:', e)
      return []
    }
  }

  return { bookings, isLoading, successMessage, error, bookConsultation, fetchBookings, fetchAdvocateConsultations, cancelBooking, clearSuccess, clearError }
})
