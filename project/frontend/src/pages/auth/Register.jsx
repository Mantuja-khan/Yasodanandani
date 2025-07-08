import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, Lock, Eye, EyeOff, Phone, MapPin, Heart, Sparkles, Crown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Register = () => {
  const [step, setStep] = useState(1) // 1: Email & OTP, 2: Complete Registration
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const { verifyOTPAndRegister } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!formData.email) return

    try {
      setLoading(true)
      await axios.post('https://yasodanandani.onrender.com/api/auth/send-otp', { email: formData.email })
      toast.success('OTP sent to your email! Please check your inbox.')
      setOtpSent(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }
    setStep(2)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const success = await verifyOTPAndRegister(
        formData.email,
        formData.otp,
        formData.name,
        formData.password,
        formData.phone,
        formData.address
      )

      if (success) {
        toast.success('Welcome to Yasoda Nandani! Your account has been created successfully.')
        navigate('/')
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 md:p-4 rounded-full w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Crown className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Join Yasoda Nandani
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Create your account and discover beautiful kurties
          </p>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <span className="text-xs md:text-sm text-pink-600 font-medium">Exclusively for Women</span>
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
              step >= 1 ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`ml-1 md:ml-2 text-xs md:text-sm font-medium ${step >= 1 ? 'text-pink-600' : 'text-gray-500'}`}>
              Verify Email
            </span>
          </div>
          <div className={`w-4 md:w-8 h-0.5 transition-all duration-300 ${step > 1 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
              step >= 2 ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`ml-1 md:ml-2 text-xs md:text-sm font-medium ${step >= 2 ? 'text-pink-600' : 'text-gray-500'}`}>
              Complete Profile
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl shadow-xl border border-white/20">
          {/* Step 1: Email & OTP */}
          {step === 1 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h2>
                <p className="text-sm md:text-base text-gray-600">Enter your email to receive verification code</p>
              </div>

              <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-4">
                {!otpSent ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-pink-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <p className="text-xs md:text-sm text-gray-600 mb-3">
                      We've sent a 6-digit code to <span className="font-medium text-pink-600">{formData.email}</span>
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Sparkles className="h-5 w-5 text-pink-400" />
                      </div>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength="6"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                        placeholder="000000"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 text-sm md:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>{otpSent ? 'Verifying...' : 'Sending OTP...'}</span>
                    </div>
                  ) : (
                    otpSent ? 'Verify Code' : 'Send Verification Code'
                  )}
                </button>

                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setFormData(prev => ({ ...prev, otp: '' }))
                    }}
                    className="w-full text-pink-600 hover:text-pink-700 transition-colors text-sm font-medium"
                  >
                    Change Email Address
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Step 2: Complete Registration */}
          {step === 2 && (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                <p className="text-sm md:text-base text-gray-600">Tell us about yourself to personalize your experience</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-pink-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-pink-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-pink-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-pink-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-pink-500" />
                    Delivery Address (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Street address"
                    />
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 text-sm"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs md:text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-pink-600 hover:text-pink-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register