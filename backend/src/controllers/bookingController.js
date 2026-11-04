
const mongoose = require('mongoose')

const Booking = require('../models/Booking')
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Test = require('../models/Test')

const generateBookingId = async () => {
  const lastBooking = await Booking.findOne()
    .sort({ createdAt: -1 })
    .select('bookingId')

  if (!lastBooking) {
    return 'BOOK-000001'
  }

  const lastNumber = parseInt(
    lastBooking.bookingId.replace('BOOK-', ''),
    10
  )

  const nextNumber = lastNumber + 1

  return `BOOK-${String(nextNumber).padStart(6, '0')}`
}

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

const handleServerError = (res, error, label) => {
  console.error(`${label}:`, error)

  return res.status(500).json({
    success: false,
    message: 'Server error',
  })
}

const createBooking = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      tests,
      bookingDate,
      sampleCollectionDate,
      discount = 0,
      notes = '',
    } = req.body

    if (!patient || !isValidId(patient)) {
      return res.status(400).json({
        success: false,
        message: 'Valid patient is required',
      })
    }

    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one test is required',
      })
    }

    if (doctor && !isValidId(doctor)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID',
      })
    }

    // Check patient
    const patientData = await Patient.findOne({
      _id: patient,
      isActive: true,
    })

    if (!patientData) {
      return res.status(404).json({
        success: false,
        message: 'Active patient not found',
      })
    }

    // Check doctor if selected
    let doctorData = null

    if (doctor) {
      doctorData = await Doctor.findOne({
        _id: doctor,
        isActive: true,
      })

      if (!doctorData) {
        return res.status(404).json({
          success: false,
          message: 'Active doctor not found',
        })
      }
    }

    // Check tests and create snapshots
    const bookingTests = []

    for (const testId of tests) {
      if (!isValidId(testId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid test ID',
        })
      }

      const testData = await Test.findOne({
        _id: testId,
        isActive: true,
      })

      if (!testData) {
        return res.status(404).json({
          success: false,
          message: `Active test not found: ${testId}`,
        })
      }

      bookingTests.push({
        test: testData._id,
        testId: testData.testId,
        name: testData.name,
        price: testData.price,
      })
    }

    const totalAmount = bookingTests.reduce(
      (sum, test) => sum + test.price,
      0
    )

    const discountAmount = Number(discount)

    if (
      !Number.isFinite(discountAmount) ||
      discountAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discount amount',
      })
    }

    if (discountAmount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Discount cannot be greater than total amount',
      })
    }

    const finalAmount = totalAmount - discountAmount

    const bookingId = await generateBookingId()

    const booking = await Booking.create({
      bookingId,
      patient: patientData._id,
      patientId: patientData.patientId,
      patientName: `${patientData.firstName} ${patientData.lastName}`,

      doctor: doctorData ? doctorData._id : null,
      doctorName: doctorData
        ? `Dr. ${doctorData.firstName} ${doctorData.lastName}`
        : '',

      tests: bookingTests,

      bookingDate: bookingDate || new Date(),
      sampleCollectionDate:
        sampleCollectionDate || null,

      status: 'pending',

      // Payment must be confirmed separately by an admin.
      paymentStatus: 'pending',

      totalAmount,
      discount: discountAmount,
      finalAmount,

      notes,

      createdBy: req.user.id,
    })

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    })
  } catch (error) {
    return handleServerError(res, error, 'CREATE BOOKING ERROR')
  }
}

const getBookings = async (req, res) => {
  try {
    const {
      search = '',
      status = '',
      paymentStatus = '',
    } = req.query

    const query = {}

    if (search.trim()) {
      query.$or = [
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

    const allowedStatuses = [
      'pending',
      'confirmed',
      'sample-collected',
      'processing',
      'completed',
      'cancelled',
    ]

    const allowedPaymentStatuses = [
      'pending',
      'partial',
      'paid',
    ]

    if (status.trim()) {
      if (!allowedStatuses.includes(status.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking status filter',
        })
      }

      query.status = status.trim()
    }

    if (paymentStatus.trim()) {
      if (!allowedPaymentStatuses.includes(paymentStatus.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment status filter',
        })
      }

      query.paymentStatus = paymentStatus.trim()
    }

    const bookings = await Booking.find(query)
      .populate('patient', 'patientId firstName lastName phone')
      .populate('doctor', 'doctorId firstName lastName specialization')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    return handleServerError(res, error, 'GET BOOKINGS ERROR')
  }
}

const getBookingById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    const booking = await Booking.findById(req.params.id)
      .populate(
        'patient',
        'patientId firstName lastName gender dateOfBirth phone email'
      )
      .populate(
        'doctor',
        'doctorId firstName lastName specialization qualification'
      )
      .populate(
        'createdBy',
        'name email role'
      )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    return res.status(200).json({
      success: true,
      booking,
    })
  } catch (error) {
    return handleServerError(res, error, 'GET BOOKING ERROR')
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    // These statuses must use their dedicated workflow endpoints.
    const allowedStatuses = [
      'pending',
      'confirmed',
      'cancelled',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      })
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (
      ['sample-collected', 'processing', 'completed'].includes(
        booking.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Booking has already entered the processing workflow',
      })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking cannot be updated',
      })
    }

    booking.status = status
    await booking.save()

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    })
  } catch (error) {
    return handleServerError(
      res,
      error,
      'UPDATE BOOKING STATUS ERROR'
    )
  }
}

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body

    const allowedStatuses = [
      'pending',
      'partial',
      'paid',
    ]

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      })
    }

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    // Only admins can confirm or modify payment status.
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can update payment status',
      })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    booking.paymentStatus = paymentStatus
    await booking.save()

    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      booking,
    })
  } catch (error) {
    return handleServerError(
      res,
      error,
      'UPDATE PAYMENT STATUS ERROR'
    )
  }
}

const collectSample = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (
      booking.status === 'cancelled' ||
      booking.status === 'completed'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Sample cannot be collected for this booking',
      })
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not eligible for sample collection',
      })
    }

    if (booking.sampleCollectionDate) {
      return res.status(400).json({
        success: false,
        message: 'Sample has already been collected',
      })
    }

    booking.sampleCollectionDate = new Date()
    booking.status = 'sample-collected'

    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate(
        'patient',
        'patientId firstName lastName phone email gender'
      )
      .populate(
        'doctor',
        'doctorId firstName lastName specialization qualification'
      )
      .populate(
        'createdBy',
        'name email role'
      )

    return res.status(200).json({
      success: true,
      message: 'Sample collected successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    return handleServerError(res, error, 'COLLECT SAMPLE ERROR')
  }
}

const startProcessing = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.status !== 'sample-collected') {
      return res.status(400).json({
        success: false,
        message: 'Sample must be collected before processing starts',
      })
    }

    booking.status = 'processing'

    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate(
        'patient',
        'patientId firstName lastName phone email gender'
      )
      .populate(
        'doctor',
        'doctorId firstName lastName specialization qualification'
      )
      .populate(
        'createdBy',
        'name email role'
      )

    return res.status(200).json({
      success: true,
      message: 'Booking processing started successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    return handleServerError(res, error, 'START PROCESSING ERROR')
  }
}

const completeBooking = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be in processing status before completion',
      })
    }

    booking.status = 'completed'

    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate(
        'patient',
        'patientId firstName lastName phone email gender'
      )
      .populate(
        'doctor',
        'doctorId firstName lastName specialization qualification'
      )
      .populate(
        'createdBy',
        'name email role'
      )

    return res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    return handleServerError(res, error, 'COMPLETE BOOKING ERROR')
  }
}

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  collectSample,
  startProcessing,
  completeBooking,
}
