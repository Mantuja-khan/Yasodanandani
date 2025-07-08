import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag,
  MessageSquare,
  LogOut,
  X,
  Crown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth()

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/offers', icon: Tag, label: 'Offers' },
    { to: '/applications', icon: MessageSquare, label: 'Applications' },
  ]

  return (
    <div className={`sidebar-fixed bg-gray-900 text-white w-64 ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
              <Crown className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold">Yasoda Nandani</span>
              <span className="text-xs text-pink-300">Admin Panel</span>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 text-sm md:text-base text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg ${
                  isActive ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : ''
                }`
              }
            >
              <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            logout()
            onClose()
          }}
          className="flex items-center space-x-3 px-3 py-2.5 text-sm md:text-base text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full rounded-lg"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar