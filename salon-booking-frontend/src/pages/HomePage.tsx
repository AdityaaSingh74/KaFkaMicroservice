import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon } from '../types'
import SalonCard from '../components/common/SalonCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalons()
  }, [])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getSalons()
      setSalons(data.slice(0, 6)) // Featured salons
    } catch (error) {
      console.error('Failed to fetch salons:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen relative -ml-[calc((100vw-100%)/2)]">
      {/* Hero Section - Full Width Edge to Edge */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight max-w-3xl">
              Book Your Perfect Salon Experience
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 md:mb-10 max-w-2xl leading-relaxed">
              Discover top-rated salons, browse services, and book instantly. Get the best pampering experience at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/salons"
                className="inline-block bg-white text-slate-900 px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-slate-50 transition-colors duration-200 text-center"
              >
                Browse Salons
              </Link>
              <Link
                to="/register"
                className="inline-block border-2 border-white text-white px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-200 text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Back to normal width constraint */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Featured Salons Section */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Featured Salons</h2>
            <p className="text-slate-600 text-lg">Handpicked salons offering premium services</p>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : salons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {salons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <p className="text-slate-600 text-lg">No salons available yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8 md:p-12 border border-slate-200">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 text-center">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-3">500+</div>
              <p className="text-slate-700 font-medium text-lg">Verified Salons</p>
              <p className="text-slate-600 text-sm mt-2">Quality assured partners</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-3">10K+</div>
              <p className="text-slate-700 font-medium text-lg">Happy Customers</p>
              <p className="text-slate-600 text-sm mt-2">Real reviews & ratings</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-3">50K+</div>
              <p className="text-slate-700 font-medium text-lg">Bookings Monthly</p>
              <p className="text-slate-600 text-sm mt-2">Trusted platform</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
