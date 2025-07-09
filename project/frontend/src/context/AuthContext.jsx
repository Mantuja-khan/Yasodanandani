import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set up axios interceptor
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token validity
      fetchProfile()
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://yasodanandani.onrender.com/api/auth/profile')
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const sendOTP = async (email) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      await axios.post('https://yasodanandani.onrender.com/api/auth/send-otp', { email })
      toast.success('OTP sent to your email')
      return true
    } catch (error) {
      console.error('Send OTP error:', error)
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message })
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to send OTP. Please check your internet connection.'
      toast.error(errorMessage)
      return false
    }
  }

  const verifyOTPAndRegister = async (email, otp, name, password, phone, address) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await axios.post('https://yasodanandani.onrender.com/api/auth/verify-otp', {
        email, otp, name, password, phone, address
      })
      
      const { token, ...user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      toast.success('Registration successful!')
      return true
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message })
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await axios.post('https://yasodanandani.onrender.com/api/auth/login', { email, password })
      
      const { token, ...user } = response.data
      localStorage.setItem('token', token)
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
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('https://yasodanandani.onrender.com/api/auth/profile', profileData)
      dispatch({ type: 'UPDATE_USER', payload: response.data })
      toast.success('Profile updated successfully')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
      return false
    }
  }

  const value = {
    ...state,
    sendOTP,
    verifyOTPAndRegister,
    login,
    logout,
    updateProfile
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