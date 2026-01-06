import axios, { AxiosInstance } from 'axios'

/**
 * ============================================
 * API CLIENT - Microservices Gateway Integration
 * ============================================
 * 
 * Routes ALL requests through Spring Cloud Gateway (Port 8862)
 * All microservices are discovered and routed via Eureka
 * 
 * GATEWAY: http://localhost:8862/api
 * EUREKA: http://localhost:8761
 * 
 * MICROSERVICES (Registered with Eureka):
 * - USER-SERVICE: :8001
 * - SALON-SERVICE: :8002
 * - SERVICE-OFFERING: :8003
 * - CATEGORY-SERVICE: :8004
 * - BOOKING-SERVICE: :8005
 * - PAYMENT-SERVICE: :8006
 * - NOTIFICATION-SERVICE: :8007
 */

// ✅ FIXED: Use import.meta.env for Vite OR handle both Create React App and Vite
const getGatewayUrl = () => {
  // For Vite projects
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GATEWAY_URL) {
    return import.meta.env.VITE_GATEWAY_URL
  }
  
  // For Create React App projects (REACT_APP_ prefix)
  if (typeof window !== 'undefined' && (window as any).__ENV__?.REACT_APP_GATEWAY_URL) {
    return (window as any).__ENV__.REACT_APP_GATEWAY_URL
  }
  
  // Fallback to default
  return 'http://localhost:8862/api'
}

const GATEWAY_URL = getGatewayUrl()

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        // ✅ CORS headers for frontend requests
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false, // Set to true if backend sends credentials
    })

    // REQUEST INTERCEPTOR: Attach JWT token to all requests
    this.client.interceptors.request.use(
      (config) => {
        // Try both 'authToken' and 'token' for compatibility
        const token = localStorage.getItem('authToken') || localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // RESPONSE INTERCEPTOR: Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired - clear localStorage and redirect to login
          localStorage.removeItem('authToken')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // ==================== USER SERVICE (Port 8001) ====================
  
  async registerUser(data: {
    name: string
    email: string
    password: string
    role: 'CUSTOMER' | 'SALON_OWNER' | 'ADMIN'
    phone: string
  }) {
    const response = await this.client.post('/users/register', data)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async loginUser(email: string, password: string) {
    const response = await this.client.post('/users/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/users/login', data)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async logoutUser() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { message: 'Logged out successfully' }
  }

  async getUserProfile(userId: string) {
    return (await this.client.get(`/users/${userId}`)).data
  }

  async updateUserProfile(userId: string, data: any) {
    const response = await this.client.put(`/users/${userId}`, data)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  }

  // ==================== SALON SERVICE (Port 8002) ====================

  async getSalons(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })
    return (await this.client.get(`/salons?${params}`)).data
  }

  async getSalonById(id: string) {
    return (await this.client.get(`/salons/${id}`)).data
  }

  async searchSalons(query: string, city?: string) {
    const params = new URLSearchParams({
      search: query,
      ...(city && { city }),
    })
    return (await this.client.get(`/salons/search?${params}`)).data
  }

  async createSalon(data: any) {
    return (await this.client.post('/salons', data)).data
  }

  async updateSalon(id: string, data: any) {
    return (await this.client.put(`/salons/${id}`, data)).data
  }

  async deleteSalon(id: string) {
    return (await this.client.delete(`/salons/${id}`)).data
  }

  // ==================== SERVICE OFFERING (Port 8003) ====================

  async getServicesBySalonId(salonId: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/salons/${salonId}/services?${params}`)).data
  }

  async getServiceById(id: string) {
    return (await this.client.get(`/services/${id}`)).data
  }

  async getServicesByCategory(categoryId: string) {
    return (await this.client.get(`/services/category/${categoryId}`)).data
  }

  async createService(data: any) {
    return (await this.client.post('/services', data)).data
  }

  async updateService(id: string, data: any) {
    return (await this.client.put(`/services/${id}`, data)).data
  }

  async deleteService(id: string) {
    return (await this.client.delete(`/services/${id}`)).data
  }

  // ==================== CATEGORY SERVICE (Port 8004) ====================

  async getCategories() {
    return (await this.client.get('/categories')).data
  }

  async getCategoryById(id: string) {
    return (await this.client.get(`/categories/${id}`)).data
  }

  async createCategory(data: any) {
    return (await this.client.post('/categories', data)).data
  }

  async updateCategory(id: string, data: any) {
    return (await this.client.put(`/categories/${id}`, data)).data
  }

  async deleteCategory(id: string) {
    return (await this.client.delete(`/categories/${id}`)).data
  }

  // ==================== BOOKING SERVICE (Port 8005) ====================

  async createBooking(data: {
    userId: string
    salonId: string
    serviceId: string
    bookingDate: string
    bookingTime: string
    notes?: string
  }) {
    return (await this.client.post('/bookings', data)).data
  }

  async getBookingById(id: string) {
    return (await this.client.get(`/bookings/${id}`)).data
  }

  async getUserBookings(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/users/${userId}/bookings?${params}`)).data
  }

  async getSalonBookings(salonId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/salons/${salonId}/bookings?${params}`)).data
  }

  async updateBooking(id: string, data: any) {
    return (await this.client.put(`/bookings/${id}`, data)).data
  }

  async cancelBooking(id: string) {
    return (await this.client.post(`/bookings/${id}/cancel`, {})).data
  }

  async getAvailability(salonId: string, date: string) {
    return (await this.client.get(`/salons/${salonId}/availability?date=${date}`)).data
  }

  // ==================== PAYMENT SERVICE (Port 8006) ====================

  async createPayment(data: {
    bookingId: string
    amount: number
    paymentMethod: string
  }) {
    return (await this.client.post('/payments', data)).data
  }

  async getPaymentById(id: string) {
    return (await this.client.get(`/payments/${id}`)).data
  }

  async processPayment(
    id: string,
    details: {
      cardNumber?: string
      expiryDate?: string
      cvv?: string
      upiId?: string
    }
  ) {
    return (await this.client.post(`/payments/${id}/process`, details)).data
  }

  async confirmPayment(id: string) {
    return (await this.client.post(`/payments/${id}/confirm`, {})).data
  }

  async getPaymentHistory(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/users/${userId}/payments?${params}`)).data
  }

  async refundPayment(id: string, reason: string) {
    return (await this.client.post(`/payments/${id}/refund`, { reason })).data
  }

  // ==================== NOTIFICATION SERVICE (Port 8007) ====================

  async getNotifications(userId: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/users/${userId}/notifications?${params}`)).data
  }

  async markNotificationAsRead(id: string) {
    return (await this.client.put(`/notifications/${id}/read`, {})).data
  }

  async sendEmailNotification(email: string, subject: string, message: string) {
    return (await this.client.post('/notifications/email', { email, subject, message })).data
  }
}

export const apiClient = new APIClient()
export default apiClient
