import { Link } from 'react-router-dom'
import { Crown, Mail, Phone, MapPin, Heart, Instagram, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg shadow-lg">
                <Crown className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold">Yasoda Nandani</span>
                <span className="text-xs text-pink-300">Ladies Kurties Collection</span>
              </div>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md text-sm md:text-base">
              Your trusted destination for beautiful and comfortable kurties. 
              We specialize in elegant designs for the modern Indian woman.
            </p>
            <div className="flex flex-col space-y-2 text-sm md:text-base">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 93588 53990</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>hello@yasodanandani.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-pink-300">Quick Links</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link to="/" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Kurties Collection
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-pink-300 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-pink-300 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-pink-300">Customer Care</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm md:text-base text-gray-300">Follow us:</span>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-xs md:text-sm text-gray-300">Made with love for Indian women</span>
              <Heart className="h-4 w-4 text-pink-400" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
          <p className="text-gray-300 text-xs md:text-sm">
            © {new Date().getFullYear()} Yasoda Nandani. All rights reserved. | Exclusively for Women's Fashion
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer