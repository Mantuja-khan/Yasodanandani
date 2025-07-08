import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Heart, Crown, MessageCircle, Headphones, Globe } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/contact/submit', formData)
      toast.success(response.data.message)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-4 w-4 md:h-6 md:w-6" />,
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Sat 10am to 7pm",
      color: "bg-blue-500"
    },
    {
      icon: <Mail className="h-4 w-4 md:h-6 md:w-6" />,
      title: "Email Us",
      details: "hello@yasodanandani.com",
      description: "We reply within 24 hours",
      color: "bg-green-500"
    },
    {
      icon: <MapPin className="h-4 w-4 md:h-6 md:w-6" />,
      title: "Visit Us",
      details: "Mumbai, Maharashtra",
      description: "Fashion Street, India",
      color: "bg-purple-500"
    },
    {
      icon: <Clock className="h-4 w-4 md:h-6 md:w-6" />,
      title: "Working Hours",
      details: "Mon - Sat: 10am - 7pm",
      description: "Sunday: 11am - 5pm",
      color: "bg-orange-500"
    }
  ]

  const supportOptions = [
    {
      icon: <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />,
      title: "General Inquiry",
      description: "Questions about our products or services"
    },
    {
      icon: <Headphones className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Customer Support",
      description: "Help with orders, returns, or technical issues"
    },
    {
      icon: <Crown className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Business Partnership",
      description: "Collaboration and business opportunities"
    },
    {
      icon: <Globe className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Feedback",
      description: "Share your experience and suggestions"
    }
  ]

  return (
    <div className="min-h-screen page-container">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-6 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2 md:mb-4">
              <Crown className="h-5 w-5 md:h-8 md:w-8 text-pink-600 mr-2" />
              <Heart className="h-4 w-4 md:h-6 md:w-6 text-purple-500" />
            </div>
            <h1 className="text-xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-sm md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-3 md:p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className={`${info.color} text-white p-2 md:p-3 rounded-lg w-fit mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-xs md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-900 font-medium mb-1 text-xs md:text-base">
                  {info.details}
                </p>
                <p className="text-gray-600 text-xs md:text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              How Can We Help?
            </h2>
            <p className="text-xs md:text-lg text-gray-600">
              Choose the type of support you need
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white p-3 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center group">
                <div className="text-pink-500 mb-2 md:mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {option.icon}
                </div>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-1 md:mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Form */}
      <section className="py-6 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              Send us a Message
            </h2>
            <p className="text-xs md:text-lg text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8 rounded-2xl shadow-xl border border-pink-100">
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-3 md:pl-4 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-xs md:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-3 md:pl-4 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-xs md:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-xs md:text-base"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Business Partnership">Business Partnership</option>
                  <option value="Feedback">Feedback & Suggestions</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-xs md:text-base"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-blue-800">
                  <strong>📝 Note:</strong> Your message will be sent to our admin panel where our team can review and respond to your inquiry promptly.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 text-xs md:text-base"
              >
                <Send className="h-3 w-3 md:h-5 md:w-5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
              <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-1 md:mb-2">
                How long does delivery take?
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                We typically deliver within 3-7 business days across India with free shipping on all orders.
              </p>
            </div>

            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
              <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-1 md:mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                We offer a 7-day return policy for all products in original condition with tags attached.
              </p>
            </div>

            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
              <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-1 md:mb-2">
                Do you offer size exchanges?
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Yes, we provide free size exchanges within 7 days of delivery. Check our size guide for best fit.
              </p>
            </div>

            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm">
              <h3 className="text-xs md:text-base font-semibold text-gray-900 mb-1 md:mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                You'll receive a tracking number via email once your order ships. You can also check in your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <Heart className="h-5 w-5 md:h-8 md:w-8 mx-auto mb-2 md:mb-4 text-pink-200 animate-pulse" />
          <h2 className="text-lg md:text-3xl font-bold mb-1 md:mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-xs md:text-xl text-pink-100 mb-3 md:mb-8 max-w-2xl mx-auto">
            For urgent matters, you can reach our customer support team directly
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
            <a
              href="tel:+919876543210"
              className="bg-white text-pink-600 px-3 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs md:text-base"
            >
              📞 Call Now
            </a>
            <a
              href="mailto:hello@yasodanandani.com"
              className="border-2 border-white text-white px-3 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors text-xs md:text-base"
            >
              ✉️ Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact