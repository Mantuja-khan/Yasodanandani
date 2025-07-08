import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, LogOut, Home, Info, Phone, Crown, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import yasoda from "../../../assets/yasodanandani.png"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll for bottom navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide bottom nav based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowBottomNav(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBottomNav(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Products', icon: Crown },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Phone },
    { to: '/orders', label: 'My Orders', icon: ShoppingCart, requireAuth: true }
  ]

  // Filter nav items based on authentication for mobile
  const mobileNavItems = navItems.filter(item => !item.requireAuth || isAuthenticated)

  return (
    <>
      {/* Top Navigation - Hidden on small screens */}
      <nav className="bg-white shadow-lg sticky top-0 z-30 border-b-2 border-pink-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">

              <div className="flex items-center gap-3">
                {/* Logo Image */}
                <img
                  src={yasoda}// Replace with your actual logo path
                  alt="Yasoda Nandani Logo"
                  className="w-20 h-20 object-contain"
                />

                {/* Brand Name and Tagline */}

              </div>

            </Link>
            {/* Desktop Navigation - Show all nav items including Contact */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.filter(item => !item.requireAuth).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium text-sm lg:text-base flex items-center space-x-1 group"
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors group">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-pink-600 transition-colors group"
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block font-medium text-sm lg:text-base">{user?.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-pink-600 transition-colors font-medium text-sm lg:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Only Logo and Cart - REDUCED PADDING */}
      <div className="md:hidden bg-white shadow-lg sticky top-0 z-50 border-b-2 border-pink-100">
        <div className="flex justify-between items-center h-14 px-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Replace text with image */}
            <div className="flex flex-col">
              <img
                src={yasoda}
                alt="Yasoda Nandani Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>


          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-lg text-sm"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-lg font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only - REDUCED FONT SIZE */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-100 shadow-lg z-50 transition-transform duration-300 ${showBottomNav ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="flex justify-around items-center py-1.5">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.to
            const Icon = item.icon

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-200 ${isActive
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                  }`}
              >
                <Icon className={`h-4 w-4 mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="bottom-nav-text text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom padding for mobile to prevent content being hidden behind bottom nav - REDUCED */}
      <div className="md:hidden h-14"></div>
    </>
  )
}

export default Navbar