export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'CUSTOMER' | 'SALON_OWNER' | 'ADMIN'
  createdAt: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
  role: 'CUSTOMER' | 'SALON_OWNER'
}

export interface Salon {
  id: string
  ownerId?: string
  name: string
  address: string
  city: string
  phone: string
  email: string
  rating?: number
  totalReviews?: number
  image?: string
  description?: string
  openingTime?: string
  closingTime?: string
  createdAt: string
  updatedAt?: string
}

export interface Service {
  id: string
  salonId: string
  name: string
  category: string
  categoryId?: string
  price: number
  duration: number // in minutes
  description?: string
  image?: string
  isActive?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Booking {
  id: string
  customerId: string
  userId?: string
  salonId: string
  serviceId: string
  date: string
  time: string
  bookingDate?: string
  bookingTime?: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  totalPrice: number
  notes?: string
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED'
  createdAt: string
  updatedAt?: string
}

export interface BookingRequest {
  userId?: string
  salonId: string
  serviceId: string
  date: string
  time: string
  bookingDate?: string
  bookingTime?: string
  notes?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  paymentMethod: 'CARD' | 'UPI' | 'WALLET'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  transactionId?: string
  createdAt: string
  updatedAt?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'BOOKING' | 'PAYMENT' | 'PROMOTION' | 'SYSTEM'
  isRead: boolean
  relatedBookingId?: string
  createdAt: string
}

export interface Review {
  id: string
  bookingId: string
  salonId: string
  customerId: string
  rating: number // 1-5
  comment: string
  createdAt: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface DashboardStats {
  totalBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  totalRevenue: number
  totalRefunds: number
  pendingPayments: number
}
