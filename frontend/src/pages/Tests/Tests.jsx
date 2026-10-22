import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Tests() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sampleType: '',
  })

  const fetchTests = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/test', {
        params: {
          search: filters.search,
          category: filters.category,
          sampleType: filters.sampleType,
        },
      })

      setTests(response.data.tests || [])
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load tests.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSearch = (event) => {
    event.preventDefault()
    fetchTests()
  }

  const handleClear = () => {
    setFilters({
      search: '',
      category: '',
      sampleType: '',
    })

    setTimeout(() => {
      fetchTestsWithClearFilters()
    }, 0)
  }

  const fetchTestsWithClearFilters = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/test')

      setTests(response.data.tests || [])
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load tests.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Lab Tests
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage laboratory tests, pricing and test information.
          </p>
        </div>

        <Link
          to="/tests/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Test
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search
            </label>

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by test ID, name or short name..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleChange}
              placeholder="e.g. Hematology"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Sample Type
            </label>

            <input
              type="text"
              name="sampleType"
              value={filters.sampleType}
              onChange={handleChange}
              placeholder="e.g. Blood"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3 lg:col-span-4">
            <button
              type="submit"
              className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">
            Available Tests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {tests.length} active test{tests.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading tests...
          </div>
        ) : tests.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No tests found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Test
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Sample
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Report Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {tests.map((test) => (
                  <tr
                    key={test._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {test.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {test.shortName || 'No short name'}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {test.testId}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {test.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {test.sampleType}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {test.reportTime || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      ₹{test.price}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/tests/${test._id}`}
                        className="inline-flex items-center rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
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

export default Tests