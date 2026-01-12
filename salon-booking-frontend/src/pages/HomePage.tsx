import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon } from '../types'
import SalonCard from '../components/common/SalonCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { isLoggedIn, doLogin, doLogout, getUsername } from '../services/keycloakService'

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const loggedIn = isLoggedIn()
  const username = getUsername()

  useEffect(() => {
    fetchSalons()
  }, [])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getSalons()
      setSalons(data.slice(0, 6))
    } catch (error) {
      console.error('Failed to fetch salons:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen relative -ml-[calc((100vw-100%)/2)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Login Status */}
          <div className="mb-6 flex justify-end">
            {loggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-200">Welcome, {username}!</span>
                <button
                  onClick={doLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={doLogin}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                Login with Keycloak
              </button>
            )}
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Book Your Perfect Salon Experience
          </h1>
          <p className="text-lg text-slate-200 mb-8">
            Discover top-rated salons and book instantly
          </p>
          <div className="flex gap-4">
            <Link
              to="/salons"
              className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold"
            >
              Browse Salons
            </Link>
            <Link
              to="/register"
              className="border-2 border-white px-6 py-3 rounded-lg font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Salons */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Salons</h2>

        {loading ? (
          <LoadingSpinner />
        ) : salons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <p>No salons available</p>
        )}
      </div>
    </div>
  )
}