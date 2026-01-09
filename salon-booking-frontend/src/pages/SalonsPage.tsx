import { useState, useEffect } from 'react'
import { DummySalonService } from '../services/dummySalonService'
import type { Salon } from '../services/dummySalonService'
import SalonCard from '../components/common/SalonCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { apiClient } from '../services/apiClient'

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSalons()
  }, [])

  useEffect(() => {
    if (search.trim()) {
      const filtered = salons.filter(
        (salon) =>
          salon.name.toLowerCase().includes(search.toLowerCase()) ||
          salon.city.toLowerCase().includes(search.toLowerCase()) ||
          salon.address.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredSalons(filtered)
    } else {
      setFilteredSalons(salons)
    }
  }, [search, salons])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      setError(null)
      // Using dummy service for now - replace with apiClient.getSalons() when backend is ready
      const data = await apiClient.getSalons(1, 10)
      setSalons(data.salons)
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch salons'
      console.error('Failed to fetch salons:', error)
      setError(errorMsg)
      setSalons([])  // ✅ Set empty array on error
      setFilteredSalons([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Explore Salons</h1>
        <p className="text-slate-600 text-lg">Find and book from {salons?.length || 0} verified salons</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error Loading Salons</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8 md:mb-10">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, city, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 md:py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition-all duration-200"
          />
        </div>
        {search && (
          <p className="mt-2 text-sm text-slate-600">
            Found {filteredSalons?.length || 0} result{(filteredSalons?.length || 0) !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Salons Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-slate-900 font-medium text-lg">Failed to load salons</p>
          <button
            onClick={fetchSalons}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredSalons && filteredSalons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredSalons.map((salon) => (
            <SalonCard key={salon.id || salon._id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-slate-900 font-medium text-lg">
            {search ? 'No salons found matching your search' : 'No salons available'}
          </p>
          <p className="text-slate-600 text-sm mt-2">
            {search ? 'Try a different search term' : 'Check back soon for new salons'}
          </p>
        </div>
      )}
    </div>
  )
}
