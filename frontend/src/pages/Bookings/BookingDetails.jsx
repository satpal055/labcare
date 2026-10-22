import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'

function BookingDetails() {
  const { id } = useParams()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPayment, setUpdatingPayment] = useState(false)

  const [collectingSample, setCollectingSample] = useState(false)

  const [startingProcessing, setStartingProcessing] = useState(false)

  const [completingBooking, setCompletingBooking] = useState(false)

  const fetchBooking = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(`/bookings/${id}`)

      setBooking(response.data.booking)
    } catch (error) {
      console.error('FETCH BOOKING ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to load booking'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooking()
  }, [id])

  const updateStatus = async (status) => {
    try {
      setUpdatingStatus(true)
      setError('')
      setMessage('')

      const response = await api.patch(
        `/bookings/${id}/status`,
        {
          status,
        }
      )

      setBooking(response.data.booking)
      setMessage('Booking status updated successfully')
    } catch (error) {
      console.error('UPDATE STATUS ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to update booking status'
      )
    } finally {
      setUpdatingStatus(false)
    }
  }

  const updatePaymentStatus = async (paymentStatus) => {
    try {
      setUpdatingPayment(true)
      setError('')
      setMessage('')

      const response = await api.patch(
        `/bookings/${id}/payment-status`,
        {
          paymentStatus,
        }
      )

      setBooking(response.data.booking)
      setMessage(
        'Payment status updated successfully'
      )
    } catch (error) {
      console.error(
        'UPDATE PAYMENT STATUS ERROR:',
        error
      )

      setError(
        error.response?.data?.message ||
          'Failed to update payment status'
      )
    } finally {
      setUpdatingPayment(false)
    }
  }
  const collectSample = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to mark the sample as collected?'
  )

  if (!confirmed) {
    return
  }

  try {
    setCollectingSample(true)
    setError('')
    setMessage('')

    const response = await api.patch(
      `/bookings/${id}/collect-sample`
    )

    setBooking(response.data.booking)

    setMessage(
      'Sample collected successfully'
    )
  } catch (error) {
    console.error(
      'COLLECT SAMPLE ERROR:',
      error
    )

    setError(
      error.response?.data?.message ||
        'Failed to collect sample'
    )
  } finally {
    setCollectingSample(false)
  }
}
const startProcessing = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to start processing this booking?'
  )

  if (!confirmed) {
    return
  }

  try {
    setStartingProcessing(true)
    setError('')
    setMessage('')

    const response = await api.patch(
      `/bookings/${id}/start-processing`
    )

    setBooking(response.data.booking)

    setMessage(
      'Booking processing started successfully'
    )
  } catch (error) {
    console.error(
      'START PROCESSING ERROR:',
      error
    )

    setError(
      error.response?.data?.message ||
        'Failed to start processing'
    )
  } finally {
    setStartingProcessing(false)
  }
}
const completeBooking = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to mark this booking as completed?'
  )

  if (!confirmed) {
    return
  }

  try {
    setCompletingBooking(true)
    setError('')
    setMessage('')

    const response = await api.patch(
      `/bookings/${id}/complete`
    )

    setBooking(response.data.booking)

    setMessage(
      'Booking completed successfully'
    )
  } catch (error) {
    console.error(
      'COMPLETE BOOKING ERROR:',
      error
    )

    setError(
      error.response?.data?.message ||
        'Failed to complete booking'
    )
  } finally {
    setCompletingBooking(false)
  }
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

  const getStatusClasses = (value) => {
    const classes = {
      pending:
        'bg-amber-50 text-amber-700 ring-amber-200',
      confirmed:
        'bg-blue-50 text-blue-700 ring-blue-200',
      'sample-collected':
        'bg-purple-50 text-purple-700 ring-purple-200',
      processing:
        'bg-indigo-50 text-indigo-700 ring-indigo-200',
      completed:
        'bg-emerald-50 text-emerald-700 ring-emerald-200',
      cancelled:
        'bg-red-50 text-red-700 ring-red-200',
    }

    return (
      classes[value] ||
      'bg-slate-50 text-slate-600 ring-slate-200'
    )
  }

  const getPaymentClasses = (value) => {
    const classes = {
      pending:
        'bg-amber-50 text-amber-700 ring-amber-200',
      partial:
        'bg-orange-50 text-orange-700 ring-orange-200',
      paid:
        'bg-emerald-50 text-emerald-700 ring-emerald-200',
    }

    return (
      classes[value] ||
      'bg-slate-50 text-slate-600 ring-slate-200'
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading booking...
        </p>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="space-y-4">
        <Link
          to="/bookings"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Bookings
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to="/bookings"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Bookings
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {booking.bookingId}
            </h1>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
                booking.status
              )}`}
            >
              {formatStatus(booking.status)}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Booking created on{' '}
            {new Date(
              booking.createdAt
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Top Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Patient
          </p>

          <h2 className="mt-3 text-lg font-bold text-slate-900">
            {booking.patientName}
          </h2>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {booking.patientId}
          </p>

          {booking.patient && (
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm">
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">
                  Phone:
                </span>{' '}
                {booking.patient.phone || '—'}
              </p>

              <p className="text-slate-600">
                <span className="font-medium text-slate-800">
                  Email:
                </span>{' '}
                {booking.patient.email || '—'}
              </p>

              <p className="text-slate-600">
                <span className="font-medium text-slate-800">
                  Gender:
                </span>{' '}
                {booking.patient.gender || '—'}
              </p>
            </div>
          )}
        </div>

        {/* Doctor */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Referring Doctor
          </p>

          {booking.doctor ? (
            <>
              <h2 className="mt-3 text-lg font-bold text-slate-900">
                Dr. {booking.doctor.firstName}{' '}
                {booking.doctor.lastName}
              </h2>

              <p className="mt-1 text-sm text-blue-600">
                {booking.doctor.specialization}
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium text-slate-800">
                    Doctor ID:
                  </span>{' '}
                  {booking.doctor.doctorId}
                </p>

                <p className="text-slate-600">
                  <span className="font-medium text-slate-800">
                    Qualification:
                  </span>{' '}
                  {booking.doctor.qualification ||
                    '—'}
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                Self Referred
              </p>

              <p className="mt-1 text-xs text-slate-500">
                No referring doctor selected.
              </p>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Booking Dates
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-slate-400">
                Booking Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {new Date(
                  booking.bookingDate
                ).toLocaleString()}
              </p>
            </div>

            <div>
  <p className="text-xs text-slate-400">
    Sample Collection
  </p>

  <p className="mt-1 text-sm font-semibold text-slate-800">
    {booking.sampleCollectionDate
      ? new Date(
          booking.sampleCollectionDate
        ).toLocaleString()
      : 'Not collected yet'}
  </p>

  {!booking.sampleCollectionDate &&
    booking.status !== 'cancelled' &&
    booking.status !== 'completed' && (
      <button
        type="button"
        onClick={collectSample}
        disabled={collectingSample}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {collectingSample
          ? 'Collecting Sample...'
          : 'Collect Sample'}
      </button>
    )}

  {booking.sampleCollectionDate && (
    <div className="mt-3 inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
      Sample Collected
    </div>
  )}
  {booking.status === 'sample-collected' && (
  <button
    type="button"
    onClick={startProcessing}
    disabled={startingProcessing}
    className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {startingProcessing
      ? 'Starting Processing...'
      : 'Start Processing'}
  </button>

)}
{booking.status === 'processing' && (
  <button
    type="button"
    onClick={completeBooking}
    disabled={completingBooking}
    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {completingBooking
      ? 'Completing Booking...'
      : 'Complete Booking'}
  </button>
)}
</div>
          </div>
        </div>
      </div>

      {/* Tests */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Ordered Tests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Laboratory tests included in this booking.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Test ID</th>
                <th className="px-6 py-4">Test Name</th>
                <th className="px-6 py-4 text-right">
                  Price
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {booking.tests.map((test) => (
                <tr key={test.test}>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {test.testId}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {test.name}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                    ₹{test.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Booking Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update laboratory workflow status.
          </p>

          <div className="mt-5">
            <select
              value={booking.status}
              disabled={updatingStatus}
              onChange={(event) =>
                updateStatus(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
            >
              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="sample-collected">
                Sample Collected
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update payment collection status.
          </p>

          <div className="mt-5">
            <select
              value={booking.paymentStatus}
              disabled={updatingPayment}
              onChange={(event) =>
                updatePaymentStatus(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
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

          <div className="mt-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getPaymentClasses(
                booking.paymentStatus
              )}`}
            >
              {formatStatus(
                booking.paymentStatus
              )}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Summary
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Total
              </span>

              <span className="font-medium text-slate-800">
                ₹{booking.totalAmount}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-medium text-red-600">
                - ₹{booking.discount}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-100 pt-4">
              <span className="font-semibold text-slate-900">
                Final Amount
              </span>

              <span className="text-2xl font-bold text-blue-600">
                ₹{booking.finalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Notes
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {booking.notes}
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingDetails