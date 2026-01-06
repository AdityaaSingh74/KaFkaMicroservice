import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import { Salon, Service } from '../types'
import ServiceCard from '../components/common/ServiceCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuthStore } from '../store/authStore'

export default function SalonDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [salon, setSalon] = useState<Salon | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) fetchSalonDetails()
  }, [id])

  const fetchSalonDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const salonData = await apiClient.getSalonById(id!)
      const servicesResponse = await apiClient.getServicesBySalonId(id!, 1, 20)
      setSalon(salonData)
      // Handle both direct array and wrapped response
      setServices(Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse.services || []))
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch salon details'
      console.error('Failed to fetch salon details:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleBookService = (service: Service) => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate(`/book/${salon?.id}/${service.id}`)
  }

  if (loading) return <LoadingSpinner />
  if (!salon)
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">Salon not found</p>
        <button
          onClick={() => navigate('/salons')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Back to Salons
        </button>
      </div>
    )

  return (
    <div>
      {/* Salon Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-10 md:mb-12">
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 h-80 md:h-96">
          <img
            src={salon.image || 'https://images.unsplash.com/photo-1633621821756-e60dab7fc92f?w=800&h=400&fit=crop'}
            alt={salon.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.unsplash.com/photo-1633621821756-e60dab7fc92f?w=800&h=400&fit=crop'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6">
            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{salon.name}</h1>
              <div className="space-y-2 mb-5">
                <p className="text-slate-700 text-lg flex items-start gap-2">
                  <span className="text-xl mt-1">📍</span>
                  <span>{salon.address}</span>
                </p>
                <p className="text-slate-600 flex items-center gap-2">
                  <span className="text-lg">🏙️</span>
                  <span>{salon.city}</span>
                </p>
                {salon.phone && (
                  <p className="text-slate-600 flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <span>{salon.phone}</span>
                  </p>
                )}
              </div>
              {salon.description && <p className="text-slate-700 leading-relaxed">{salon.description}</p>}
            </div>

            {/* Rating Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200 h-fit">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-slate-900 mb-2">{salon.rating.toFixed(1)}</div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(salon.rating) ? 'text-yellow-500 text-lg' : 'text-slate-300 text-lg'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600">Based on customer reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error Loading Services</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Services Section */}
      <section className="mb-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Available Services</h2>
          <p className="text-slate-600 text-lg">{services.length} service{services.length !== 1 ? 's' : ''} available</p>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} onBook={handleBookService} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-lg">No services available at this moment</p>
          </div>
        )}
      </section>
    </div>
  )
}
