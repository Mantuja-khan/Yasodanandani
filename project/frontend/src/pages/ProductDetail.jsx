import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://yasodanandani.onrender.com/api/products/${id}`)
      setProduct(response.data)
      
      // Fetch related products
      if (response.data.category) {
        const relatedResponse = await axios.get(`https://yasodanandani.onrender.com/api/products?category=${response.data.category}&limit=4`)
        setRelatedProducts(relatedResponse.data.products.filter(p => p._id !== id))
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }
    addToCart(product, quantity)
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-gray-300 h-48 md:h-96 rounded-lg"></div>
            <div className="space-y-2 md:space-y-4">
              <div className="h-4 md:h-8 bg-gray-300 rounded"></div>
              <div className="h-2 md:h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 md:h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-10 md:h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8 text-center">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">Product not found</h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Product Images - MOBILE OPTIMIZED */}
        <div className="space-y-2 md:space-y-4">
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="mobile-product-image w-full h-48 md:h-96 object-cover rounded-lg"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-1 md:space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`mobile-product-thumbnail flex-shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - MOBILE OPTIMIZED */}
        <div className="space-y-3 md:space-y-6">
          <div>
            <h1 className="product-detail-title text-lg md:text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.brand && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">Brand: {product.brand}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 md:h-5 md:w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-gray-600">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="product-detail-price text-xl md:text-3xl font-bold text-primary-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm md:text-xl text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-800 px-1 md:px-2 py-0.5 md:py-1 rounded text-xs md:text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium text-sm md:text-base">In Stock</span>
                {product.stock <= 5 && (
                  <span className="text-orange-600 text-xs md:text-sm">
                    (Only {product.stock} left)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium text-sm md:text-base">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">Description</h3>
            <p className="product-detail-description text-gray-600 leading-relaxed text-xs md:text-base">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">Specifications</h3>
              <div className="bg-gray-50 p-2 md:p-4 rounded-lg">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-0.5 md:py-1">
                    <span className="text-gray-600 capitalize text-xs md:text-sm">{key}:</span>
                    <span className="text-gray-900 text-xs md:text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          {product.stock > 0 && (
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center space-x-2 md:space-x-4">
                <label className="text-xs md:text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 md:px-3 md:py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 md:px-4 md:py-2 border-x border-gray-300 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-2 py-1 md:px-3 md:py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 md:space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 text-xs md:text-base"
                >
                  <ShoppingCart className="h-3 w-3 md:h-5 md:w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors text-xs md:text-base"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="border-t pt-3 md:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              <div className="flex items-center space-x-1 md:space-x-2">
                <Truck className="h-3 w-3 md:h-5 md:w-5 text-primary-600" />
                <span className="text-xs md:text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <RotateCcw className="h-3 w-3 md:h-5 md:w-5 text-primary-600" />
                <span className="text-xs md:text-sm text-gray-600">7 Days Return</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Shield className="h-3 w-3 md:h-5 md:w-5 text-primary-600" />
                <span className="text-xs md:text-sm text-gray-600">Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 md:mt-16">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="card overflow-hidden hover:shadow-lg transition-shadow p-1 md:p-3">
                <img
                  src={relatedProduct.images[0]}
                  alt={relatedProduct.name}
                  className="w-full h-24 md:h-48 object-cover rounded"
                />
                <div className="p-2 md:p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2 text-xs md:text-base">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-primary-600 font-bold text-sm md:text-base">
                    ₹{relatedProduct.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                    className="w-full mt-1 md:mt-3 btn-primary text-xs md:text-sm py-1 md:py-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail