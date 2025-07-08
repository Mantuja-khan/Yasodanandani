import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, ShoppingCart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(formData.email, formData.password)
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSendResetOTP = async (e) => {
    e.preventDefault()
    if (!forgotPasswordData.email) return

    try {
      setForgotPasswordLoading(true)
      await axios.post('/api/auth/forgot-password', { email: forgotPasswordData.email })
      toast.success('Password reset OTP sent to your email')
      setForgotPasswordStep(2)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset OTP')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleVerifyResetOTP = async (e) => {
    e.preventDefault()
    if (!forgotPasswordData.otp || forgotPasswordData.otp.length !== 6) return
    setForgotPasswordStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (forgotPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setForgotPasswordLoading(true)
      await axios.post('/api/auth/reset-password', {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp,
        newPassword: forgotPasswordData.newPassword
      })
      toast.success('Password reset successfully! You can now login with your new password.')
      setShowForgotPassword(false)
      setForgotPasswordStep(1)
      setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="bg-red-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't worry, we'll help you reset your password
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {[
              { number: 1, label: 'Email' },
              { number: 2, label: 'Verify' },
              { number: 3, label: 'Reset' }
            ].map((stepInfo, index) => (
              <div key={stepInfo.number} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
                  forgotPasswordStep >= stepInfo.number 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepInfo.number}
                </div>
                <span className={`ml-1 md:ml-2 text-xs md:text-sm font-medium ${
                  forgotPasswordStep >= stepInfo.number ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stepInfo.label}
                </span>
                {index < 2 && (
                  <div className={`w-4 md:w-8 h-0.5 ml-2 md:ml-4 transition-all duration-300 ${
                    forgotPasswordStep > stepInfo.number ? 'bg-red-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            {/* Step 1: Email */}
            {forgotPasswordStep === 1 && (
              <form onSubmit={handleSendResetOTP} className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 text-center">Enter your email</h3>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      required
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 text-sm md:text-base"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading || !forgotPasswordData.email}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 text-sm md:text-base"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP */}
            {forgotPasswordStep === 2 && (
              <form onSubmit={handleVerifyResetOTP} className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 text-center">Verify OTP</h3>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    We've sent a reset code to <span className="font-medium text-red-600">{forgotPasswordData.email}</span>
                  </p>
                  <label htmlFor="reset-otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="reset-otp"
                      name="otp"
                      type="text"
                      maxLength="6"
                      required
                      value={forgotPasswordData.otp}
                      onChange={handleForgotPasswordChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep(1)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 text-sm md:text-base"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!forgotPasswordData.otp || forgotPasswordData.otp.length !== 6}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 text-sm md:text-base"
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {forgotPasswordStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 text-center">Set New Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="new-password"
                          name="newPassword"
                          type="password"
                          required
                          value={forgotPasswordData.newPassword}
                          onChange={handleForgotPasswordChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirm-new-password"
                          name="confirmPassword"
                          type="password"
                          required
                          value={forgotPasswordData.confirmPassword}
                          onChange={handleForgotPasswordChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep(2)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 text-sm md:text-base"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 text-sm md:text-base"
                  >
                    {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="bg-primary-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Welcome to ShopEase
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account and start shopping
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 text-sm md:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Sign up here
              </a>
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>🔐 Demo Account:</strong><br />
              Email: <span className="font-mono">demo@shopease.com</span><br />
              Password: <span className="font-mono">demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login