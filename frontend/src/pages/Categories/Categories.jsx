import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Categories() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/categories', {
        params: {
          search,
        },
      })

      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('GET CATEGORIES ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to load categories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories()
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handleDeactivate = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate this category?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/categories/${id}`)

      fetchCategories()
    } catch (error) {
      console.error('DELETE CATEGORY ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to deactivate category'
      )
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Test Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage laboratory test categories
          </p>
        </div>

        <Link
          to="/categories/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category ID or name..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-gray-700">
              No categories found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try another search or create a new category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {category.categoryId}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {category.name}
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-gray-500">
                      {category.description || '—'}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">

                        <Link
                          to={`/categories/${category._id}/edit`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeactivate(category._id)
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Deactivate
                        </button>

                      </div>
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

export default Categories