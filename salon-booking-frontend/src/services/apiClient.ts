import axios, { AxiosInstance } from 'axios'

/**
 * API CLIENT - Routes all requests through Spring Cloud Gateway
 * 
 * Gateway: http://localhost:8888/api
 * 
 * Microservices:
 * - USER-SERVICE (8001) -> /api/users
 * - SALON-SERVICE (8002) -> /api/salons
 * - SERVICE-OFFERING (8003) -> /api/services
 * - CATEGORY-SERVICE (8004) -> /api/categories  
 * - BOOKING-SERVICE (8005) -> /api/bookings
 * - PAYMENT-SERVICE (8006) -> /api/payments
 * - NOTIFICATION-SERVICE (8007) -> /api/notifications
 */

const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || 'http://localhost:8888/api'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: GATEWAY_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor: Attach JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor: Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // ==================== USER SERVICE ====================
  
  async registerUser(data: {
    name: string
    email: string
    password: string
    role: 'CUSTOMER' | 'SALON' | 'ADMIN'
    phone: string
  }) {
    const response = await this.client.post('/users/register', data)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async loginUser(email: string, password: string) {
    const response = await this.client.post('/users/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async logoutUser() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    return { message: 'Logged out' }
  }

  async getUserProfile(userId: string) {
    return (await this.client.get(`/users/${userId}`)).data
  }

  async updateUserProfile(userId: string, data: any) {
    const response = await this.client.put(`/users/${userId}`, data)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  }

  // ==================== SALON SERVICE ====================

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

  // ==================== SERVICE OFFERING ====================

  async getServices(page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return (await this.client.get(`/services?${params}`)).data
  }

  async getServiceById(id: string) {
    return (await this.client.get(`/services/${id}`)).data
  }

  async getServices(salonId: string) {
    return (await this.client.get(`/salons/${salonId}/services`)).data
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

  // ==================== CATEGORY SERVICE ====================

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

  // ==================== BOOKING SERVICE ====================

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

  // ==================== PAYMENT SERVICE ====================

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

  // ==================== NOTIFICATION SERVICE ====================

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
    return (await this.client.post('/notifications/email', { email, subject, message }
    )).data
  }
}

export const apiClient = new APIClient()
export default apiClient
