// src/types/index.ts

export interface Lawyer {
  id: string
  name: string
  avatar: string
  specialization: LegalCategory
  experience: number
  rating: number
  reviewCount: number
  location: string
  languages: string[]
  consultationFee: number
  bio: string
  available: boolean
  badge?: 'Top Rated' | 'Rising Star' | 'Pro Bono'
}

export type LegalCategory =
  | 'Criminal'
  | 'Civil'
  | 'Corporate'
  | 'Public Interest'
  | 'Immigration'
  | 'Intellectual Property'
  | 'Family'
  | 'Labour'

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export interface Consultation {
  id: string
  lawyerId: string
  lawyerName: string
  date: string
  time: string
  mode: 'chat' | 'video'
  status: 'scheduled' | 'completed' | 'cancelled'
  fee: number
}

export type UserRole = 'client' | 'advocate'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  avatar?: string
  consultations: Consultation[]
}

export interface FilterOptions {
  category: LegalCategory | 'All'
  minRating: number
  maxFee: number
  language: string
  available: boolean
}

export interface AuthResponse {
  token: string
  userId: string
  name: string
  email: string
  role: UserRole
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: UserRole
}
