import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Home() {
  const navigate = useNavigate()
  const [salons, setSalons] = useState<Salon[]>([])
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const cities = ['all', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune']
  const itemsPerPage = 12

  useEffect(() => {
    fetchSalons()
  }, [])

  useEffect(() => {
    filterSalons()
  }, [searchQuery, selectedCity, salons])

  const fetchSalons = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getSalons(1, 100) // Fetch more for filtering
      const salonList = Array.isArray(data) ? data : data.data || data.salons || []
      setSalons(salonList)
    } catch (err: any) {
      console.error('Error fetching salons:', err)
      setError(err.response?.data?.message || 'Failed to load salons')
    } finally {
      setLoading(false)
    }
  }

  const filterSalons = () => {
    let filtered = salons

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(
        (salon) => salon.city?.toLowerCase() === selectedCity.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (salon) =>
          salon.name?.toLowerCase().includes(query) ||
          salon.address?.toLowerCase().includes(query) ||
          salon.city?.toLowerCase().includes(query)
      )
    }

    setFilteredSalons(filtered)
    setCurrentPage(1)
  }

  const getPaginatedSalons = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredSalons.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredSalons.length / itemsPerPage)
  const paginatedSalons = getPaginatedSalons()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Salon</h1>
          <p className="text-xl mb-8 opacity-90">Book appointments at the best salons in your city</p>

          {/* Search Bar */}
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by salon name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={() => navigate('/customer/bookings')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Filter by City</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 font-medium">
            Found {filteredSalons.length} salon{filteredSalons.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Salons Grid */}
        {paginatedSalons.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedSalons.map((salon) => (
                <div
                  key={salon.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/salons/${salon.id}`)}
                >
                  {/* Salon Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-6xl">💇</span>
                  </div>

                  {/* Salon Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{salon.name}</h3>
                    <p className="text-slate-600 mb-2 flex items-center gap-2">
                      <span>📍</span> {salon.address}
                    </p>
                    <p className="text-slate-600 mb-3 flex items-center gap-2">
                      <span>🏙️</span> {salon.city}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="font-bold text-slate-900">{salon.rating || 'N/A'}</span>
                      <span className="text-slate-600 text-sm">({salon.totalReviews || 0} reviews)</span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {salon.description || 'Professional salon services'}
                    </p>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <span>📞 {salon.phone}</span>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/salons/${salon.id}`)
                      }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      View & Book
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-slate-600 mb-4">🔍 No salons found</p>
            <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCity('all')
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
