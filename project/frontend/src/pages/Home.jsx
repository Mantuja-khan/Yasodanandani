import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, Award, Users, ShoppingBag, Heart, Crown, Sparkles, Gift, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/product/ProductCard'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products?limit=8&sortBy=rating&sortOrder=desc')
      setFeaturedProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <Crown className="h-5 w-5 md:h-7 md:w-7 text-pink-500" />,
      title: "Premium Quality",
      description: "Finest fabrics and craftsmanship",
      gradient: "from-pink-500/10 to-pink-600/10"
    },
    {
      icon: <Truck className="h-5 w-5 md:h-7 md:w-7 text-blue-500" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping",
      gradient: "from-blue-500/10 to-blue-600/10"
    },
    {
      icon: <Shield className="h-5 w-5 md:h-7 md:w-7 text-emerald-500" />,
      title: "Secure Shopping",
      description: "100% secure payments",
      gradient: "from-emerald-500/10 to-emerald-600/10"
    },
    {
      icon: <Award className="h-5 w-5 md:h-7 md:w-7 text-purple-500" />,
      title: "Best Service",
      description: "24/7 customer support",
      gradient: "from-purple-500/10 to-purple-600/10"
    }
  ]

  const stats = [
    { icon: <Users className="h-4 w-4 md:h-6 md:w-6" />, number: "25K+", label: "Happy Customers", color: "text-pink-500" },
    { icon: <Crown className="h-4 w-4 md:h-6 md:w-6" />, number: "500+", label: "Products", color: "text-purple-500" },
    { icon: <Award className="h-4 w-4 md:h-6 md:w-6" />, number: "99%", label: "Satisfaction", color: "text-emerald-500" },
    { icon: <TrendingUp className="h-4 w-4 md:h-6 md:w-6" />, number: "4.9★", label: "Rating", color: "text-blue-500" }
  ]

  const categories = [
    { 
      name: "Casual Wear", 
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
      count: "120+ Items",
      gradient: "from-pink-500/90 via-rose-500/90 to-pink-600/90"
    },
    { 
      name: "Formal Wear", 
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
      count: "85+ Items",
      gradient: "from-purple-500/90 via-indigo-500/90 to-purple-600/90"
    },
    { 
      name: "Party Wear", 
      image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
      count: "95+ Items",
      gradient: "from-blue-500/90 via-cyan-500/90 to-blue-600/90"
    },
    { 
      name: "Traditional", 
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
      count: "200+ Items",
      gradient: "from-emerald-500/90 via-green-500/90 to-emerald-600/90"
    }
  ]

  const heroSlides = [
    {
      image: "https://i.pinimg.com/736x/2d/44/12/2d44125dc9631b3eaec6e9d40007c54a.jpg",
      title: "Beautiful Kurties",
      subtitle: "For You",
      description: "Discover elegant and comfortable kurties designed for the modern Indian woman.",
      cta: "Shop Now"
    },
    {
      image: "https://i.pinimg.com/736x/4e/48/4e/4e484e995294aed5816e4bcb96ef6237.jpg",
      title: "Elegant Collection",
      subtitle: "New Arrivals",
      description: "Explore our latest collection of premium kurties with exquisite designs.",
      cta: "Explore"
    },
    {
      image: "https://i.pinimg.com/736x/24/61/ec/2461ece0972deb217b5db7ff7cb66696.jpg",
      title: "Festive Special",
      subtitle: "Limited Edition",
      description: "Get ready for celebrations with our exclusive festive kurti collection.",
      cta: "Shop Collection"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-0 md:py-8 -mt-10">
      {/* Hero Section with Carousel */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-2 pb-6 md:py-16 lg:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="relative mb-4">
              <div className="relative h-48 md:h-56 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Slide Navigation */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-semibold">4.9</span>
                  </div>
                </div>
                
                <div className="absolute bottom-12 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-pink-500 fill-current" />
                    <span className="text-xs font-semibold">25K+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-3 py-1 mb-3 animate-pulse">
                <Sparkles className="h-3 w-3 text-pink-500 mr-1" />
                <span className="text-xs font-medium text-pink-700">New Collection Available</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                <span className="block text-gray-900 animate-fadeInUp">{heroSlides[currentSlide].title}</span>
                <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-fadeInUp delay-100">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>

              <p className="text-sm text-gray-600 mb-4 max-w-lg mx-auto animate-fadeInUp delay-200">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeInUp delay-300">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 mb-6 animate-pulse">
                <Sparkles className="h-4 w-4 text-pink-500 mr-2" />
                <span className="text-sm font-medium text-pink-700">New Collection Available</span>
              </div>
              
              <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-gray-900 animate-fadeInUp">{heroSlides[currentSlide].title}</span>
                <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-fadeInUp delay-100">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg animate-fadeInUp delay-200">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex gap-4 animate-fadeInUp delay-300">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Carousel */}
            <div className="relative">
              <div className="relative h-96 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                
                {/* Slide Navigation */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                </div>
                
                <div className="absolute bottom-16 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-pink-500 fill-current" />
                    <span className="text-xs font-semibold">25K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className={`flex justify-center mb-2 md:mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Why Choose Us?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the best in quality and service with our premium kurti collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`text-center p-6 md:p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100`}>
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect kurti for every occasion and style preference
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} group-hover:opacity-95 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 text-center">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90 text-center">{category.count}</p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most loved and trending kurties, handpicked just for you
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-lg animate-pulse">
                  <div className="bg-gray-300 h-48 md:h-56 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center text-base md:text-lg"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center relative z-10">
          <div className="mb-6 md:mb-8">
            <Gift className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-pink-200 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Get Exclusive Offers
            </h2>
            <p className="text-base md:text-lg text-pink-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get 10% off on your first order plus early access to new collections
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 md:py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 text-base shadow-lg"
              />
              <button className="bg-white text-pink-600 px-6 py-3 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 whitespace-nowrap shadow-lg">
                Subscribe Now
              </button>
            </div>
            <p className="text-sm text-pink-200">
              🎉 Join 25,000+ happy customers! No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home