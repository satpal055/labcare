import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import api from '../../services/api'

function ReportDetails() {
  const { id } = useParams()
const [verifying, setVerifying] = useState(false)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
const [message, setMessage] = useState('')
const [formTests, setFormTests] = useState([])
const [clinicalNotes, setClinicalNotes] = useState('')

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get(
        `/reports/${id}`
      )

      const loadedReport = response.data.report

setReport(loadedReport)

setFormTests(
  loadedReport.tests.map((test) => ({
    test: test.test,
    testId: test.testId,
    name: test.name,
    result: test.result || '',
    unit: test.unit || '',
    normalRange:
      test.normalRange || '',
    remarks: test.remarks || '',
  }))
)

setClinicalNotes(
  loadedReport.clinicalNotes || ''
)
    } catch (error) {
      console.error(
        'FETCH REPORT ERROR:',
        error
      )

      setError(
        error.response?.data?.message ||
          'Failed to load report'
      )
    } finally {
      setLoading(false)
    }
  }
  const handleTestChange = (
  index,
  field,
  value
) => {
  setFormTests((currentTests) =>
    currentTests.map((test, testIndex) =>
      testIndex === index
        ? {
            ...test,
            [field]: value,
          }
        : test
    )
  )
}
const saveResults = async () => {
  try {
    setSaving(true)
    setError('')
    setMessage('')

    const response = await api.put(
      `/reports/${id}/results`,
      {
        tests: formTests.map((test) => ({
          test: test.test,
          result: test.result,
          unit: test.unit,
          normalRange: test.normalRange,
          remarks: test.remarks,
        })),
        clinicalNotes,
      }
    )

    const updatedReport = response.data.report

    setReport(updatedReport)

    setFormTests(
      updatedReport.tests.map((test) => ({
        test: test.test,
        testId: test.testId,
        name: test.name,
        result: test.result || '',
        unit: test.unit || '',
        normalRange:
          test.normalRange || '',
        remarks: test.remarks || '',
      }))
    )

    setMessage(
      'Report results saved successfully'
    )
  } catch (error) {
    console.error(
      'SAVE REPORT ERROR:',
      error
    )

    setError(
      error.response?.data?.message ||
        'Failed to save report results'
    )
  } finally {
    setSaving(false)
  }
}
const verifyReport = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to verify this report? After verification, results cannot be edited.'
  )

  if (!confirmed) {
    return
  }

  try {
    setVerifying(true)
    setMessage('')

    const response = await api.patch(
      `/reports/${id}/verify`
    )

    setReport(response.data.report)

    setFormTests(
      response.data.report.tests.map((test) => ({
        test: test.test,
        testId: test.testId,
        name: test.name,
        result: test.result || '',
        unit: test.unit || '',
        normalRange: test.normalRange || '',
        remarks: test.remarks || '',
      }))
    )

    setClinicalNotes(
      response.data.report.clinicalNotes || ''
    )

    setMessage('Report verified successfully.')
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
      'Failed to verify report'
    )
  } finally {
    setVerifying(false)
  }
}
  useEffect(() => {
    fetchReport()
  }, [id])

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
const handlePrint = () => {
  window.print()
}
  if (loading) {
    return (
        
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading report...
        </p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Link
          to="/reports"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Reports
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Report not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div id="printable-report" className="space-y-6 p-3">
        {/* Laboratory Report Header */}
<div className="border-b-2 border-blue-700 pb-5">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-blue-800">
        LABCARE
      </h1>

      <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-slate-600">
        Medical Laboratory & Diagnostics
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Laboratory Test Report
      </p>
    </div>

    <div className="text-sm text-slate-600 sm:text-right">
      <p>
        <span className="font-semibold">Report ID:</span>{' '}
        {report.reportId}
      </p>

      <p className="mt-1">
        <span className="font-semibold">Booking ID:</span>{' '}
        {report.bookingId}
      </p>

      <p className="mt-1">
        <span className="font-semibold">Report Date:</span>{' '}
        {new Date(report.reportDate).toLocaleDateString()}
      </p>

      <p className="mt-2 font-bold uppercase text-emerald-700">
        {report.status === 'verified'
          ? 'Verified Report'
          : 'Not Yet Verified'}
      </p>
    </div>
  </div>
</div>
      {/* Header */}
        {message && (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        {message}
      </div>
    )}

    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {error}
      </div>
    )}
      <div>
        <Link
          to="/reports"
          className=" no-print text-sm font-medium text-blue-600 hover:text-blue-700 me-3"
        >
          ← Back to Reports
        </Link>
{report.status === 'verified' && (
  <button
    type="button"
    onClick={handlePrint}
    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
  >
    Print / Save PDF
  </button>
)}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">
            {report.reportId}
          </h1>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
              report.status
            )}`}
          >
            {formatStatus(report.status)}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Report created on{' '}
          {new Date(
            report.reportDate
          ).toLocaleString()}
        </p>
      </div>

      {/* Patient + Booking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Patient Information
          </p>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            {report.patientName}
          </h2>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {report.patientId}
          </p>

          {report.patient && (
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {report.patient.phone || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Gender
                </p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                  {report.patient.gender || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Blood Group
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {report.patient.bloodGroup || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Email
                </p>
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {report.patient.email || '—'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Booking Information
          </p>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            {report.bookingId}
          </h2>

          {report.booking && (
            <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs text-slate-400">
                  Booking Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {new Date(
                    report.booking.bookingDate
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Sample Collection
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {report.booking
                    .sampleCollectionDate
                    ? new Date(
                        report.booking
                          .sampleCollectionDate
                      ).toLocaleString()
                    : '—'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test Results */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <div className="border-b border-slate-200 px-6 py-5">
    <h2 className="text-lg font-semibold text-slate-900">
      Enter Test Results
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Enter laboratory findings for each test.
    </p>
  </div>

  <div className="space-y-6 p-6">
    {formTests.map((test, index) => (
      <div
        key={test.test}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {test.testId}
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {test.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Result
            </label>

            <input
              type="text"
              value={test.result}  
              onChange={(event) =>
                handleTestChange(
                  index,
                  'result',
                  event.target.value
                )
              }
              placeholder="Enter result"
              disabled={report.status === 'verified'}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Unit
            </label>

            <input
              type="text"
              value={test.unit}  
              onChange={(event) =>
                handleTestChange(
                  index,
                  'unit',
                  event.target.value
                )
              }
              placeholder="e.g. g/dL"
              disabled={report.status === 'verified'}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Normal Range
            </label>

            <input
              type="text"
              value={test.normalRange}  
              onChange={(event) =>
                handleTestChange(
                  index,
                  'normalRange',
                  event.target.value
                )
              }
              placeholder="e.g. 13–17"
              disabled={report.status === 'verified'}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Remarks
            </label>

            <input
              type="text"
              value={test.remarks}  
              onChange={(event) =>
                handleTestChange(
                  index,
                  'remarks',
                  event.target.value
                )
              }
              placeholder="e.g. Normal"
              disabled={report.status === 'verified'}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>
    ))}

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Clinical Notes
      </label>

      <textarea
        rows="4"
        value={clinicalNotes}
        onChange={(event) =>
          setClinicalNotes(event.target.value)
        }
        placeholder="Enter any additional clinical notes..."
        disabled={report.status === 'verified'}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
      />
    </div>

    <div className="flex flex-wrap gap-3">
  {report.status !== 'verified' && (
    <button
      type="button"
      onClick={saveResults}
      disabled={saving}
      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? 'Saving...' : 'Save Results'}
    </button>
  )}

  {report.status === 'completed' && (
    <button
      type="button"
      onClick={verifyReport}
      disabled={verifying}
      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {verifying ? 'Verifying...' : 'Verify Report'}
    </button>
  )}
</div>
  </div>
</div>

      {/* Clinical Notes */}
      {report.clinicalNotes && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Clinical Notes
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {report.clinicalNotes}
          </p>
        </div>
      )}
      {/* Report Signature Footer */}
<div className="mt-12 grid grid-cols-1 gap-10 border-t border-slate-200 pt-6 sm:grid-cols-2">
  <div>
    <div className="mb-2 h-12 border-b border-slate-400"></div>

    <p className="text-sm font-semibold text-slate-800">
      Laboratory Technician
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Authorized laboratory personnel
    </p>
  </div>

  <div>
    <div className="mb-2 h-12 border-b border-slate-400"></div>

    <p className="text-sm font-semibold text-slate-800">
      Reviewing Pathologist
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Signature and applicable registration details
    </p>
  </div>
</div>

<p className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
  This report should be interpreted by a qualified healthcare professional
  in the context of the patient's clinical condition.
</p>
    </div>
    </div>
  )
}

export default ReportDetails