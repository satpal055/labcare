import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()

      if (search.trim()) {
        params.append('search', search.trim())
      }

      if (status) {
        params.append('status', status)
      }

      if (paymentStatus) {
        params.append('paymentStatus', paymentStatus)
      }

      const response = await api.get(
        `/bookings?${params.toString()}`
      )

      setBookings(response.data.bookings || [])
    } catch (error) {
      console.error('FETCH BOOKINGS ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to load bookings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [status, paymentStatus])

  const handleSearch = (event) => {
    event.preventDefault()
    fetchBookings()
  }

  const getStatusClasses = (value) => {
    const classes = {
      pending: 'bg-amber-50 text-amber-700 ring-amber-200',
      confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
      'sample-collected':
        'bg-purple-50 text-purple-700 ring-purple-200',
      processing:
        'bg-indigo-50 text-indigo-700 ring-indigo-200',
      completed:
        'bg-emerald-50 text-emerald-700 ring-emerald-200',
      cancelled:
        'bg-red-50 text-red-700 ring-red-200',
    }

    return (
      classes[value] ||
      'bg-slate-50 text-slate-600 ring-slate-200'
    )
  }

  const getPaymentClasses = (value) => {
    const classes = {
      pending: 'bg-amber-50 text-amber-700 ring-amber-200',
      partial: 'bg-orange-50 text-orange-700 ring-orange-200',
      paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    }

    return (
      classes[value] ||
      'bg-slate-50 text-slate-600 ring-slate-200'
    )
  }

  const formatStatus = (value) => {
    return value
      ?.split('-')
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Laboratory Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient test bookings and laboratory workflow.
          </p>
        </div>

        <Link
          to="/bookings/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <span className="mr-2 text-lg">+</span>
          New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 gap-4 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search booking ID, patient ID or patient name..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Booking Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="sample-collected">
                Sample Collected
              </option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Payment
            </label>

            <select
              value={paymentStatus}
              onChange={(event) =>
                setPaymentStatus(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search Bookings
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Booking Records
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {bookings.length} booking
                {bookings.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-sm text-slate-500">
              Loading bookings...
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              ◷
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No bookings found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Try changing your search or filters, or create
              a new booking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Booking</th>
                  <th className="px-5 py-4">Patient</th>
                  <th className="px-5 py-4">Tests</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {booking.bookingId}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          booking.bookingDate
                        ).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {booking.patientName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {booking.patientId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {booking.tests?.[0]?.name}
                      </p>

                      {booking.tests?.length > 1 && (
                        <p className="mt-1 text-xs text-blue-600">
                          +{booking.tests.length - 1} more
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        ₹{booking.finalAmount}
                      </p>

                      {booking.discount > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          ₹{booking.totalAmount} total
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getPaymentClasses(
                          booking.paymentStatus
                        )}`}
                      >
                        {formatStatus(
                          booking.paymentStatus
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/bookings/${booking._id}`}
                        className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings