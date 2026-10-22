import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Reports() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Laboratory Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage patient laboratory reports and test results.
        </p>
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

      {/* Table */}
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
                Completed bookings will appear here
                after a report is created.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">
                    Report
                  </th>

                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    Booking
                  </th>

                  <th className="px-6 py-4">
                    Tests
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

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
                        {formatStatus(
                          report.status
                        )}
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
    </div>
  )
}

export default Reports