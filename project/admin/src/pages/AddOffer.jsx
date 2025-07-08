import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Search, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddOffer = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://yasodanandani.onrender.com/api/products?limit=100')
      setProducts(response.data.products)
    } catch (error) {
      toast.error('Failed to fetch products')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleProductSelect = (product) => {
    if (selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter(p => p._id !== product._id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const removeSelectedProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const offerData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        products: selectedProducts.map(p => p._id)
      }

      await axios.post('https://yasodanandani.onrender.com/api/offers', offerData)
      toast.success('Offer created successfully')
      navigate('/offers')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create offer')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedProducts.find(p => p._id === product._id)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/offers"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Offers</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Offer</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter offer title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="input-field"
                    placeholder="Enter offer description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Amount
                    </label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={formData.minOrderAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount Amount
                    </label>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={formData.maxDiscountAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    min="1"
                    className="input-field"
                    placeholder="Unlimited"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Offer is active
                  </label>
                </div>
              </div>
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Products ({selectedProducts.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProducts.map((product) => (
                    <div key={product._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-sm text-gray-600">₹{product.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedProduct(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Product Selection */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Products</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="card p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Creating Offer...' : 'Create Offer'}
                </button>
                
                <Link
                  to="/offers"
                  className="w-full btn-secondary block text-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddOffer