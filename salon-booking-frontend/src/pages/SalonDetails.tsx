import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon, Service, Booking } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'

interface CartItem {
  service: Service
  quantity: number
}

// Mock data for services
const MOCK_SERVICES: Service[] = [
  { id: '1', salonId: '1', name: 'Haircut', category: 'haircut', price: 300, duration: 30, description: 'Professional haircut' },
  { id: '2', salonId: '1', name: 'Facial', category: 'facial', price: 500, duration: 45, description: 'Relaxing facial' },
  { id: '3', salonId: '1', name: 'Hair Coloring', category: 'hair coloring', price: 800, duration: 60, description: 'Hair coloring service' },
  { id: '4', salonId: '1', name: 'Massage', category: 'massage', price: 600, duration: 60, description: 'Full body massage' },
  { id: '5', salonId: '1', name: 'Pedicure', category: 'pedicure', price: 400, duration: 45, description: 'Pedicure service' },
  { id: '6', salonId: '1', name: 'Manicure', category: 'manicure', price: 350, duration: 30, description: 'Manicure service' },
]

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

// Mock booked slots
const MOCK_BOOKED_SLOTS: string[] = ['11:00', '12:00', '14:30', '16:00']

export default function SalonDetails() {
  const { salonId } = useParams<{ salonId: string }>()
  const navigate = useNavigate()

  const [salon, setSalon] = useState<Salon | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showBooking, setShowBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
  ]

  useEffect(() => {
    fetchSalonDetails()
  }, [salonId])

  useEffect(() => {
    if (selectedDate) {
      // Simulate fetching booked slots - use mock data
      setBookedSlots(MOCK_BOOKED_SLOTS)
    }
  }, [selectedDate])

  const fetchSalonDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use mock data
      setSalon(MOCK_SALON)
      setServices(MOCK_SERVICES)

      // Extract unique categories
      const cats = ['all', ...new Set(MOCK_SERVICES.map((s) => s.category))]
      setCategories(cats)
    } catch (err: any) {
      console.error('Error:', err)
      setError('Failed to load salon details')
    } finally {
      setLoading(false)
    }
  }

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((s) => s.category === selectedCategory)

  const addToCart = (service: Service) => {
    const existing = cart.find((item) => item.service.id === service.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([...cart, { service, quantity: 1 }])
    }
  }

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter((item) => item.service.id !== serviceId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.service.price * item.quantity, 0)
  }

  const isSlotBooked = (time: string) => bookedSlots.includes(time)

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select date and time')
      return
    }

    if (cart.length === 0) {
      setError('Please select at least one service')
      return
    }

    try {
      // Use mock booking data
      const mockBooking = {
        id: `BOOKING_${Date.now()}`,
        customerId: '1',
        salonId: salonId || '1',
        serviceId: cart[0].service.id,
        date: selectedDate,
        time: selectedTime,
        status: 'PENDING' as const,
        totalPrice: getTotalPrice(),
        notes: `Booking ${cart.length} service(s)`,
        createdAt: new Date().toISOString(),
      }

      // Redirect to payment with mock booking
      navigate(`/payment/${mockBooking.id}`, { state: { booking: mockBooking, total: getTotalPrice() } })
    } catch (err: any) {
      console.error('Error:', err)
      setError('Failed to create booking')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {salon && (
        <div>
          {/* Salon Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{salon.name}</h1>
                <p className="text-slate-600">{salon.address}</p>
                <p className="text-slate-600">{salon.city}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-yellow-500">⭐</span>
                  <span className="text-xl font-bold text-slate-900">{salon.rating}</span>
                </div>
                <p className="text-slate-600">📞 {salon.phone}</p>
                <p className="text-slate-600">📧 {salon.email}</p>
              </div>
            </div>
            <p className="text-slate-700">{salon.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Services</h2>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <h3 className="font-semibold text-slate-900 mb-2">{service.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-slate-900">₹{service.price}</p>
                          <p className="text-xs text-slate-600">{service.duration} mins</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(service)}
                        className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart & Booking */}
            <div>
              {/* Cart */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Your Cart</h3>

                {cart.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.service.id}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.service.name}</p>
                            <p className="text-sm text-slate-600">
                              ₹{item.service.price} x {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.service.id)}
                            className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-4 mb-4">
                      <p className="text-lg font-bold text-slate-900">
                        Total: ₹{getTotalPrice()}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowBooking(!showBooking)}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                      {showBooking ? 'Hide' : 'Book Now'}
                    </button>
                  </>
                ) : (
                  <p className="text-slate-600 text-center py-4">Cart is empty</p>
                )}
              </div>

              {/* Booking Form */}
              {showBooking && cart.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-80">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Select Date & Time</h3>

                  {/* Date Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => {
                          const isBooked = isSlotBooked(time)
                          return (
                            <button
                              key={time}
                              onClick={() => !isBooked && setSelectedTime(time)}
                              disabled={isBooked}
                              className={`px-2 py-2 rounded text-sm font-medium transition ${
                                isBooked
                                  ? 'bg-red-100 text-red-700 cursor-not-allowed opacity-50'
                                  : selectedTime === time
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                              }`}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
