import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Booking } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'

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
    customerId: '1',
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
    customerId: '1',
    salonId: '1',
    serviceId: '4',
    date: '2026-01-25',
    time: '16:30',
    status: 'CANCELLED',
    totalPrice: 600,
    notes: 'Massage service',
    createdAt: '2026-01-06T01:30:00Z',
  },
]

interface CustomerStats {
  totalBookings: number
  confirmedBookings: number
  upcomingBookings: number
  completedBookings: number
  totalSpent: number
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<CustomerStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const fetchCustomerData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use mock bookings data
      setBookings(MOCK_BOOKINGS)

      // Calculate stats from mock data
      calculateStats(MOCK_BOOKINGS)
    } catch (err: any) {
      console.error('Error fetching customer data:', err)
      setError('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingsList: Booking[]) => {
    const today = new Date()
    let confirmed = 0
    let upcoming = 0
    let completed = 0
    let spent = 0

    bookingsList.forEach((booking) => {
      if (booking.status === 'CONFIRMED') confirmed += 1
      if (booking.status === 'COMPLETED') completed += 1
      if (booking.status === 'CONFIRMED') {
        const bookingDate = new Date(booking.date)
        if (bookingDate > today) upcoming += 1
      }
      if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
        spent += booking.totalPrice || 0
      }
    })

    setStats({
      totalBookings: bookingsList.length,
      confirmedBookings: confirmed,
      upcomingBookings: upcoming,
      completedBookings: completed,
      totalSpent: spent,
    })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-600">Manage your salon appointments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Bookings" value={stats.totalBookings} icon="📅" color="bg-blue-500" />
        <StatCard title="Confirmed" value={stats.confirmedBookings} icon="✅" color="bg-green-500" />
        <StatCard title="Upcoming" value={stats.upcomingBookings} icon="🗓" color="bg-purple-500" />
        <StatCard title="Completed" value={stats.completedBookings} icon="✔" color="bg-indigo-500" />
        <StatCard title="Total Spent" value={`₹${stats.totalSpent}`} icon="💰" color="bg-orange-500" />
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Appointments</h2>
          <p className="text-slate-600 mt-1">{bookings.length} total bookings</p>
        </div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Booking ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Service</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Date & Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="py-4 px-6 text-slate-900 font-mono text-sm">{booking.id}</td>
                    <td className="py-4 px-6 text-slate-700">Service {booking.serviceId}</td>
                    <td className="py-4 px-6 text-slate-700">
                      {new Date(booking.date).toLocaleDateString('en-IN')} at {booking.time}
                    </td>
                    <td className="py-4 px-6 text-slate-900 font-semibold">₹{booking.totalPrice}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {booking.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => navigate(`/booking/${booking.id}/reschedule`)}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => navigate(`/booking/${booking.id}/cancel`)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'COMPLETED' && (
                          <button
                            onClick={() => navigate('/salons')}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                          >
                            Rebook
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/salons')}
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Browse Salons
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Bookings Alert */}
      {stats.upcomingBookings > 0 && (
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-bold text-blue-900 mb-2">Upcoming Appointments</h3>
          <p className="text-blue-800">You have {stats.upcomingBookings} appointments coming up. Don't forget to arrive on time!</p>
        </div>
      )}
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
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-slate-200 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-xs font-medium mb-1 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
          {icon}
        </div>
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
