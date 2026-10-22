import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function EditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get(`/categories/${id}`)

        const category = response.data.category

        setFormData({
          categoryId: category.categoryId || '',
          name: category.name || '',
          description: category.description || '',
        })
      } catch (error) {
        console.error('GET CATEGORY ERROR:', error)

        setError(
          error.response?.data?.message ||
            'Failed to load category'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!formData.categoryId || !formData.name) {
      setError('Category ID and name are required')
      return
    }

    try {
      setSaving(true)

      await api.put(`/categories/${id}`, formData)

      navigate('/categories')
    } catch (error) {
      console.error('UPDATE CATEGORY ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to update category'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading category...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Category
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update laboratory test category
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category ID *
            </label>

            <input
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </div>

      </form>
    </div>
  )
}

export default EditCategory