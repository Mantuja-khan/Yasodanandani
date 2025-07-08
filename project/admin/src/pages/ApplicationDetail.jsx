import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, User, MessageSquare, AlertCircle, Save } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ApplicationDetail = () => {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    adminNotes: ''
  })

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      const response = await axios.get(`https://yasodanandani.onrender.com/api/contact/applications/${id}`)
      setApplication(response.data)
      setFormData({
        status: response.data.status,
        priority: response.data.priority,
        adminNotes: response.data.adminNotes || ''
      })
    } catch (error) {
      toast.error('Application not found')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const response = await axios.put(`https://yasodanandani.onrender.com/api/contact/applications/${id}`, formData)
      setApplication(response.data)
      toast.success('Application updated successfully')
    } catch (error) {
      toast.error('Failed to update application')
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Application not found</h1>
        <Link to="/applications" className="mt-4 inline-block btn-primary">
          Back to Applications
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/applications"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Info */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityColor(application.priority)}`}>
                  {application.priority} Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-gray-900">{application.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{application.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted</p>
                  <p className="text-gray-900">{formatDate(application.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Subject</p>
                  <p className="text-gray-900">{application.subject}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Message</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {application.message}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          {application.adminNotes && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Notes</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {application.adminNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Application</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  name="adminNotes"
                  value={formData.adminNotes}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Add internal notes about this application..."
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{updating ? 'Updating...' : 'Update Application'}</span>
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={`mailto:${application.email}?subject=Re: ${application.subject}`}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Reply via Email</span>
              </a>
              
              {application.status !== 'resolved' && (
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, status: 'resolved' }))
                    handleUpdate({ preventDefault: () => {} })
                  }}
                  className="w-full btn-secondary"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>

          {/* Application Stats */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Application ID</span>
                <span className="font-medium text-sm">#{application._id.slice(-8).toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDate(application.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(application.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetail