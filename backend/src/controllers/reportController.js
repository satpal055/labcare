
const Report = require('../models/Report')
const Booking = require('../models/Booking')
const mongoose = require('mongoose')

// Generate the next report ID
const generateReportId = async () => {
  const lastReport = await Report.findOne()
    .sort({ createdAt: -1 })

  if (!lastReport) {
    return 'REP-000001'
  }

  const lastNumber = parseInt(
    lastReport.reportId.split('-')[1],
    10
  )

  const nextNumber = lastNumber + 1

  return `REP-${String(nextNumber).padStart(6, '0')}`
}

// Create a report for a completed booking
const createReport = async (req, res) => {
  try {
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      })
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message:
          'Report can only be created for completed bookings',
      })
    }

    const existingReport = await Report.findOne({
      booking: booking._id,
    })

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: 'Report already exists for this booking',
        report: existingReport,
      })
    }

    const reportTests = booking.tests.map((test) => ({
      test: test.test,
      testId: test.testId,
      name: test.name,
      result: '',
      unit: '',
      normalRange: '',
      remarks: '',
    }))

    const reportId = await generateReportId()

    const report = await Report.create({
      reportId,
      booking: booking._id,
      bookingId: booking.bookingId,
      patient: booking.patient,
      patientId: booking.patientId,
      patientName: booking.patientName,
      tests: reportTests,
      createdBy: req.user.id,
    })

    return res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report,
    })
  } catch (error) {
    console.error('CREATE REPORT ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get reports with search and status filters
const getReports = async (req, res) => {
  try {
    const {
      search = '',
      status = '',
    } = req.query

    const query = {}

    if (search.trim()) {
      query.$or = [
        {
          reportId: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          bookingId: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          patientId: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          patientName: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ]
    }

    if (status.trim()) {
      query.status = status.trim()
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .populate(
        'patient',
        'patientId firstName lastName phone email gender dateOfBirth bloodGroup'
      )

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    })
  } catch (error) {
    console.error('GET REPORTS ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get a single report by MongoDB ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID',
      })
    }

    const report = await Report.findById(id)
      .populate(
        'patient',
        'patientId firstName lastName phone email gender dateOfBirth bloodGroup address city'
      )
      .populate(
        'booking',
        'bookingId bookingDate sampleCollectionDate status paymentStatus'
      )
      .populate(
        'createdBy',
        'name email role'
      )
      .populate(
        'verifiedBy',
        'name email role'
      )

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      })
    }

    return res.status(200).json({
      success: true,
      report,
    })
  } catch (error) {
    console.error('GET REPORT ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Save report test results and clinical notes
const updateReportResults = async (req, res) => {
  try {
    const { id } = req.params
    const {
      tests,
      clinicalNotes = '',
    } = req.body

    // Validate the report ID before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID',
      })
    }

    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Test results are required',
      })
    }

    const report = await Report.findById(id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      })
    }

    // Verified reports cannot be modified
    if (report.status === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Verified report cannot be modified',
      })
    }

    for (const incomingTest of tests) {
      if (
        !incomingTest ||
        !incomingTest.test
      ) {
        continue
      }

      const existingTest = report.tests.find(
        (test) =>
          test.test.toString() ===
          incomingTest.test.toString()
      )

      // Ignore tests that do not belong to this report
      if (!existingTest) {
        continue
      }

      existingTest.result =
        typeof incomingTest.result === 'string'
          ? incomingTest.result.trim()
          : ''

      existingTest.unit =
        typeof incomingTest.unit === 'string'
          ? incomingTest.unit.trim()
          : ''

      existingTest.normalRange =
        typeof incomingTest.normalRange === 'string'
          ? incomingTest.normalRange.trim()
          : ''

      existingTest.remarks =
        typeof incomingTest.remarks === 'string'
          ? incomingTest.remarks.trim()
          : ''
    }

    report.clinicalNotes =
      typeof clinicalNotes === 'string'
        ? clinicalNotes.trim()
        : ''

    report.status = 'completed'

    await report.save()

    const updatedReport = await Report.findById(report._id)
      .populate(
        'patient',
        'patientId firstName lastName phone email gender dateOfBirth bloodGroup address city'
      )
      .populate(
        'booking',
        'bookingId bookingDate sampleCollectionDate status paymentStatus'
      )
      .populate(
        'createdBy',
        'name email role'
      )
      .populate(
        'verifiedBy',
        'name email role'
      )

    return res.status(200).json({
      success: true,
      message: 'Report results saved successfully',
      report: updatedReport,
    })
  } catch (error) {
    console.error('UPDATE REPORT RESULTS ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Verify a completed report
const verifyReport = async (req, res) => {
  try {
    // Only Admin can verify reports
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can verify reports',
      })
    }

    const { id } = req.params

    // Validate the report ID before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID',
      })
    }

    const report = await Report.findById(id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      })
    }

    // Prevent re-verification
    if (report.status === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Report is already verified',
      })
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed reports can be verified',
      })
    }

    // Every test must have a result before verification
    const hasMissingResults = report.tests.some(
      (test) =>
        typeof test.result !== 'string' ||
        !test.result.trim()
    )

    if (hasMissingResults) {
      return res.status(400).json({
        success: false,
        message: 'Enter all test results before verification',
      })
    }

    report.status = 'verified'
    report.verifiedBy = req.user.id
    report.verifiedAt = new Date()

    await report.save()

    const populatedReport = await Report.findById(report._id)
      .populate('patient')
      .populate('booking')
      .populate('createdBy', 'name email role')
      .populate('verifiedBy', 'name email role')

    return res.status(200).json({
      success: true,
      message: 'Report verified successfully',
      report: populatedReport,
    })
  } catch (error) {
    console.error('VERIFY REPORT ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to verify report',
      error: error.message,
    })
  }
}

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReportResults,
  verifyReport,
}
