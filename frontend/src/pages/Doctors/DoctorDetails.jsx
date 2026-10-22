import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function DoctorDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [deactivating, setDeactivating] = useState(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/doctors/${id}`)

        setDoctor(response.data.doctor)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load doctor.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id])

  const handleDeactivate = async () => {
    try {
      setDeactivating(true)
      setError('')

      await api.delete(`/doctors/${id}`)

      navigate('/doctors')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to deactivate doctor.'
      )

      setShowDeactivateModal(false)
    } finally {
      setDeactivating(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading doctor details...
      </div>
    )
  }

  if (error && !doctor) {
    return (
      <div className="space-y-4">
        <Link
          to="/doctors"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Doctors
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        Doctor not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/doctors"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Doctors
          </Link>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
              {doctor.firstName?.charAt(0)}
              {doctor.lastName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Dr. {doctor.firstName} {doctor.lastName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {doctor.specialization}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {doctor.isActive && (
            <>
              <Link
                to={`/doctors/${doctor._id}/edit`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Edit Doctor
              </Link>

              <button
                type="button"
                onClick={() => setShowDeactivateModal(true)}
                className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Deactivate
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Professional Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Professional Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="Doctor ID" value={doctor.doctorId} />
          <Info label="Specialization" value={doctor.specialization} />
          <Info label="Qualification" value={doctor.qualification} />
          <Info
            label="Registration Number"
            value={doctor.registrationNumber || '-'}
          />
          <Info
            label="Experience"
            value={`${doctor.experience || 0} years`}
          />
          <Info
            label="Consultation Fee"
            value={`₹${doctor.consultationFee || 0}`}
          />
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Personal Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="First Name" value={doctor.firstName} />
          <Info label="Last Name" value={doctor.lastName} />
          <Info label="Gender" value={doctor.gender} capitalize />
          <Info label="Phone" value={doctor.phone} />
          <Info label="Email" value={doctor.email || '-'} />
          <Info label="City" value={doctor.city || '-'} />
        </div>
      </div>

      {/* Address */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Address
        </h2>

        <p className="text-sm leading-6 text-slate-600">
          {doctor.address || 'No address provided.'}
        </p>
      </div>

      {/* Professional Bio */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Professional Bio
        </h2>

        <p className="text-sm leading-7 text-slate-600">
          {doctor.bio || 'No professional bio provided.'}
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
                doctor.isActive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {doctor.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <Info
            label="Created"
            value={
              doctor.createdAt
                ? new Date(doctor.createdAt).toLocaleDateString()
                : '-'
            }
          />

          <Info
            label="Last Updated"
            value={
              doctor.updatedAt
                ? new Date(doctor.updatedAt).toLocaleDateString()
                : '-'
            }
          />
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              Deactivate Doctor?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to deactivate Dr.{' '}
              {doctor.firstName} {doctor.lastName}? The doctor will be
              removed from the active doctors list.
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

function Info({ label, value, capitalize = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold text-slate-700 ${
          capitalize ? 'capitalize' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}

export default DoctorDetails