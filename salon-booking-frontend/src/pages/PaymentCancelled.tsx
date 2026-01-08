import { useNavigate } from 'react-router-dom'

export default function PaymentCancelled() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl border-2 border-red-200 p-8 md:p-12 text-center shadow-lg">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">×</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-2">Payment Cancelled</h1>
          <p className="text-slate-600 text-lg mb-8">
            Your payment was not completed. Your booking has been cancelled and no amount has been charged.
          </p>

          {/* Information Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <p className="text-orange-900 text-base">
              If you encountered any issues during payment, please try again. If the problem persists, you can contact our support team.
            </p>
          </div>

          {/* Reason Options */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Why might this happen?</h3>
            <ul className="text-slate-700 space-y-2">
              <li>• You cancelled the payment on Stripe's checkout page</li>
              <li>• Your payment method was declined</li>
              <li>• The payment session expired</li>
              <li>• Network or connection issues</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition text-center"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/salons')}
            className="px-6 py-4 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold transition text-center"
          >
            Browse Salons
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6 text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-slate-600 mb-4">If you continue to experience issues, please contact our support team.</p>
          <a
            href="mailto:support@example.com"
            className="inline-block px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
