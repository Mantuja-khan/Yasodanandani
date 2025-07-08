import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/product/ProductCard'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchProducts()
  }, [filters, currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      })

      Object.keys(filters).forEach(key => {
        if (!filters[key]) params.delete(key)
      })

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data.products)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-0 md:py-8">
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Our Products</h1>
        
        {/* Search and Filters */}
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-md mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 md:h-4 md:w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs md:text-base"
              />
            </div>

            {/* Sort */}
            <select
              value={`${filters.sortBy}_${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_')
                handleFilterChange('sortBy', sortBy)
                handleFilterChange('sortOrder', sortOrder)
              }}
              className="w-full px-2 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs md:text-base"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 transition-colors text-xs md:text-base"
            >
              Clear Filters
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 md:p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 md:p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-2 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(12)].map((_, index) => (
              <div key={index} className="card p-1 md:p-4 animate-pulse">
                <div className="bg-gray-300 h-24 md:h-48 rounded-lg mb-1 md:mb-4"></div>
                <div className="h-2 md:h-4 bg-gray-300 rounded mb-1 md:mb-2"></div>
                <div className="h-2 md:h-4 bg-gray-300 rounded w-3/4 mb-1 md:mb-2"></div>
                <div className="h-3 md:h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-2 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500 text-sm md:text-lg">No products found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 md:mt-8">
            <div className="flex space-x-1 md:space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs md:text-base"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-2 md:px-4 py-1 md:py-2 border rounded-lg text-xs md:text-base ${
                    currentPage === index + 1
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs md:text-base"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products