import axios, { AxiosInstance } from 'axios'

/**
 * ============================================
 * API CLIENT - Microservices Gateway Integration
 * ============================================
 * 
 * Routes through Spring Cloud Gateway (Port 8862)
 * Services discovered via Eureka
 * 
 * GATEWAY: http://localhost:8862
 * EUREKA: http://localhost:8761
 * 
 * ROUTING PATTERN: /{EUREKA-SERVICE-NAME}/api/{endpoint}
 * 
 * MICROSERVICES (Registered with Eureka):
 * - USER-SERVICE: /users/api/...
 * - SALON-SERVICE: /salons/api/...
 * - SERVICE-OFFERING: /services/api/...
 * - CATEGORY-SERVICE: /categories/api/...
 * - BOOKING-SERVICE: /bookings/api/...
 * - PAYMENT-SERVICE: /payments/api/...
 * - NOTIFICATION-SERVICE: /notifications/api/...
 * - REVIEW-SERVICE: /reviews/api/...
 */

const getGatewayUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GATEWAY_URL) {
    return import.meta.env.VITE_GATEWAY_URL
  }
  if (typeof window !== 'undefined' && (window as any).__ENV__?.REACT_APP_GATEWAY_URL) {
    return (window as any).__ENV__.REACT_APP_GATEWAY_URL
  }
  return 'http://localhost:8862'
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
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false,
    })

    // REQUEST INTERCEPTOR: Attach JWT token to all requests
    this.client.interceptors.request.use(
      (config) => {
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
          localStorage.removeItem('authToken')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // ==================== USER SERVICE (Eureka: USER-SERVICE) ====================
  
  async registerUser(data: {
    name: string
    email: string
    password: string
    role: 'CUSTOMER' | 'SALON_OWNER' | 'ADMIN'
    phone: string
  }) {
    const response = await this.client.post('/users/api/users/register', data)
    if (response.data.token || response.data.accessToken) {
      const token = response.data.token || response.data.accessToken
      localStorage.setItem('authToken', token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async loginUser(email: string, password: string) {
    const response = await this.client.post('/users/api/users/login', { email, password })
    if (response.data.token || response.data.accessToken) {
      const token = response.data.token || response.data.accessToken
      localStorage.setItem('authToken', token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/users/api/users/login', data)
    if (response.data.token || response.data.accessToken) {
      const token = response.data.token || response.data.accessToken
      localStorage.setItem('authToken', token)
      localStorage.setItem('token', token)
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
    return (await this.client.get(`/users/api/users/${userId}`)).data
  }

  async updateUserProfile(userId: string, data: any) {
    const response = await this.client.put(`/users/api/users/${userId}`, data)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  }

  // ==================== SALON SERVICE (Eureka: SALON-SERVICE) ====================

  async getSalons(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })
    return (await this.client.get(`/salons/api/salons?${params}`)).data
  }

  async getSalonById(id: string) {
    return (await this.client.get(`/salons/api/salons/${id}`)).data
  }

  async searchSalons(query: string, city?: string) {
    const params = new URLSearchParams({
      search: query,
      ...(city && { city }),
    })
    return (await this.client.get(`/salons/api/salons/search?${params}`)).data
  }

  async createSalon(data: any) {
    return (await this.client.post('/salons/api/salons', data)).data
  }

  async updateSalon(id: string, data: any) {
    return (await this.client.put(`/salons/api/salons/${id}`, data)).data
  }

  async deleteSalon(id: string) {
    return (await this.client.delete(`/salons/api/salons/${id}`)).data
  }

  // ==================== SERVICE OFFERING (Eureka: SERVICE-OFFERING) ====================

  async getServicesBySalonId(salonId: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/services/api/salons/${salonId}/services?${params}`)).data
  }

  async getServiceById(id: string) {
    return (await this.client.get(`/services/api/services/${id}`)).data
  }

  async getServicesByCategory(categoryId: string) {
    return (await this.client.get(`/services/api/services/category/${categoryId}`)).data
  }

  async createService(data: any) {
    return (await this.client.post('/services/api/services', data)).data
  }

  async updateService(id: string, data: any) {
    return (await this.client.put(`/services/api/services/${id}`, data)).data
  }

  async deleteService(id: string) {
    return (await this.client.delete(`/services/api/services/${id}`)).data
  }

  // ==================== CATEGORY SERVICE (Eureka: CATEGORY-SERVICE) ====================

  async getCategories() {
    return (await this.client.get('/categories/api/categories')).data
  }

  async getCategoryById(id: string) {
    return (await this.client.get(`/categories/api/categories/${id}`)).data
  }

  async createCategory(data: any) {
    return (await this.client.post('/categories/api/categories', data)).data
  }

  async updateCategory(id: string, data: any) {
    return (await this.client.put(`/categories/api/categories/${id}`, data)).data
  }

  async deleteCategory(id: string) {
    return (await this.client.delete(`/categories/api/categories/${id}`)).data
  }

  // ==================== BOOKING SERVICE (Eureka: BOOKING-SERVICE) ====================

  async createBooking(data: {
    userId: string
    salonId: string
    serviceId: string
    bookingDate: string
    bookingTime: string
    notes?: string
  }) {
    return (await this.client.post('/bookings/api/bookings', data)).data
  }

  async getBookingById(id: string) {
    return (await this.client.get(`/bookings/api/bookings/${id}`)).data
  }

  async getUserBookings(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/bookings/api/users/${userId}/bookings?${params}`)).data
  }

  async getCustomerBookings(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/bookings/api/users/${userId}/bookings?${params}`)).data
  }

  async getSalonBookings(salonId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/bookings/api/salons/${salonId}/bookings?${params}`)).data
  }

  async getBookingsBySalonId(salonId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/bookings/api/salons/${salonId}/bookings?${params}`)).data
  }

  async updateBooking(id: string, data: any) {
    return (await this.client.put(`/bookings/api/bookings/${id}`, data)).data
  }

  async cancelBooking(id: string) {
    return (await this.client.post(`/bookings/api/bookings/${id}/cancel`, {})).data
  }

  async confirmBooking(id: string) {
    return (await this.client.post(`/bookings/api/bookings/${id}/confirm`, {})).data
  }

  async getAvailability(salonId: string, date: string) {
    return (await this.client.get(`/bookings/api/salons/${salonId}/availability?date=${date}`)).data
  }

  async getBookedSlots(salonId: string, date: string) {
    return (await this.client.get(`/bookings/api/salons/${salonId}/booked-slots?date=${date}`)).data
  }

  // ==================== PAYMENT SERVICE (Eureka: PAYMENT-SERVICE) ====================

  async createPayment(data: {
    bookingId: string
    amount: number
    paymentMethod: string
  }) {
    return (await this.client.post('/payments/api/payments', data)).data
  }

  async getPaymentById(id: string) {
    return (await this.client.get(`/payments/api/payments/${id}`)).data
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
    return (await this.client.post(`/payments/api/payments/${id}/process`, details)).data
  }

  async confirmPayment(id: string) {
    return (await this.client.post(`/payments/api/payments/${id}/confirm`, {})).data
  }

  async getPaymentHistory(userId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/payments/api/users/${userId}/payments?${params}`)).data
  }

  async refundPayment(id: string, reason: string) {
    return (await this.client.post(`/payments/api/payments/${id}/refund`, { reason })).data
  }

  async createPaymentLink(data: {
    bookingId: string
    amount: number
    paymentMethod?: string
  }) {
    return (await this.client.post('/payments/api/payments/stripe/create-link', data)).data
  }

  // ==================== NOTIFICATION SERVICE (Eureka: NOTIFICATION-SERVICE) ====================

  async getNotifications(userId: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/notifications/api/users/${userId}/notifications?${params}`)).data
  }

  async markNotificationAsRead(id: string) {
    return (await this.client.put(`/notifications/api/notifications/${id}/read`, {})).data
  }

  async markAllNotificationsAsRead(userId: string) {
    return (await this.client.put(`/notifications/api/users/${userId}/notifications/read-all`, {})).data
  }

  async sendEmailNotification(email: string, subject: string, message: string) {
    return (await this.client.post('/notifications/api/notifications/email', { email, subject, message })).data
  }

  // ==================== REVIEW SERVICE (Eureka: REVIEW-SERVICE) ====================

  async createReview(data: {
    bookingId: string
    salonId: string
    rating: number
    comment: string
  }) {
    return (await this.client.post('/reviews/api/reviews', data)).data
  }

  async getReviewsBySalonId(salonId: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/reviews/api/salons/${salonId}/reviews?${params}`)).data
  }

  async getRatingSummary(salonId: string) {
    return (await this.client.get(`/reviews/api/salons/${salonId}/summary`)).data
  }

  async updateReview(id: string, data: any) {
    return (await this.client.put(`/reviews/api/reviews/${id}`, data)).data
  }

  async deleteReview(id: string) {
    return (await this.client.delete(`/reviews/api/reviews/${id}`)).data
  }
}

export const apiClient = new APIClient()
export default apiClient
