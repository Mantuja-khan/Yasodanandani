import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`https://yasodanandani.onrender.com/api/orders/${id}`)
      setOrder(response.data)
    } catch (error) {
      toast.error('Order not found')
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

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Clock },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'processing', label: 'Processing', icon: Package },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ]

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
    const currentIndex = statusOrder.indexOf(order.orderStatus)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block btn-primary">
          Back to Orders
        </Link>
      </div>
    )
  }

  const statusSteps = getStatusSteps()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orders</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-gray-600 mt-1">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
            
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              {order.trackingNumber && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Tracking: {order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.key} className="relative flex items-center">
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="ml-4">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        {step.current && (
                          <p className="text-sm text-gray-600">Current status</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-primary-600">
                      ₹{item.price.toLocaleString()} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                🎉 No shipping or tax charges applied
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">
                  {order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                </span>
              </div>
              
              {order.paymentResult?.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-medium text-sm">
                    {order.paymentResult.razorpay_payment_id}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-medium ${
                  order.paymentResult?.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.paymentResult?.status === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          {order.orderStatus === 'pending' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Actions</h2>
              <button className="w-full btn-secondary mb-3">
                Cancel Order
              </button>
              <p className="text-sm text-gray-600">
                You can cancel this order before it's confirmed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetail