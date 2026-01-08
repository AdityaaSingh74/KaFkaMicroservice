import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SalonDetails from './pages/SalonDetails'
import PaymentPage from './pages/PaymentPage'
import CustomerDashboard from './pages/customer/Dashboard'
import SalonOwnerDashboard from './pages/salon/Dashboard'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/salons/:salonId" element={<SalonDetails />} />
        
        {/* Payment Route */}
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        
        {/* Customer Routes */}
        <Route path="/customer/bookings" element={<CustomerDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        
        {/* Salon Owner Routes */}
        <Route path="/salon/dashboard" element={<SalonOwnerDashboard />} />
        <Route path="/salon/:salonId/dashboard" element={<SalonOwnerDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
