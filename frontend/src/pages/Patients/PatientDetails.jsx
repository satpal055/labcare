import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

function PatientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deactivating, setDeactivating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchPatient = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(`/patients/${id}`)

      setPatient(response.data.patient)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load patient.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatient()
  }, [id])

  const handleDeactivate = async () => {
    try {
      setDeactivating(true)
      setError('')

      await api.delete(`/patients/${id}`)

      navigate('/patients')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to deactivate patient.'
      )
      setShowConfirm(false)
    } finally {
      setDeactivating(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading patient details...
      </div>
    )
  }

  if (error && !patient) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        Patient not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/patients"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Patients
          </Link>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
              {patient.firstName?.charAt(0)}
              {patient.lastName?.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {patient.firstName} {patient.lastName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Patient ID: {patient.patientId}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {patient.isActive && (
            <>
              <Link
                to={`/patients/${patient._id}/edit`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Edit Patient
              </Link>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
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
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Personal Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Patient ID"
            value={patient.patientId}
          />

          <Info
            label="First Name"
            value={patient.firstName}
          />

          <Info
            label="Last Name"
            value={patient.lastName}
          />

          <Info
            label="Gender"
            value={patient.gender}
            capitalize
          />

          <Info
            label="Date of Birth"
            value={
              patient.dateOfBirth
                ? new Date(
                    patient.dateOfBirth
                  ).toLocaleDateString()
                : '-'
            }
          />

          <Info
            label="Blood Group"
            value={patient.bloodGroup}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Contact Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Info
            label="Phone"
            value={patient.phone}
          />

          <Info
            label="Email"
            value={patient.email || '-'}
          />

          <Info
            label="City"
            value={patient.city || '-'}
          />

          <Info
            label="Address"
            value={patient.address || '-'}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Emergency Contact
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Info
            label="Name"
            value={
              patient.emergencyContact?.name || '-'
            }
          />

          <Info
            label="Phone"
            value={
              patient.emergencyContact?.phone || '-'
            }
          />

          <Info
            label="Relation"
            value={
              patient.emergencyContact?.relation || '-'
            }
          />
        </div>
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
                patient.isActive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {patient.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <Info
            label="Created"
            value={
              patient.createdAt
                ? new Date(
                    patient.createdAt
                  ).toLocaleDateString()
                : '-'
            }
          />

          <Info
            label="Last Updated"
            value={
              patient.updatedAt
                ? new Date(
                    patient.updatedAt
                  ).toLocaleDateString()
                : '-'
            }
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⚠️
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Deactivate Patient?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to deactivate{' '}
              <strong>
                {patient.firstName} {patient.lastName}
              </strong>
              ? The patient will no longer appear in the
              active patient list.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={deactivating}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeactivate}
                disabled={deactivating}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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

function Info({
  label,
  value,
  capitalize = false,
}) {
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

export default PatientDetails