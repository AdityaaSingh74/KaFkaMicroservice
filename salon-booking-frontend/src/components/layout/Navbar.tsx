import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return null
    switch (user.role) {
      case 'CUSTOMER':
        return '/customer/dashboard'
      case 'SALON':
        return '/salon/dashboard'
      case 'ADMIN':
        return '/admin/dashboard'
      default:
        return null
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 md:px-8 py-3 md:py-4 flex justify-between items-center">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
          <span className="text-2xl">💇</span>
          <span className="hidden sm:inline">Salon Booking</span>
          <span className="sm:hidden">SB</span>
        </Link>

        {/* Center Navigation */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <Link to="/" className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/salons" className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200">
              Salons
            </Link>
          </li>
          {user && (
            <li>
              <Link to={getDashboardLink() || '/'} className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200">
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Right Actions */}
        <div className="flex gap-2 md:gap-3 items-center">
          {user ? (
            <>
              <span className="text-slate-700 font-medium hidden sm:inline px-3 py-2">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-700 text-white rounded-md font-medium hover:bg-slate-800 transition-colors duration-200 text-sm md:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 md:px-4 py-2 border border-slate-700 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors duration-200 text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 md:px-4 py-2 bg-slate-700 text-white rounded-md font-medium hover:bg-slate-800 transition-colors duration-200 text-sm md:text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-4 pb-3 border-t border-gray-100">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/salons" className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors duration-200">
              Salons
            </Link>
          </li>
          {user && (
            <li>
              <Link to={getDashboardLink() || '/'} className="block text-slate-700 hover:text-slate-900 font-medium py-2 transition-colors duration-200">
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
