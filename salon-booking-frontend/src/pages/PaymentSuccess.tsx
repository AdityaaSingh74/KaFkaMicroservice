import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Booking, Salon, Service } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function PaymentSuccess() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [salon, setSalon] = useState<Salon | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!bookingId) {
          setError('Booking ID not found')
          return
        }

        // Fetch booking details
        const bookingData = await apiClient.getBookingById(bookingId)
        setBooking(bookingData)

        // Fetch salon details if available
        if (bookingData.salonId) {
          const salonData = await apiClient.getSalonById(bookingData.salonId)
          setSalon(salonData)
        }

        // Fetch service details if available
        if (bookingData.serviceId) {
          const serviceData = await apiClient.getServiceById(bookingData.serviceId)
          setService(serviceData)
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch booking details'
        console.error('Error fetching booking details:', err)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-red-200 p-8 text-center">
          <div className="text-6xl text-red-500 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/customer/bookings')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border-2 border-green-200 p-8 md:p-12 text-center mb-8 shadow-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 text-lg mb-8">Your appointment has been successfully booked and payment has been received.</p>

          {/* Booking Reference */}
          {booking && (
            <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
              <p className="text-slate-600 text-sm font-medium mb-2">Booking Reference</p>
              <p className="text-2xl font-bold text-slate-900 font-mono break-all">{booking.id}</p>
            </div>
          )}
        </div>

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Salon Details */}
              {salon && (
                <div className="border-b md:border-b-0 md:border-r border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Salon Details</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Name</p>
                      <p className="text-slate-900 font-semibold">{salon.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Address</p>
                      <p className="text-slate-700">{salon.address}</p>
                    </div>
                    {salon.phone && (
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Phone</p>
                        <p className="text-slate-700">{salon.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Appointment Details</h2>
                <div className="space-y-3">
                  {service && (
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Service</p>
                      <p className="text-slate-900 font-semibold">{service.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Date</p>
                    <p className="text-slate-900 font-semibold">
                      {new Date(booking.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Time</p>
                    <p className="text-slate-900 font-semibold">{booking.time}</p>
                  </div>
                  {service && (
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Duration</p>
                      <p className="text-slate-700">{service.duration} minutes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {booking && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Payment Summary</h2>
            <div className="space-y-3 pb-6 border-b border-slate-200">
              {service && (
                <div className="flex justify-between">
                  <span className="text-slate-600">{service.name}</span>
                  <span className="text-slate-900 font-semibold">₹{service.price.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-6">
              <span className="text-slate-900 font-bold text-lg">Total Amount Paid</span>
              <span className="text-3xl font-bold text-green-600">₹{booking.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-slate-600 text-sm mt-4">Status: <span className="font-semibold text-green-600">{booking.status}</span></p>
          </div>
        )}

        {/* Additional Notes */}
        {booking && booking.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Your Notes</h3>
            <p className="text-blue-800">{booking.notes}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-amber-900 mb-3">📋 What's Next?</h3>
          <ul className="text-amber-900 space-y-2">
            <li>✓ A confirmation email will be sent to you shortly</li>
            <li>✓ You can check your booking status in "My Bookings"</li>
            <li>✓ The salon will contact you if they need to confirm or reschedule</li>
            <li>✓ You can cancel or modify your booking up to 24 hours before the appointment</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition text-center"
          >
            View All Bookings
          </button>
          <button
            onClick={() => navigate('/salons')}
            className="px-6 py-4 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold transition text-center"
          >
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  )
}
