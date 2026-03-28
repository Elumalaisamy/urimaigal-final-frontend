// src/stores/lawyers.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Lawyer, FilterOptions, LegalCategory, ApiResponse } from '@/types'
import { useAuthStore } from './auth'

const API_BASE = 'https://urimaigal-backend-production.up.railway.app/'

export const useLawyersStore = defineStore('lawyers', () => {
  const authStore = useAuthStore()
  const lawyers = ref<Lawyer[]>([])
  const selectedLawyer = ref<Lawyer | null>(null)
  const isLoading = ref(false)
  const searchQuery = ref('')
  const filters = ref<FilterOptions>({
    category: 'All',
    minRating: 0,
    maxFee: 5000,
    language: 'All',
    available: false,
  })

  const filteredLawyers = computed(() => {
    return lawyers.value.filter((l) => {
      const matchesSearch =
        l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        l.specialization.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        l.location.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesCategory =
        filters.value.category === 'All' || l.specialization === filters.value.category

      const matchesRating = l.rating >= filters.value.minRating
      const matchesFee = l.consultationFee <= filters.value.maxFee
      const matchesLanguage =
        filters.value.language === 'All' || l.languages.includes(filters.value.language)
      const matchesAvailable = !filters.value.available || l.available

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRating &&
        matchesFee &&
        matchesLanguage &&
        matchesAvailable
      )
    })
  })

  const categories = computed<LegalCategory[]>(() => [
    'Criminal',
    'Civil',
    'Corporate',
    'Public Interest',
    'Immigration',
    'Intellectual Property',
    'Family',
    'Labour',
  ])

  async function fetchLawyers() {
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE}/api/lawyers`)
      const result: ApiResponse<Lawyer[]> = await response.json()
      if (result.success) {
        lawyers.value = result.data
      } else {
        console.error('Failed to fetch lawyers:', result.message)
      }
    } catch (error) {
      console.error('Error fetching lawyers:', error)
    } finally {
      isLoading.value = false
    }
  }

  function selectLawyer(lawyer: Lawyer | null) {
    selectedLawyer.value = lawyer
  }

  function getLawyerById(id: string): Lawyer | undefined {
    return lawyers.value.find((l) => l.id === id)
  }

  function setSearchQuery(q: string) {
    searchQuery.value = q
  }

  function setFilter<K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) {
    filters.value[key] = value
  }

  function resetFilters() {
    filters.value = {
      category: 'All',
      minRating: 0,
      maxFee: 5000,
      language: 'All',
      available: false,
    }
    searchQuery.value = ''
  }

  async function createAdvocateProfile(profile: Lawyer): Promise<boolean> {
    if (authStore.user?.role !== 'advocate') {
      console.warn('Only advocate users can create advocate profile.');
      return false
    }
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE}/api/lawyers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(profile),
      })
      const result: ApiResponse<Lawyer> = await response.json()
      if (result.success) {
        lawyers.value.push(result.data)
        return true
      }
      console.error('Failed to create advocate profile:', result.message)
      return false
    } catch (error) {
      console.error('Error creating advocate profile:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function updateAdvocateProfile(profile: Lawyer): Promise<boolean> {
    if (authStore.user?.role !== 'advocate') {
      console.warn('Only advocate users can update advocate profile.');
      return false
    }
    isLoading.value = true
    try {
      const response = await fetch(`${API_BASE}/api/lawyers/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(profile),
      })
      const result: ApiResponse<Lawyer> = await response.json()
      if (result.success) {
        const index = lawyers.value.findIndex((l) => l.id === profile.id)
        if (index !== -1) lawyers.value[index] = result.data
        else lawyers.value.push(result.data)
        return true
      }
      console.error('Failed to update advocate profile:', result.message)
      return false
    } catch (error) {
      console.error('Error updating advocate profile:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function getAdvocateByUserId(userId: string): Lawyer | undefined {
    return lawyers.value.find((l) => l.id === userId)
  }

  async function fetchAdvocateEarnings() {
    if (!authStore.token || authStore.user?.role !== 'advocate') return null
    try {
      const response = await fetch(`${API_BASE}/api/advocate/earnings`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      })
      const result: ApiResponse<{
        monthlyEarnings: number
        completedThisMonth: number
        completedEarnings: number
        upcomingThisMonth: number
        upcomingEarnings: number
      }> = await response.json()
      if (result.success) {
        return result.data
      }
      return null
    } catch (e: any) {
      console.error('Error fetching advocate earnings:', e)
      return null
    }
  }

  async function fetchAdvocateAnalytics() {
    if (!authStore.token || authStore.user?.role !== 'advocate') return null
    try {
      const response = await fetch(`${API_BASE}/api/advocate/analytics`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      })
      const result: ApiResponse<{
        profileViews: number
        bookingRequests: number
        conversionRate: number
      }> = await response.json()
      if (result.success) {
        return result.data
      }
      return null
    } catch (e: any) {
      console.error('Error fetching advocate analytics:', e)
      return null
    }
  }

  // Fetch lawyers on init
  fetchLawyers()

  return {
    lawyers,
    selectedLawyer,
    isLoading,
    searchQuery,
    filters,
    filteredLawyers,
    categories,
    fetchLawyers,
    selectLawyer,
    getLawyerById,
    getAdvocateByUserId,
    fetchAdvocateEarnings,
    fetchAdvocateAnalytics,
    createAdvocateProfile,
    updateAdvocateProfile,
    setSearchQuery,
    setFilter,
    resetFilters,
  }
})
