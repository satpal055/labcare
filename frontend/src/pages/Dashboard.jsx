
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const initialStats = [
  {
    title: 'Total Patients',
    value: 0,
    icon: '♙',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Total Doctors',
    value: 0,
    icon: '⚕',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Total Tests',
    value: 0,
    icon: '▤',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    title: 'Pending Reports',
    value: 0,
    icon: '▧',
    color: 'bg-amber-50 text-amber-600',
  },
]

function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState(initialStats)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/dashboard')
        const data = response.data

        setStats([
          {
            title: 'Total Patients',
            value: data.stats.totalPatients ?? 0,
            icon: '♙',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            title: 'Total Doctors',
            value: data.stats.totalDoctors ?? 0,
            icon: '⚕',
            color: 'bg-violet-50 text-violet-600',
          },
          {
            title: 'Total Tests',
            value: data.stats.totalTests ?? 0,
            icon: '▤',
            color: 'bg-cyan-50 text-cyan-600',
          },
          {
            title: 'Pending Reports',
            value: data.stats.pendingReports ?? 0,
            icon: '▧',
            color: 'bg-amber-50 text-amber-600',
          },
        ])

        setRecentBookings(data.recentBookings || [])
      } catch (err) {
        console.error('Dashboard API Error:', err)
        setError(
          err.response?.data?.message ||
          'Unable to load dashboard data. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const actions = [
    {
      title: 'Add Patient',
      description: 'Register a new patient',
      icon: '+',
      color: 'bg-blue-100 text-blue-600',
      path: '/patients',
    },
    {
      title: 'New Booking',
      description: 'Book a laboratory test',
      icon: '+',
      color: 'bg-indigo-100 text-indigo-600',
      path: '/bookings',
    },
    {
      title: 'Create Report',
      description: 'Generate a patient report',
      icon: '+',
      color: 'bg-violet-100 text-violet-600',
      path: '/reports',
    },
  ]

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase()

    if (normalizedStatus === 'completed') {
      return 'bg-emerald-50 text-emerald-700'
    }

    if (
      normalizedStatus === 'processing' ||
      normalizedStatus === 'sample-collected'
    ) {
      return 'bg-blue-50 text-blue-700'
    }

    if (normalizedStatus === 'cancelled') {
      return 'bg-red-50 text-red-700'
    }

    return 'bg-amber-50 text-amber-700'
  }

  const formatStatus = (status) => {
    if (!status) return 'Unknown'

    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-7">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here's your laboratory overview.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            System Status
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* API Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? '...' : stat.value}
                </h2>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-500">
              Live data from database
            </p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recent Bookings */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Bookings
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest patient test bookings
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/bookings')}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {['Patient', 'Test', 'Doctor', 'Status'].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-slate-500">
                      Loading recent bookings...
                    </td>
                  </tr>
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking._id || booking.bookingId}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {booking.patientName || 'N/A'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {booking.tests?.length
                          ? booking.tests.map((test) => test.name).join(', ')
                          : 'N/A'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {booking.doctorName || 'Not assigned'}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-bold text-slate-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Frequently used actions
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {actions.map((action) => (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.path)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${action.color}`}>
                  {action.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-800">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {action.description}
                  </span>
                </span>

                <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
