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

const createBooking = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      tests,
      bookingDate,
      sampleCollectionDate,
      discount = 0,
      paymentStatus = 'pending',
      notes = '',
    } = req.body

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: 'Patient is required',
      })
    }

    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one test is required',
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

    const discountAmount = Number(discount) || 0

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
      paymentStatus,

      totalAmount,
      discount: discountAmount,
      finalAmount,

      notes,

      createdBy: req.user.id,
    })

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    })
  } catch (error) {
    console.error('CREATE BOOKING ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
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

    if (status.trim()) {
      query.status = status.trim()
    }

    if (paymentStatus.trim()) {
      query.paymentStatus = paymentStatus.trim()
    }

    const bookings = await Booking.find(query)
      .populate('patient', 'patientId firstName lastName phone')
      .populate('doctor', 'doctorId firstName lastName specialization')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    console.error('GET BOOKINGS ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

const getBookingById = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error('GET BOOKING ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'pending',
      'confirmed',
      'sample-collected',
      'processing',
      'completed',
      'cancelled',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    })
  } catch (error) {
    console.error('UPDATE BOOKING STATUS ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
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

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      booking,
    })
  } catch (error) {
    console.error('UPDATE PAYMENT STATUS ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}
const collectSample = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking sample cannot be collected',
      })
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed booking sample cannot be collected',
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

    const updatedBooking = await Booking.findById(
      booking._id
    )
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

    res.status(200).json({
      success: true,
      message: 'Sample collected successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('COLLECT SAMPLE ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}
const startProcessing = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking cannot be processed',
      })
    }

    if (booking.status !== 'sample-collected') {
      return res.status(400).json({
        success: false,
        message:
          'Sample must be collected before processing starts',
      })
    }

    booking.status = 'processing'

    await booking.save()

    const updatedBooking = await Booking.findById(
      booking._id
    )
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

    res.status(200).json({
      success: true,
      message: 'Booking processing started successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('START PROCESSING ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}
const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking cannot be completed',
      })
    }

    if (booking.status !== 'processing') {
      return res.status(400).json({
        success: false,
        message:
          'Booking must be in processing status before completion',
      })
    }

    booking.status = 'completed'

    await booking.save()

    const updatedBooking = await Booking.findById(
      booking._id
    )
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

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('COMPLETE BOOKING ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
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