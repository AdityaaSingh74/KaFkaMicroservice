import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

type PaymentMethod = 'card' | 'upi' | 'wallet'

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { total = 0 } = location.state || {}

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [upiId, setUpiId] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})/, '$1/')
    }

    // CVV only numbers
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue,
    })
  }

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Invalid card number')
      return false
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      setError('Invalid expiry date')
      return false
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      setError('Invalid CVV')
      return false
    }
    return true
  }

  const validateUPI = () => {
    const upiRegex = /^[a-zA-Z0-9.-]{2,}@[a-zA-Z]{2,}$/
    if (!upiRegex.test(upiId)) {
      setError('Invalid UPI ID')
      return false
    }
    return true
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!bookingId) {
        setError('Booking ID not found')
        return
      }

      // Validate based on payment method
      if (paymentMethod === 'card' && !validateCardDetails()) {
        setLoading(false)
        return
      }
      if (paymentMethod === 'upi' && !validateUPI()) {
        setLoading(false)
        return
      }

      // Simulate payment processing with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPaymentSuccess(true)

      // Redirect to booking confirmation after 2 seconds
      setTimeout(() => {
        navigate('/customer/bookings', { state: { success: true } })
      }, 2000)
    } catch (err: any) {
      console.error('Payment error:', err)
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-4">Your booking has been confirmed.</p>
          <p className="text-lg font-semibold text-slate-900 mb-4">Amount: ₹{total}</p>
          <p className="text-slate-600">Redirecting to your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment</h1>
          <p className="text-slate-600">Complete your booking by making a payment</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <p className="text-slate-600">Booking ID: {bookingId}</p>
            <p className="font-semibold text-slate-900"># {bookingId}</p>
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="text-slate-600">Amount to Pay</p>
            <p className="text-3xl font-bold text-blue-600">₹{total}</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select Payment Method</h2>

          <div className="space-y-3 mb-6">
            {(['card', 'upi', 'wallet'] as PaymentMethod[]).map((method) => (
              <label
                key={method}
                className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="ml-3 font-medium text-slate-900">
                  {method === 'card' && '💳 Debit/Credit Card'}
                  {method === 'upi' && '📱 UPI'}
                  {method === 'wallet' && '💰 Wallet'}
                </span>
              </label>
            ))}
          </div>

          {/* Payment Form */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  maxLength={19}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleCardChange}
                    maxLength={5}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-slate-700">💰 Use your wallet balance to complete this payment.</p>
              <p className="text-sm text-slate-600 mt-2">Available balance: ₹500</p>
            </div>
          )}
        </div>

        {/* Pay Button */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition font-semibold"
          >
            {loading ? 'Processing...' : `Pay ₹${total}`}
          </button>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center text-slate-600 text-sm">
          <p>🔒 Your payment is secure and encrypted</p>
        </div>
      </div>
    </div>
  )
}
