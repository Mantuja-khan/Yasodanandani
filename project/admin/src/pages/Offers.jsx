import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://yasodanandani.onrender.com/api/offers/admin')
      setOffers(response.data)
    } catch (error) {
      toast.error('Failed to fetch offers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await axios.delete(`https://yasodanandani.onrender.com/api/offers/${id}`)
        toast.success('Offer deleted successfully')
        fetchOffers()
      } catch (error) {
        toast.error('Failed to delete offer')
      }
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOfferActive = (offer) => {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)
    return offer.isActive && now >= startDate && now <= endDate
  }

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
          <p className="text-gray-600">Manage product offers and discounts</p>
        </div>
        <Link to="/offers/add" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Offer</span>
        </Link>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
          />
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div key={index} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))
        ) : filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isOfferActive(offer)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isOfferActive(offer) ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{offer.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium">
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}%` 
                      : `₹${offer.discountValue}`
                    }
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{offer.products?.length || 0}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used:</span>
                  <span className="font-medium">
                    {offer.usedCount} / {offer.usageLimit || '∞'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(offer.startDate)}</span>
                  </div>
                  <span>to</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(offer.endDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <button className="text-primary-600 hover:text-primary-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No offers found.</p>
            <Link to="/offers/add" className="mt-4 inline-block btn-primary">
              Create Your First Offer
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Offers