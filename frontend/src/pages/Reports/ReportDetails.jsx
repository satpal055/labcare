
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'
import { useSelector } from 'react-redux'

function ReportDetails() {
  const { id } = useParams()


  const user = useSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'admin'
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

      const response = await api.get(`/reports/${id}`)
      const loadedReport = response.data.report

      setReport(loadedReport)
      setFormTests(
        loadedReport.tests.map((test) => ({
          test: test.test,
          testId: test.testId,
          name: test.name,
          result: test.result || '',
          unit: test.unit || '',
          normalRange: test.normalRange || '',
          remarks: test.remarks || '',
        }))
      )
      setClinicalNotes(loadedReport.clinicalNotes || '')
    } catch (error) {
      console.error('FETCH REPORT ERROR:', error)
      setError(error.response?.data?.message || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [id])

  const handleTestChange = (index, field, value) => {
    setFormTests((currentTests) =>
      currentTests.map((test, testIndex) =>
        testIndex === index ? { ...test, [field]: value } : test
      )
    )
  }

  const saveResults = async () => {
    try {
      setSaving(true)
      setError('')
      setMessage('')

      const response = await api.put(`/reports/${id}/results`, {
        tests: formTests.map((test) => ({
          test: test.test,
          result: test.result,
          unit: test.unit,
          normalRange: test.normalRange,
          remarks: test.remarks,
        })),
        clinicalNotes,
      })

      const updatedReport = response.data.report
      setReport(updatedReport)
      setFormTests(
        updatedReport.tests.map((test) => ({
          test: test.test,
          testId: test.testId,
          name: test.name,
          result: test.result || '',
          unit: test.unit || '',
          normalRange: test.normalRange || '',
          remarks: test.remarks || '',
        }))
      )
      setClinicalNotes(updatedReport.clinicalNotes || '')
      setMessage('Report results saved successfully.')
    } catch (error) {
      console.error('SAVE REPORT ERROR:', error)
      setError(
        error.response?.data?.message || 'Failed to save report results'
      )
    } finally {
      setSaving(false)
    }
  }

  const verifyReport = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to verify this report? After verification, results cannot be edited.'
    )

    if (!confirmed) return

    try {
      setVerifying(true)
      setError('')
      setMessage('')

      const response = await api.patch(`/reports/${id}/verify`)
      const updatedReport = response.data.report

      setReport(updatedReport)
      setFormTests(
        updatedReport.tests.map((test) => ({
          test: test.test,
          testId: test.testId,
          name: test.name,
          result: test.result || '',
          unit: test.unit || '',
          normalRange: test.normalRange || '',
          remarks: test.remarks || '',
        }))
      )
      setClinicalNotes(updatedReport.clinicalNotes || '')
      setMessage('Report verified successfully.')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify report')
    } finally {
      setVerifying(false)
    }
  }

  const handlePrint = () => window.print()

  const getStatusClasses = (value) => {
    const classes = {
      draft: 'bg-amber-50 text-amber-700 ring-amber-200',
      completed: 'bg-blue-50 text-blue-700 ring-blue-200',
      verified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    }

    return classes[value] || 'bg-slate-50 text-slate-600 ring-slate-200'
  }

  const formatStatus = (value) =>
    value
      ?.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-slate-500">Loading report...</p>
      </div>
    )
  }

  if (error && !report) {
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

  if (!report) return null

  const isVerified = report.status === 'verified'
  const displayedTests = isVerified ? report.tests : formTests

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div id="printable-report" className="space-y-6 bg-white p-3">
        {/* Professional Report Header */}
        <div className="border-b-2 border-slate-800 pb-5">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-widest text-slate-900">
              LABCARE
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Medical Laboratory &amp; Diagnostics
            </p>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-blue-700" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Laboratory Test Report
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Report ID</p>
              <p className="font-bold text-slate-900">{report.reportId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Booking ID</p>
              <p className="font-bold text-slate-900">{report.bookingId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Report Date</p>
              <p className="font-semibold text-slate-900">
                {report.reportDate
                  ? new Date(report.reportDate).toLocaleDateString('en-GB')
                  : '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Status</p>
              <p className="font-bold uppercase text-slate-900">
                {formatStatus(report.status)}
              </p>
            </div>
          </div>
        </div>

        {/* Screen-only messages and controls */}
        <div className="no-print space-y-4">
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
              className="me-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Reports
            </Link>

            {isVerified && (
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Print / Save PDF
              </button>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                {report.reportId}
              </h2>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClasses(report.status)}`}
              >
                {formatStatus(report.status)}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Report created on{' '}
              {report.reportDate
                ? new Date(report.reportDate).toLocaleString()
                : '—'}
            </p>
          </div>
        </div>

        {/* Patient and Booking Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Patient Information
            </p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              {report.patientName || report.patient?.name || '—'}
            </h2>
            <p className="mt-1 text-sm font-medium text-blue-600">
              {report.patientId || '—'}
            </p>

            {report.patient && (
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {report.patient.phone || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Gender</p>
                  <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                    {report.patient.gender || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Blood Group</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {report.patient.bloodGroup || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {report.patient.email || '—'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Booking Information
            </p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              {report.bookingId || '—'}
            </h2>

            {report.booking && (
              <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">Booking Date</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {report.booking.bookingDate
                      ? new Date(report.booking.bookingDate).toLocaleString()
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Sample Collection</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {report.booking.sampleCollectionDate
                      ? new Date(report.booking.sampleCollectionDate).toLocaleString()
                      : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editable form: only for unverified reports */}
        {!isVerified && (
          <div className="no-print overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                  key={`${test.testId}-${index}`}
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
                    {[
                      { field: 'result', label: 'Result', placeholder: 'Enter result' },
                      { field: 'unit', label: 'Unit', placeholder: 'e.g. g/dL' },
                      { field: 'normalRange', label: 'Normal Range', placeholder: 'e.g. 13–17' },
                      { field: 'remarks', label: 'Remarks', placeholder: 'e.g. Normal' },
                    ].map((item) => (
                      <div key={item.field}>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          {item.label}
                        </label>
                        <input
                          type="text"
                          value={test[item.field]}
                          onChange={(event) =>
                            handleTestChange(index, item.field, event.target.value)
                          }
                          placeholder={item.placeholder}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    ))}
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
                  onChange={(event) => setClinicalNotes(event.target.value)}
                  placeholder="Enter any additional clinical notes..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveResults}
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Results'}
                </button>

                {isAdmin && report.status === 'completed' &&  (
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
        )}

        {/* Results table: visible on screen for verified reports, and when printing */}
        <div className={isVerified ? 'overflow-hidden rounded-2xl border border-slate-200 bg-white' : 'print-only-results'}>
          <h2 className="border-b border-slate-200 px-5 py-4 text-lg font-bold text-slate-900">
            Laboratory Test Results
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-300 bg-slate-50 p-2 text-left">Test</th>
                  <th className="border border-slate-300 bg-slate-50 p-2 text-left">Result</th>
                  <th className="border border-slate-300 bg-slate-50 p-2 text-left">Unit</th>
                  <th className="border border-slate-300 bg-slate-50 p-2 text-left">Reference Range</th>
                  <th className="border border-slate-300 bg-slate-50 p-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {displayedTests.map((test, index) => (
                  <tr key={`${test.testId || test.test}-${index}`}>
                    <td className="border border-slate-300 p-2">
                      {test.name || test.test?.name || test.test || '—'}
                    </td>
                    <td className="border border-slate-300 p-2">
                      {test.result || 'Not entered'}
                    </td>
                    <td className="border border-slate-300 p-2">{test.unit || '—'}</td>
                    <td className="border border-slate-300 p-2">{test.normalRange || '—'}</td>
                    <td className="border border-slate-300 p-2">{test.remarks || '—'}</td>
                  </tr>
                ))}
                {displayedTests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="border border-slate-300 p-4 text-center text-slate-500">
                      No tests found for this report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Audit Trail */}
        {isVerified && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 print:border-slate-300 print:bg-white">
            <h2 className="text-base font-bold text-slate-900">
              Report Verification
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Verified By</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {typeof report.verifiedBy === 'object'
                    ? report.verifiedBy?.name || report.verifiedBy?.email || 'Authorized user'
                    : 'Authorized user'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Verification Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {report.verifiedAt
                    ? new Date(report.verifiedAt).toLocaleString()
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Notes */}
        {report.clinicalNotes && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 print:border-0 print:p-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Clinical Notes
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {report.clinicalNotes}
            </p>
          </div>
        )}

        {/* Signature placeholders */}
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-slate-200 pt-6 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <div className="mb-2 h-12 border-b border-slate-400" />
            <p className="text-sm font-semibold text-slate-800">
              Laboratory Technician
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Authorized laboratory personnel
            </p>
          </div>
          <div>
            <div className="mb-2 h-12 border-b border-slate-400" />
            <p className="text-sm font-semibold text-slate-800">
              Reviewing Pathologist
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Signature and applicable registration details
            </p>
          </div>
        </div>

        <p className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          This report should be interpreted by a qualified healthcare
          professional in the context of the patient's clinical condition.
        </p>
      </div>
    </div>
  )
}

export default ReportDetails
