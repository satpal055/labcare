import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function TestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [deactivating, setDeactivating] = useState(false)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/test/${id}`)

        setTest(response.data.test)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load test.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [id])

  const handleDeactivate = async () => {
    try {
      setDeactivating(true)
      setError('')

      await api.delete(`/test/${id}`)

      navigate('/tests')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to deactivate test.'
      )

      setShowDeactivateModal(false)
    } finally {
      setDeactivating(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading test details...
      </div>
    )
  }

  if (error && !test) {
    return (
      <div className="space-y-4">
        <Link
          to="/tests"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Tests
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        Test not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/tests"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Tests
          </Link>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
              {test.shortName || 'LAB'}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {test.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {test.testId} • {test.category}
              </p>
            </div>
          </div>
        </div>

        {test.isActive && (
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/tests/${test._id}/edit`}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Edit Test
            </Link>

            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Deactivate
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Basic Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="Test ID" value={test.testId} />
          <Info label="Test Name" value={test.name} />
          <Info label="Short Name" value={test.shortName || '-'} />
          <Info label="Category" value={test.category} />
          <Info label="Sample Type" value={test.sampleType} />
          <Info label="Report Time" value={test.reportTime || '-'} />
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Pricing & Reference
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Info
            label="Price"
            value={`₹${test.price}`}
          />

          <Info
            label="Unit"
            value={test.unit || '-'}
          />

          <Info
            label="Normal Range"
            value={test.normalRange || '-'}
          />
        </div>
      </div>

      {/* Preparation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Preparation
        </h2>

        <p className="text-sm leading-7 text-slate-600">
          {test.preparation || 'No preparation instructions provided.'}
        </p>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Description
        </h2>

        <p className="text-sm leading-7 text-slate-600">
          {test.description || 'No description provided.'}
        </p>
      </div>

      {/* Record Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Record Information
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                test.isActive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {test.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <Info
            label="Created"
            value={
              test.createdAt
                ? new Date(test.createdAt).toLocaleDateString()
                : '-'
            }
          />

          <Info
            label="Last Updated"
            value={
              test.updatedAt
                ? new Date(test.updatedAt).toLocaleDateString()
                : '-'
            }
          />
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl font-bold text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Deactivate Test?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to deactivate{' '}
              <span className="font-semibold text-slate-700">
                {test.name}
              </span>
              ? The test will be removed from the active tests list.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                disabled={deactivating}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeactivate}
                disabled={deactivating}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deactivating
                  ? 'Deactivating...'
                  : 'Yes, Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  )
}

export default TestDetails