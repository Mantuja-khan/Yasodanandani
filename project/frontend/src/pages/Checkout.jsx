import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India'
  })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const subtotal = getCartTotal()
  const total = subtotal // No shipping or tax charges

  const handleAddressChange = (e) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateAddress = () => {
    const required = ['street', 'city', 'state', 'zipCode']
    for (let field of required) {
      if (!shippingAddress[field].trim()) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return

    try {
      setLoading(true)

      // Create order
      const orderData = {
        orderItems: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod
      }

      const orderResponse = await axios.post('/api/orders', orderData)
      const order = orderResponse.data

      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const paymentResponse = await axios.post('/api/payments/create-order', {
          orderId: order._id
        })

        const options = {
          key: paymentResponse.data.key,
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency,
          name: 'ShopEase',
          description: `Order #${order._id}`,
          order_id: paymentResponse.data.id,
          handler: async function (response) {
            try {
              // Verify payment
              await axios.post('/api/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              })

              clearCart()
              toast.success('Order placed successfully!')
              navigate(`/orders/${order._id}`)
            } catch (error) {
              toast.error('Payment verification failed')
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ''
          },
          theme: {
            color: '#3b82f6'
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Cash on Delivery
        clearCart()
        toast.success('Order placed successfully!')
        navigate(`/orders/${order._id}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
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
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
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
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
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
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
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
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary-600"
                />
                <div>
                  <p className="font-medium text-gray-900">Online Payment</p>
                  <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary-600"
                />
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Tax</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                🎉 No shipping or tax charges!
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 btn-primary py-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Place Order - ₹${total.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout