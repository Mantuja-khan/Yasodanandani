import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        }
      })
    }

  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const success = await updateProfile(profileData)
      if (success) {
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    try {
      const success = await updateProfile({
        password: passwordData.newPassword
      })
      if (success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        toast.success('Password updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-600 text-white rounded-full h-12 w-12 flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="input-field pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input-field pl-10 bg-gray-50"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="input-field pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={profileData.address.street}
                        onChange={handleProfileChange}
                        className="input-field"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={profileData.address.city}
                        onChange={handleProfileChange}
                        className="input-field"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={profileData.address.state}
                        onChange={handleProfileChange}
                        className="input-field"
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={profileData.address.zipCode}
                        onChange={handleProfileChange}
                        className="input-field"
                        placeholder="Enter ZIP code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={profileData.address.country}
                        onChange={handleProfileChange}
                        className="input-field"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-10"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-10"
                      placeholder="Enter new password"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-10"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{loading ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile