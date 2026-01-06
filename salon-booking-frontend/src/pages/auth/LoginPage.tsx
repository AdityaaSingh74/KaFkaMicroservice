import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { DummyAuthService } from '../../services/dummyAuthService'
import type { LoginRequest } from '../../types'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const setError = useAuthStore((state) => state.setError)
  const [formData, setFormData] = useState<LoginRequest>({
    email: 'customer@gmail.com',
    password: 'password123',
  })
  const [loading, setLoading] = useState(false)
  const [error, setLocalError] = useState('')
  const [showTestAccounts, setShowTestAccounts] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    try {
      setLoading(true)
      const { user, token } = await apiClient.login({ email, password })
      login(user, token)
      
      // Navigate based on role
      const roleRoutes: Record<string, string> = {
        CUSTOMER: '/customer/dashboard',
        SALON_OWNER: '/salon/dashboard',
        ADMIN: '/admin/dashboard',
      }
      const route = roleRoutes[user.role] || '/customer/dashboard'
      navigate(route)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      setLocalError(errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (email: string, password: string) => {
    setFormData({ email, password })
  }

  const testAccounts = DummyAuthService.getTestUsers()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SalonHub</h1>
          <p className="text-slate-400">Book your perfect salon appointment</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-4 text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline font-semibold">
              Create one now
            </Link>
          </p>
        </div>

        {/* Test Accounts - For Development */}
        {showTestAccounts && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs mr-2">
                  🧪
                </span>
                Test Accounts (Development)
              </h3>
              <button
                onClick={() => setShowTestAccounts(false)}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {testAccounts.map((account, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickLogin(account.email, account.password)}
                  className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{account.label}</p>
                      <p className="text-xs text-slate-600">{account.email}</p>
                    </div>
                    <span className="text-blue-500 group-hover:translate-x-1 transition">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-4 p-3 bg-white rounded border border-blue-200">
              <span className="font-semibold">Password for all:</span> password123
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
