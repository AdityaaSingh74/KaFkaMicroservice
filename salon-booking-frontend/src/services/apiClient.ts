import axios, { AxiosInstance } from 'axios'
import { getToken, updateToken, doLogout } from './keycloakService'

const getGatewayUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GATEWAY_URL) {
    return import.meta.env.VITE_GATEWAY_URL
  }
  return 'http://localhost:8862'
}

const GATEWAY_URL = getGatewayUrl()

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    })

    // Request interceptor - Add Keycloak token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          // Try to update token if it's about to expire
          await updateToken(() => {
            const token = getToken()
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          })
        } catch (error) {
          // If token update fails, use existing token
          const token = getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - Handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('❌ Unauthorized - logging out')
          doLogout()
        }
        return Promise.reject(error)
      }
    )
  }

  // ==================== HELPERS ====================

  private convertObjectIdToString(obj: any): string {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    if (obj.timestamp) return obj.timestamp.toString()
    if (obj.$oid) return obj.$oid
    return obj.id || obj._id || ''
  }

  private transformSalon(salon: any) {
    if (!salon) return null
    const id = this.convertObjectIdToString(salon.id)
    return {
      ...salon,
      id,
      _id: id,
      images: Array.isArray(salon.images) ? salon.images : [],
      rating: typeof salon.rating === 'number' ? salon.rating : 0,
      city: salon.city || '',
    }
  }

  private transformSalons(data: any) {
    return Array.isArray(data)
      ? data.map((s) => this.transformSalon(s)).filter(Boolean)
      : []
  }

  // ==================== SALON APIs ====================

  async getSalons(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    const response = await this.client.get(`/salons/api/salons?${params}`)
    return this.transformSalons(response.data)
  }

  async getSalonById(id: string) {
    const response = await this.client.get(`/salons/api/salons/${id}`)
    return this.transformSalon(response.data)
  }

  async searchSalons(query: string, city?: string) {
    const params = new URLSearchParams({
      search: query,
      ...(city && { city }),
    })

    const response = await this.client.get(`/salons/api/salons/search?${params}`)
    return this.transformSalons(response.data)
  }

  // ==================== USER APIs ====================

 async getCurrentUser() {
  const response = await this.client.get('/users/api/users/current')  // Changed from /me
  return response.data
}

  async getUserById(id: string) {
    const response = await this.client.get(`/users/api/users/${id}`)
    return response.data
  }

  async updateUser(id: string, userData: any) {
    const response = await this.client.put(`/users/api/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string) {
    const response = await this.client.delete(`/users/api/users/${id}`)
    return response.data
  }

  // ==================== BOOKING APIs ====================

  async getBookings(userId?: string) {
    const url = userId 
      ? `/bookings/api/bookings?userId=${userId}`
      : '/bookings/api/bookings'
    
    const response = await this.client.get(url)
    return response.data
  }

  async getBookingById(id: string) {
    const response = await this.client.get(`/bookings/api/bookings/${id}`)
    return response.data
  }

  async createBooking(bookingData: any) {
    const response = await this.client.post('/bookings/api/bookings', bookingData)
    return response.data
  }

  async updateBooking(id: string, bookingData: any) {
    const response = await this.client.put(`/bookings/api/bookings/${id}`, bookingData)
    return response.data
  }

  async cancelBooking(id: string) {
    const response = await this.client.delete(`/bookings/api/bookings/${id}`)
    return response.data
  }

  // ==================== SALON OWNER APIs ====================

  async createSalon(salonData: any) {
    const response = await this.client.post('/salons/api/salons', salonData)
    return response.data
  }

  async updateSalon(id: string, salonData: any) {
    const response = await this.client.put(`/salons/api/salons/${id}`, salonData)
    return response.data
  }

  async deleteSalon(id: string) {
    const response = await this.client.delete(`/salons/api/salons/${id}`)
    return response.data
  }
}

export const apiClient = new APIClient()
export default apiClient