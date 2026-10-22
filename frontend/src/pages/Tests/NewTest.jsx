import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function NewTest() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [formData, setFormData] = useState({
    testId: '',
    name: '',
    shortName: '',
    category: '',
    sampleType: '',
    reportTime: '',
    preparation: '',
    description: '',
    price: '',
    unit: '',
    normalRange: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')

        setCategories(response.data.categories || [])
      } catch (error) {
        console.error('CATEGORY FETCH ERROR:', error)

        setError(
          error.response?.data?.message ||
            'Failed to load categories'
        )
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

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

    if (
      !formData.testId ||
      !formData.name ||
      !formData.category ||
      !formData.sampleType ||
      formData.price === ''
    ) {
      setError(
        'Test ID, name, category, sample type and price are required'
      )
      return
    }

    try {
      setLoading(true)

      await api.post('/test', {
        ...formData,
        price: Number(formData.price),
      })

      navigate('/tests')
    } catch (error) {
      console.error('CREATE TEST ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to create test'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Test
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new laboratory test
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Test ID *
            </label>

            <input
              type="text"
              name="testId"
              value={formData.testId}
              onChange={handleChange}
              placeholder="TEST-000003"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Test Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Complete Blood Count"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Short Name
            </label>

            <input
              type="text"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              placeholder="CBC"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loadingCategories}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            >
              <option value="">
                {loadingCategories
                  ? 'Loading categories...'
                  : 'Select category'}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category.name}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sample Type *
            </label>

            <input
              type="text"
              name="sampleType"
              value={formData.sampleType}
              onChange={handleChange}
              placeholder="Blood"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Report Time
            </label>

            <input
              type="text"
              name="reportTime"
              value={formData.reportTime}
              onChange={handleChange}
              placeholder="24 Hours"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price *
            </label>

            <input
              type="number"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="500"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Unit
            </label>

            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="mg/dL"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Normal Range
            </label>

            <input
              type="text"
              name="normalRange"
              value={formData.normalRange}
              onChange={handleChange}
              placeholder="13 - 17 g/dL"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preparation
            </label>

            <input
              type="text"
              name="preparation"
              value={formData.preparation}
              onChange={handleChange}
              placeholder="8-10 hours fasting"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter test description..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/tests')}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || loadingCategories}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Test'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTest