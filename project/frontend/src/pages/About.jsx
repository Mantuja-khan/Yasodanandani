import { Crown, Heart, Award, Users, Sparkles, Star } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: <Heart className="h-6 w-6 md:h-8 md:w-8 text-pink-500" />,
      title: "Quality First",
      description: "Premium fabrics and finest craftsmanship in every kurti"
    },
    {
      icon: <Crown className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />,
      title: "Elegant Designs",
      description: "Beautiful patterns that celebrate Indian femininity"
    },
    {
      icon: <Award className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />,
      title: "Customer Love",
      description: "Trusted by thousands of women across India"
    },
    {
      icon: <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />,
      title: "Latest Trends",
      description: "Always updated with the newest fashion styles"
    }
  ]

  const stats = [
    { number: "25K+", label: "Happy Customers" },
    { number: "500+", label: "Kurti Designs" },
    { number: "99%", label: "Satisfaction" },
    { number: "5★", label: "Average Rating" }
  ]

  return (
    <div className="min-h-screen page-container">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <Crown className="h-8 w-8 md:h-12 md:w-12 text-pink-600 mr-2" />
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              About Yasoda Nandani
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              Celebrating the beauty and grace of Indian women through elegant kurties
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 md:p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-pink-600 mb-1 md:mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-xs md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">Our Story</h2>
              <div className="space-y-3 md:space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  Yasoda Nandani was born from a passion for celebrating the timeless beauty 
                  of Indian women through elegant and comfortable kurties.
                </p>
                <p>
                  We believe every woman deserves to feel beautiful, confident, and comfortable 
                  in what she wears. Our carefully curated collection features designs that 
                  blend traditional Indian aesthetics with modern comfort.
                </p>
                <p>
                  From casual everyday wear to festive occasions, we have the perfect kurti 
                  for every moment in a woman's life.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg"
                alt="Beautiful kurti collection"
                className="rounded-xl shadow-xl w-full h-48 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
              Why Choose Us
            </h2>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              What makes Yasoda Nandani special for every woman
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-3 md:p-6 rounded-xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 transition-all duration-300">
                <div className="flex justify-center mb-2 md:mb-4">
                  {value.icon}
                </div>
                <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1 md:mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-xs md:text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-pink-200 animate-pulse" />
          <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">
            Ready to Find Your Perfect Kurti?
          </h2>
          <p className="text-sm md:text-xl text-pink-100 mb-4 md:mb-8 max-w-2xl mx-auto">
            Explore our beautiful collection and discover kurties that celebrate your style
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-pink-600 px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              Shop Kurties
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors text-sm md:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About