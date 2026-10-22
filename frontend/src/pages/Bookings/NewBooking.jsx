import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

function NewBooking() {
  const navigate = useNavigate()

  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [tests, setTests] = useState([])

  const [patient, setPatient] = useState('')
  const [doctor, setDoctor] = useState('')
  const [selectedTests, setSelectedTests] = useState([])

  const [discount, setDiscount] = useState(0)
  const [paymentStatus, setPaymentStatus] =
    useState('pending')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          patientsResponse,
          doctorsResponse,
          testsResponse,
        ] = await Promise.all([
          api.get('/patients'),
          api.get('/doctors'),
          api.get('/test'),
        ])

        setPatients(
          patientsResponse.data.patients || []
        )

        setDoctors(
          doctorsResponse.data.doctors || []
        )

        setTests(
          testsResponse.data.tests || []
        )
      } catch (error) {
        console.error('LOAD BOOKING DATA ERROR:', error)

        setError(
          error.response?.data?.message ||
            'Failed to load booking data'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleTestToggle = (testId) => {
    setSelectedTests((current) => {
      if (current.includes(testId)) {
        return current.filter((id) => id !== testId)
      }

      return [...current, testId]
    })
  }

  const selectedTestObjects = tests.filter((test) =>
    selectedTests.includes(test._id)
  )

  const totalAmount = selectedTestObjects.reduce(
    (sum, test) => sum + Number(test.price || 0),
    0
  )

  const discountAmount = Math.max(
    0,
    Number(discount) || 0
  )

  const finalAmount = Math.max(
    0,
    totalAmount - discountAmount
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!patient) {
      setError('Please select a patient')
      return
    }

    if (selectedTests.length === 0) {
      setError('Please select at least one test')
      return
    }

    if (discountAmount > totalAmount) {
      setError(
        'Discount cannot be greater than total amount'
      )
      return
    }

    try {
      setSubmitting(true)

      const response = await api.post('/bookings', {
        patient,
        doctor: doctor || null,
        tests: selectedTests,
        discount: discountAmount,
        paymentStatus,
        notes,
      })

      setSuccess(
        `Booking ${response.data.booking.bookingId} created successfully`
      )

      setTimeout(() => {
        navigate('/bookings')
      }, 1000)
    } catch (error) {
      console.error('CREATE BOOKING ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to create booking'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading booking form...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Laboratory Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            New Booking
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a new patient test booking.
          </p>
        </div>

        <Link
          to="/bookings"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back to Bookings
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Patient & Doctor */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Patient Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select the patient and referring doctor.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Patient *
                  </label>

                  <select
                    value={patient}
                    onChange={(event) =>
                      setPatient(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">
                      Select patient
                    </option>

                    {patients.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.patientId} -{' '}
                        {item.firstName} {item.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Referring Doctor
                  </label>

                  <select
                    value={doctor}
                    onChange={(event) =>
                      setDoctor(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">
                      No doctor / self referred
                    </option>

                    {doctors.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        Dr. {item.firstName}{' '}
                        {item.lastName} -{' '}
                        {item.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tests */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Select Tests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select one or more laboratory tests.
                </p>
              </div>

              {tests.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  No active tests available.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {tests.map((test) => {
                    const isSelected =
                      selectedTests.includes(test._id)

                    return (
                      <button
                        key={test._id}
                        type="button"
                        onClick={() =>
                          handleTestToggle(test._id)
                        }
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 bg-white text-transparent'
                            }`}
                          >
                            ✓
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {test.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {test.testId} ·{' '}
                              {test.category}
                            </p>
                          </div>
                        </div>

                        <span className="ml-3 shrink-0 text-sm font-bold text-slate-900">
                          ₹{test.price}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Additional Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add any relevant notes for this booking.
                </p>
              </div>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows="4"
                placeholder="Enter booking notes..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Booking Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review charges before creating booking.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Selected Tests
                  </p>

                  {selectedTestObjects.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No tests selected
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {selectedTestObjects.map((test) => (
                        <div
                          key={test._id}
                          className="flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {test.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {test.testId}
                            </p>
                          </div>

                          <span className="text-sm font-semibold text-slate-800">
                            ₹{test.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Discount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(event) =>
                      setDiscount(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Status
                  </label>

                  <select
                    value={paymentStatus}
                    onChange={(event) =>
                      setPaymentStatus(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="partial">
                      Partial
                    </option>

                    <option value="paid">
                      Paid
                    </option>
                  </select>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Total Amount
                    </span>

                    <span className="font-medium text-slate-800">
                      ₹{totalAmount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Discount
                    </span>

                    <span className="font-medium text-red-600">
                      - ₹{discountAmount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-semibold text-slate-900">
                      Final Amount
                    </span>

                    <span className="text-2xl font-bold text-blue-600">
                      ₹{finalAmount}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? 'Creating Booking...'
                    : 'Create Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewBooking