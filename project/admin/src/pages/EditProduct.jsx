import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Upload, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    images: [''],
    specifications: {},
    tags: [],
    isActive: true
  })

  const categories = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'beauty',
    'toys',
    'other'
  ]

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://yasodanandani.onrender.com/api/products/${id}`)
      const product = response.data
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock?.toString() || '',
        images: product.images?.length ? product.images : [''],
        specifications: product.specifications || {},
        tags: product.tags || [],
        isActive: product.isActive
      })
    } catch (error) {
      toast.error('Failed to fetch product')
      navigate('/products')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        images: newImages
      }))
    }
  }

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const addSpecification = () => {
    const key = prompt('Enter specification name:')
    if (key) {
      handleSpecificationChange(key, '')
    }
  }

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }))
  }

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    setFormData(prev => ({
      ...prev,
      tags
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim())
      }

      await axios.put(`https://yasodanandani.onrender.com/api/products/${id}`, productData)
      toast.success('Product updated successfully')
      navigate('/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/products"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter product name"
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
                    rows={4}
                    className="input-field"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    className="input-field"
                    placeholder="Enter tags separated by commas"
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
                    Product is active
                  </label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
              
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="flex-1 input-field"
                      placeholder="Enter image URL"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addImageField}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Add Another Image</span>
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="btn-secondary text-sm"
                >
                  Add Specification
                </button>
              </div>
              
              <div className="space-y-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className="w-1/3">
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="input-field bg-gray-50"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        className="input-field"
                        placeholder="Enter specification value"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty if no discount
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                  placeholder="0"
                />
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
                  {loading ? 'Updating Product...' : 'Update Product'}
                </button>
                
                <Link
                  to="/products"
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

export default EditProduct