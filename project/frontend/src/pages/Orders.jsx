import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Eye, Calendar, Truck } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders')
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card p-6">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-gray-600">Start shopping to see your orders here</p>
          <Link
            to="/products"
            className="mt-6 inline-block btn-primary"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Placed on {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{order.orderItems.length} item(s)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <Link
                  to={`/orders/${order._id}`}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>

            {/* Order Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {order.orderItems.slice(0, 3).map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-primary-600">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <div className="flex items-center justify-center text-gray-500">
                  +{order.orderItems.length - 3} more items
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Payment: {order.paymentMethod === 'razorpay' ? 'Online' : 'Cash on Delivery'}</span>
                {order.trackingNumber && (
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 md:mt-0">
                <span className="text-lg font-bold text-gray-900">
                  Total: ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Delivery Address:</span>{' '}
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders