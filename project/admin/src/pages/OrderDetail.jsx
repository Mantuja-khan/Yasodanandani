import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck, User, MapPin, CreditCard, DollarSign } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const statusOptions = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ]

  const paymentStatusOptions = [
    { value: 'pending', label: 'Payment Pending' },
    { value: 'completed', label: 'Payment Received' },
    { value: 'failed', label: 'Payment Failed' }
  ]

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

  const updateOrderStatus = async (newStatus, trackingNumber = '') => {
    try {
      setUpdating(true)
      await axios.put(`https://yasodanandani.onrender.com/api/orders/${id}/status`, {
        orderStatus: newStatus,
        trackingNumber
      })
      
      setOrder(prev => ({
        ...prev,
        orderStatus: newStatus,
        trackingNumber: trackingNumber || prev.trackingNumber
      }))
      
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const updatePaymentStatus = async (paymentStatus) => {
    try {
      setUpdating(true)
      await axios.put(`https://yasodanandani.onrender.com/api/orders/${id}/payment-status`, {
        paymentStatus
      })
      
      setOrder(prev => ({
        ...prev,
        paymentResult: {
          ...prev.paymentResult,
          status: paymentStatus
        }
      }))
      
      toast.success('Payment status updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payment status')
    } finally {
      setUpdating(false)
    }
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    if (newStatus === 'shipped') {
      const trackingNumber = prompt('Enter tracking number:')
      if (trackingNumber) {
        updateOrderStatus(newStatus, trackingNumber)
      }
    } else {
      updateOrderStatus(newStatus)
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block btn-primary">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/orders"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orders</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <div className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={order.orderStatus}
                onChange={handleStatusChange}
                disabled={updating}
                className="input-field disabled:opacity-50"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {order.trackingNumber && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Tracking Number: {order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Payment Status for COD Orders */}
          {order.paymentMethod === 'cod' && (
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Status (COD)</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentResult?.status || 'pending')}`}>
                  {order.paymentResult?.status === 'completed' ? 'Payment Received' : 
                   order.paymentResult?.status === 'failed' ? 'Payment Failed' : 'Payment Pending'}
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Payment Status
                </label>
                <select
                  value={order.paymentResult?.status || 'pending'}
                  onChange={(e) => updatePaymentStatus(e.target.value)}
                  disabled={updating}
                  className="input-field disabled:opacity-50"
                >
                  {paymentStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Update payment status when cash is received from the customer during delivery.
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
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
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-gray-900">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
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
                  <span>{formatPrice(order.totalAmount)}</span>
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
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
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

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {order.orderStatus === 'pending' && (
                <button
                  onClick={() => updateOrderStatus('confirmed')}
                  disabled={updating}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Confirm Order
                </button>
              )}
              
              {order.orderStatus === 'confirmed' && (
                <button
                  onClick={() => updateOrderStatus('processing')}
                  disabled={updating}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Start Processing
                </button>
              )}
              
              {order.orderStatus === 'processing' && (
                <button
                  onClick={() => {
                    const trackingNumber = prompt('Enter tracking number:')
                    if (trackingNumber) {
                      updateOrderStatus('shipped', trackingNumber)
                    }
                  }}
                  disabled={updating}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Mark as Shipped
                </button>
              )}
              
              {order.orderStatus === 'shipped' && (
                <button
                  onClick={() => updateOrderStatus('delivered')}
                  disabled={updating}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Mark as Delivered
                </button>
              )}

              {/* COD Payment Actions */}
              {order.paymentMethod === 'cod' && order.paymentResult?.status !== 'completed' && (
                <button
                  onClick={() => updatePaymentStatus('completed')}
                  disabled={updating}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Mark Payment Received
                </button>
              )}
              
              {!['delivered', 'cancelled'].includes(order.orderStatus) && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order?')) {
                      updateOrderStatus('cancelled')
                    }
                  }}
                  disabled={updating}
                  className="w-full btn-danger disabled:opacity-50"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail