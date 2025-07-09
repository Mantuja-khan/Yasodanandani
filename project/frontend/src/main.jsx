import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

// Set up axios defaults for production
import axios from 'axios'

// Configure axios base URL for production
if (import.meta.env.PROD) {
  // Replace with your actual backend URL
  axios.defaults.baseURL = 'https://your-backend-url.onrender.com'
} else {
  axios.defaults.baseURL = 'http://localhost:5000'
}

// Add request interceptor for better error handling
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Response error:', error)
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network error - check if backend is running')
    }
    return Promise.reject(error)
  }
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)