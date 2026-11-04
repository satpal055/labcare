import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Reports() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create Report states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [completedBookings, setCompletedBookings] = useState([])
  const [bookingLoading, setBookingLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState('')

  const fetchReports = async () => {
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

      const response = await api.get(
        `/reports?${params.toString()}`
      )

      setReports(response.data.reports || [])
    } catch (error) {
      console.error('FETCH REPORTS ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to load reports'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [search, status])

  // Fetch completed bookings for report creation
  const handleOpenCreateModal = async () => {
    setShowCreateModal(true)
    setBookingLoading(true)
    setCreateError('')
    setSelectedBooking('')
    setCompletedBookings([])

    try {
      const response = await api.get(
        '/bookings?status=completed'
      )

      const bookings = response.data.bookings || []

      // Do not show bookings that already have reports
      const reportedBookingIds = new Set(
        reports.map((report) => report.bookingId)
      )

      const availableBookings = bookings.filter(
        (booking) =>
          booking.status === 'completed' &&
          !reportedBookingIds.has(booking.bookingId)
      )

      setCompletedBookings(availableBookings)
    } catch (error) {
      console.error('FETCH COMPLETED BOOKINGS ERROR:', error)

      setCreateError(
        error.response?.data?.message ||
          'Failed to load completed bookings'
      )
    } finally {
      setBookingLoading(false)
    }
  }

  // Create report
  const handleCreateReport = async () => {
    if (!selectedBooking) {
      setCreateError('Please select a booking first.')
      return
    }

    try {
      setCreateLoading(true)
      setCreateError('')

      await api.post('/reports', {
        bookingId: selectedBooking,
      })

      setShowCreateModal(false)
      setSelectedBooking('')

      await fetchReports()
    } catch (error) {
      console.error('CREATE REPORT ERROR:', error)

      setCreateError(
        error.response?.data?.message ||
          'Failed to create report'
      )
    } finally {
      setCreateLoading(false)
    }
  }

  const getStatusClasses = (value) => {
    const classes = {
      draft:
        'bg-amber-50 text-amber-700 ring-amber-200',
      completed:
        'bg-blue-50 text-blue-700 ring-blue-200',
      verified:
        'bg-emerald-50 text-emerald-700 ring-emerald-200',
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
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(' ')
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Laboratory Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient laboratory reports and test results.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <span className="mr-2 text-lg">+</span>
          Create Report
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Reports
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by report ID, booking ID, patient ID or name..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Reports Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {reports.length} report
            {reports.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading reports...
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center">
            <div>
              <p className="font-medium text-slate-700">
                No reports found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create a report from a completed booking.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Report</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Tests</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-blue-600">
                        {report.reportId}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {report.patientName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {report.patientId}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {report.bookingId}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {report.tests?.length || 0}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(
                        report.reportDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
                          report.status
                        )}`}
                      >
                        {formatStatus(report.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/reports/${report._id}`}
                        className="inline-flex rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
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

      {/* Create Report Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => {
            if (!createLoading) {
              setShowCreateModal(false)
            }
          }}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Laboratory Report
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a completed booking to generate a report.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={createLoading}
                className="rounded-lg px-3 py-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-6">
              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {createError}
                </div>
              )}

              {bookingLoading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <p className="text-sm text-slate-500">
                    Loading completed bookings...
                  </p>
                </div>
              ) : completedBookings.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center">
                  <p className="font-semibold text-slate-700">
                    No eligible bookings available
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    All completed bookings may already have reports,
                    or there are no completed bookings yet.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Completed Booking
                  </label>

                  <select
                    value={selectedBooking}
                    onChange={(event) => {
                      setSelectedBooking(event.target.value)
                      setCreateError('')
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">
                      Choose a booking
                    </option>

                    {completedBookings.map((booking) => (
                      <option
                        key={booking._id}
                        value={booking._id}
                      >
                        {booking.bookingId} — {booking.patientName}
                      </option>
                    ))}
                  </select>

                  {selectedBooking && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                      {(() => {
                        const booking = completedBookings.find(
                          (item) => item._id === selectedBooking
                        )

                        return booking ? (
                          <>
                            <p className="text-sm font-semibold text-blue-900">
                              {booking.patientName}
                            </p>

                            <p className="mt-1 text-xs text-blue-700">
                              Booking: {booking.bookingId}
                            </p>

                            <p className="mt-1 text-xs text-blue-700">
                              Tests: {booking.tests?.length || 0}
                            </p>
                          </>
                        ) : null
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={createLoading}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
 
              <button
                type="button"
                onClick={handleCreateReport}
                disabled={
                  !selectedBooking ||
                  createLoading ||
                  bookingLoading
                }
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createLoading
                  ? 'Creating Report...'
                  : 'Create Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports