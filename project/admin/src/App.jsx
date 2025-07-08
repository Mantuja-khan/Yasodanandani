import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Users from './pages/Users'
import Offers from './pages/Offers'
import AddOffer from './pages/AddOffer'
import Applications from './pages/Applications'
import ApplicationDetail from './pages/ApplicationDetail'
import Login from './pages/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="sidebar-overlay lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            {/* Main Content */}
            <main className="main-content-with-sidebar mobile-main-content">
              <div className="p-3 md:p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/add" element={<AddProduct />} />
                  <Route path="/products/edit/:id" element={<EditProduct />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/offers/add" element={<AddOffer />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/applications/:id" element={<ApplicationDetail />} />
                </Routes>
              </div>
            </main>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App