import { useState, useEffect } from 'react'
import { Booking, Salon } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Mock salon data
const MOCK_SALON: Salon = {
  id: '1',
  name: 'Premium Salon & Spa',
  address: '123 Main Street, Tech Park',
  city: 'Baddi',
  phone: '9876543210',
  email: 'salon@example.com',
  rating: 4.5,
  totalReviews: 156,
  description: 'Your perfect destination for beauty and wellness services',
  openingTime: '10:00',
  closingTime: '18:00',
  createdAt: '2024-01-01',
}

// Mock bookings data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BOOKING_1704820000000',
    customerId: '1',
    salonId: '1',
    serviceId: '1',
    date: '2026-01-15',
    time: '10:30',
    status: 'CONFIRMED',
    totalPrice: 300,
    notes: 'Haircut service',
    createdAt: '2026-01-09T01:30:00Z',
  },
  {
    id: 'BOOKING_1704906400000',
    customerId: '1',
    salonId: '1',
    serviceId: '2',
    date: '2026-01-12',
    time: '14:00',
    status: 'COMPLETED',
    totalPrice: 500,
    notes: 'Facial service',
    createdAt: '2026-01-08T01:30:00Z',
  },
  {
    id: 'BOOKING_1704992800000',
    customerId: '2',
    salonId: '1',
    serviceId: '3',
    date: '2026-01-20',
    time: '11:00',
    status: 'PENDING',
    totalPrice: 800,
    notes: 'Hair coloring service',
    createdAt: '2026-01-07T01:30:00Z',
  },
  {
    id: 'BOOKING_1705079200000',
    customerId: '3',
    salonId: '1',
    serviceId: '4',
    date: '2026-01-25',
    time: '16:30',
    status: 'CANCELLED',
    totalPrice: 600,
    notes: 'Massage service',
    createdAt: '2026-01-06T01:30:00Z',
  },
  {
    id: 'BOOKING_1705165600000',
    customerId: '4',
    salonId: '1',
    serviceId: '5',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    status: 'CONFIRMED',
    totalPrice: 400,
    notes: 'Pedicure service',
    createdAt: '2026-01-05T01:30:00Z',
  },
]

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  totalRefunds: number
  cancelledBookings: number
  todayBookings: number
}

export default function SalonOwnerDashboard() {
  const [salon, setSalon] = useState<Salon | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalRefunds: 0,
    cancelledBookings: 0,
    todayBookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use mock data
      setSalon(MOCK_SALON)
      setBookings(MOCK_BOOKINGS)

      // Calculate stats
      calculateStats(MOCK_BOOKINGS)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingsList: Booking[]) => {
    const today = new Date().toDateString()
    let totalRev = 0
    let refunds = 0
    let cancelled = 0
    let todayCount = 0

    bookingsList.forEach((booking) => {
      if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
        totalRev += booking.totalPrice || 0
      }
      if (booking.status === 'REFUNDED') {
        refunds += booking.totalPrice || 0
      }
      if (booking.status === 'CANCELLED') {
        cancelled += 1
      }
      if (new Date(booking.date).toDateString() === today) {
        todayCount += 1
      }
    })

    setStats({
      totalBookings: bookingsList.length,
      totalRevenue: totalRev,
      totalRefunds: refunds,
      cancelledBookings: cancelled,
      todayBookings: todayCount,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Salon Dashboard</h1>
        {salon && <p className="text-slate-600">{salon.name}</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bookings" value={stats.totalBookings} icon="📅" color="bg-blue-500" />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          color="bg-green-500"
        />
        <StatCard title="Total Refunds" value={`₹${stats.totalRefunds.toFixed(2)}`} icon="💸" color="bg-orange-500" />
        <StatCard title="Cancelled" value={stats.cancelledBookings} icon="❌" color="bg-red-500" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-slate-200">
          {['overview', 'bookings', 'services', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab stats={stats} salon={salon} bookings={bookings} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} getStatusColor={getStatusColor} />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'payments' && <PaymentsTab bookings={bookings} />}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-slate-200 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({
  stats,
  salon,
  bookings,
}: {
  stats: DashboardStats
  salon: Salon | null
  bookings: Booking[]
}) {
  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Today's Overview</h3>
        <p className="text-4xl font-bold text-blue-600">{stats.todayBookings}</p>
        <p className="text-blue-700 mt-2">Bookings scheduled for today</p>
      </div>

      {/* Recent Bookings */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
              <div>
                <p className="font-medium text-slate-900">Booking #{booking.id}</p>
                <p className="text-sm text-slate-600">{new Date(booking.date).toLocaleDateString('en-IN')} at {booking.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BookingsTab({ bookings, getStatusColor }: { bookings: Booking[]; getStatusColor: (status: string) => string }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Booking ID</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Date & Time</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Service</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="py-3 px-4 text-slate-900 font-mono text-sm">{booking.id}</td>
                <td className="py-3 px-4 text-slate-900">Customer {booking.customerId}</td>
                <td className="py-3 px-4 text-slate-600">
                  {new Date(booking.date).toLocaleDateString('en-IN')} at {booking.time}
                </td>
                <td className="py-3 px-4 text-slate-600">Service {booking.serviceId}</td>
                <td className="py-3 px-4 text-slate-900 font-semibold">₹{booking.totalPrice}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ServicesTab() {
  return (
    <div className="text-center py-12">
      <p className="text-slate-600 mb-4">Services management coming soon</p>
      <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Add Service
      </button>
    </div>
  )
}

function PaymentsTab({ bookings }: { bookings: Booking[] }) {
  const totalPayments = bookings
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  return (
    <div>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 mb-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Total Earnings</h3>
        <p className="text-4xl font-bold text-green-600">₹{totalPayments.toFixed(2)}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Transactions</h3>
        {bookings
          .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
          .slice(0, 5)
          .map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Booking #{booking.id}</p>
                <p className="text-sm text-slate-600">{new Date(booking.date).toLocaleDateString('en-IN')}</p>
              </div>
              <p className="text-lg font-bold text-green-600">+₹{booking.totalPrice}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

function getStatusBadge(status: string): string {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-700'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-700'
    case 'CANCELLED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
