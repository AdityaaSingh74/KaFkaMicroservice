import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon, Service, Booking } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuthStore } from '../store/authStore'

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookingConfirmation() {
  const { salonId, serviceId } = useParams<{ salonId: string; serviceId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = useAuthStore((state) => state.user)

  const [salon, setSalon] = useState<Salon | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Initialize with today's date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [])

  // Fetch salon and service details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        if (salonId) {
          const salonData = await apiClient.getSalonById(salonId)
          setSalon(salonData)
        }

        if (serviceId) {
          const serviceData = await apiClient.getServiceById(serviceId)
          setService(serviceData)
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch details'
        console.error('Error fetching details:', err)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [salonId, serviceId])

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate && salonId) {
      fetchTimeSlots()
    }
  }, [selectedDate, salonId])

  const fetchTimeSlots = async () => {
    try {
      setSlotsLoading(true)
      setError(null)
      setSelectedTime('') // Reset time selection when date changes

      // Get booked slots for the selected date
      const response = await apiClient.getBookedSlots(salonId!, selectedDate)
      const bookedTimes = response.bookedTimes || []

      // Generate time slots (9 AM to 6 PM, 30-minute intervals)
      const slots: TimeSlot[] = []
      for (let hour = 9; hour < 18; hour++) {
        for (let minute of [0, 30]) {
          const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          const isBooked = bookedTimes.includes(timeStr)
          slots.push({
            time: timeStr,
            available: !isBooked,
          })
        }
      }

      setTimeSlots(slots)
    } catch (err: any) {
      console.error('Error fetching time slots:', err)
      // Fallback: Generate default slots if API fails
      const slots: TimeSlot[] = []
      for (let hour = 9; hour < 18; hour++) {
        for (let minute of [0, 30]) {
          const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          slots.push({ time: timeStr, available: true })
        }
      }
      setTimeSlots(slots)
    } finally {
      setSlotsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    if (!selectedDate) {
      setError('Please select a date')
      return false
    }
    if (!selectedTime) {
      setError('Please select a time slot')
      return false
    }
    if (!salon || !service) {
      setError('Salon or service information is missing')
      return false
    }
    setError(null)
    return true
  }

  const handleConfirmAndPay = async () => {
    try {
      if (!validateForm()) return

      setSubmitting(true)
      setError(null)

      if (!user || !user.id) {
        setError('User information not found. Please login first.')
        navigate('/login')
        return
      }

      // Step 1: Create booking
      const bookingData = {
        userId: user.id,
        salonId: salonId!,
        serviceId: serviceId!,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        notes: notes || undefined,
      }

      console.log('Creating booking with data:', bookingData)
      const bookingResponse = await apiClient.createBooking(bookingData)
      const bookingId = bookingResponse.id || bookingResponse.bookingId

      console.log('Booking created:', bookingId)

      // Step 2: Create payment
      if (!service || !service.price) {
        setError('Service price not found')
        return
      }

      const paymentData = {
        bookingId: bookingId,
        amount: service.price,
        paymentMethod: 'STRIPE',
      }

      console.log('Creating payment with data:', paymentData)
      const paymentResponse = await apiClient.createPaymentLink(paymentData)
      const stripeLink = paymentResponse.paymentLink || paymentResponse.checkoutUrl

      console.log('Payment link:', stripeLink)

      if (stripeLink) {
        // Redirect to Stripe checkout
        window.location.href = stripeLink
      } else {
        // Fallback: Navigate to success page if no stripe link
        navigate(`/payment-success/${bookingId}`)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to process booking and payment'
      console.error('Error:', err)
      setError(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 1) // Minimum tomorrow
    return today.toISOString().split('T')[0]
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Confirm Your Booking</h1>
          <p className="text-slate-600 mt-2">Review and confirm your appointment details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleConfirmAndPay()
              }}
              className="space-y-8"
            >
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-semibold">Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {/* Salon & Service Info */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Service Details</h2>
                {salon && (
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <p className="text-slate-600 text-sm font-medium">Salon</p>
                    <p className="text-slate-900 font-semibold">{salon.name}</p>
                    <p className="text-slate-600 text-sm mt-1">{salon.address}</p>
                  </div>
                )}
                {service && (
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Service</p>
                    <p className="text-slate-900 font-semibold">{service.name}</p>
                    {service.description && <p className="text-slate-600 text-sm mt-1">{service.description}</p>}
                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-slate-600">Duration</span>
                      <span className="text-slate-900 font-semibold">{service.duration} mins</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Select Date</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Select Time</h2>
                {slotsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`py-3 px-3 rounded-lg font-medium text-sm transition ${
                          selectedTime === slot.time
                            ? 'bg-blue-600 text-white'
                            : slot.available
                              ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                              : 'bg-red-50 text-red-400 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">No time slots available for this date</p>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Additional Notes (Optional)</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special requests or notes for the salon..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !selectedDate || !selectedTime}
                className={`w-full py-4 rounded-lg font-bold text-lg text-white transition ${
                  submitting || !selectedDate || !selectedTime
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {submitting ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 pb-6 border-b border-slate-200">
                {service && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">{service.name}</span>
                      <span className="text-slate-900 font-semibold">₹{service.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Duration</span>
                      <span>{service.duration} mins</span>
                    </div>
                  </>
                )}
              </div>

              {selectedDate && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Date:</span>
                    <span className="text-slate-900 font-semibold">
                      {new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {selectedTime && (
                    <div className="flex justify-between text-slate-600">
                      <span>Time:</span>
                      <span className="text-slate-900 font-semibold">{selectedTime}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{service?.price.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Note:</span> You will be redirected to Stripe for secure payment processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
