import { useState, useEffect } from 'react'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    monthlyRevenue: [],
    monthlySales: [],
    categoryStats: [],
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all required data
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get('https://yasodanandani.onrender.com/api/products?limit=1'),
        axios.get('https://yasodanandani.onrender.com/api/users/stats/overview'),
        axios.get('https://yasodanandani.onrender.com/api/orders?limit=10')
      ])

      // Calculate revenue only from paid orders
      const allOrdersRes = await axios.get('/api/orders')
      const allOrders = allOrdersRes.data.orders || []
      
      // Filter only paid orders for revenue calculation
      const paidOrders = allOrders.filter(order => 
        order.paymentResult && 
        order.paymentResult.status === 'completed'
      )
      
      const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)

      // Calculate monthly revenue and sales from paid orders only
      const monthlyData = await calculateMonthlyData(paidOrders)
      const categoryData = await fetchCategoryStats()

      setStats({
        totalProducts: productsRes.data.total || 0,
        totalUsers: usersRes.data.totalUsers || 0,
        totalOrders: allOrders.length || 0,
        totalRevenue: totalRevenue,
        activeUsers: usersRes.data.activeUsers || 0,
        pendingOrders: allOrders.filter(order => order.orderStatus === 'pending').length || 0,
        monthlyRevenue: monthlyData.revenue,
        monthlySales: monthlyData.sales,
        categoryStats: categoryData,
        recentOrders: ordersRes.data.orders || []
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Set default data if API calls fail
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingOrders: 0,
        monthlyRevenue: [],
        monthlySales: [],
        categoryStats: [],
        recentOrders: []
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyData = async (paidOrders) => {
    try {
      const monthlyData = {}
      const currentYear = new Date().getFullYear()
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
        monthlyData[monthKey] = { revenue: 0, sales: 0 }
      }

      // Process only paid orders for revenue
      paidOrders.forEach(order => {
        const orderDate = new Date(order.createdAt)
        if (orderDate.getFullYear() === currentYear) {
          const monthKey = orderDate.toLocaleDateString('en-US', { month: 'short' })
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].revenue += order.totalAmount
            monthlyData[monthKey].sales += 1
          }
        }
      })

      return {
        revenue: Object.entries(monthlyData).map(([name, data]) => ({
          name,
          revenue: data.revenue
        })),
        sales: Object.entries(monthlyData).map(([name, data]) => ({
          name,
          sales: data.sales
        }))
      }
    } catch (error) {
      console.error('Error calculating monthly data:', error)
      // Return default data structure
      const defaultMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return {
        revenue: defaultMonths.map(name => ({ name, revenue: 0 })),
        sales: defaultMonths.map(name => ({ name, sales: 0 }))
      }
    }
  }

  const fetchCategoryStats = async () => {
    try {
      const response = await axios.get('https://yasodanandani.onrender.com/api/products')
      const products = response.data.products || []
      
      const categoryCount = {}
      products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
      })

      return Object.entries(categoryCount).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }))
    } catch (error) {
      console.error('Error fetching category stats:', error)
      return []
    }
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: '+8%',
      changeType: 'increase',
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: '+15%',
      changeType: 'increase',
      color: 'bg-purple-500'
    },
    {
      title: 'Paid Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+22%',
      changeType: 'increase',
      color: 'bg-orange-500'
    }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Paid Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Paid Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
          {stats.categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No category data available
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order, index) => (
                <div key={order._id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">{order.user?.name || 'Unknown User'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                      {order.paymentResult?.status === 'completed' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent orders
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Total Revenue (Paid Orders Only)</p>
              <p className="text-2xl font-bold text-blue-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-blue-600">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            * Revenue calculated only from orders with completed payments
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard