import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth()

  // While checking auth (on refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Role-based protection (optional)
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  // Allowed
  return children
}
