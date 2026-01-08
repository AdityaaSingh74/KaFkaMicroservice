import { useAuthStore } from '../../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

/**
 * ProtectedRoute Component
 * TESTING MODE: All authentication checks are bypassed.
 * User is always authenticated with mock data.
 * This will be re-enabled when backend is ready.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Bypass all authentication checks
  // Mock user is always available from authStore
  const user = useAuthStore((state) => state.user)

  // In testing mode, we don't check roles or redirect to login
  // Just render the children directly
  if (!user) {
    // This shouldn't happen as mock user is always available
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}
