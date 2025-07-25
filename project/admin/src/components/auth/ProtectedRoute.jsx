import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute