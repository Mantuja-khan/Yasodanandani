import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, isAdmin: true }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isAdmin: false }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set up axios interceptor
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token validity
      fetchProfile()
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://yasodanandani.onrender.com/api/auth/profile')
      if (response.data.role === 'admin') {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
      } else {
        localStorage.removeItem('adminToken')
        delete axios.defaults.headers.common['Authorization']
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await axios.post('https://yasodanandani.onrender.com/api/auth/login', { email, password })
      
      const { token, ...user } = response.data
      
      if (user.role !== 'admin') {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Access denied. Admin privileges required.' })
        toast.error('Access denied. Admin privileges required.')
        return false
      }

      localStorage.setItem('adminToken', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      toast.success('Login successful!')
      return true
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message })
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const value = {
    ...state,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}