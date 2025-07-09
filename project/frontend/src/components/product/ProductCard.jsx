import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart()

  // Add safety checks for product data
  if (!product || !product._id) {
    return null
  }
  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, 1)
  }

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product._id}`} className="card p-2 md:p-6 hover:shadow-lg transition-shadow block">
        <div className="flex space-x-2 md:space-x-6">
          <div className="flex-shrink-0">
            <img
              src={product.images?.[0] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-16 h-16 md:w-32 md:h-32 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">{product.name || 'Product Name'}</h3>
            <p className="text-gray-600 mb-1 md:mb-4 line-clamp-2 text-xs md:text-base">{product.description || 'No description available'}</p>
            
            <div className="flex items-center mb-1 md:mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2 w-2 md:h-4 md:w-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs md:text-sm text-gray-600 ml-1 md:ml-2">
                  ({product.numReviews || 0})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-sm md:text-2xl font-bold text-primary-600">
                  ₹{product.price || 0}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs md:text-lg text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
                className="btn-primary flex items-center space-x-1 md:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
              >
                <ShoppingCart className="h-2 w-2 md:h-4 md:w-4" />
                <span>{!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/products/${product._id}`} className="product-card card overflow-hidden hover:shadow-lg transition-shadow block p-1 md:p-3">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={product.images?.[0] || '/placeholder-image.jpg'}
          alt={product.name}
          className="w-full h-20 md:h-36 object-cover rounded-lg"
        />
      </div>
      
      <div className="p-1 md:p-3">
        <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name || 'Product Name'}
        </h3>
        
        <div className="flex items-center mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-2 w-2 md:h-3 md:w-3 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs md:text-sm text-gray-600 ml-1">
              ({product.numReviews || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center space-x-1">
            <span className="price text-xs md:text-base font-bold text-primary-600">
              ₹{product.price || 0}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs md:text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          {product.stock && product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className="w-full btn-primary flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed text-xs py-1 md:py-2"
        >
          <ShoppingCart className="h-2 w-2 md:h-3 md:w-3" />
          <span>{!product.stock || product.stock === 0 ? 'Out' : 'Add'}</span>
        </button>
      </div>
    </Link>
  )
}

export default ProductCard