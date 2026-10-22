const express = require('express')

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  collectSample,
  startProcessing,
  completeBooking,
} = require('../controllers/bookingController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', createBooking)

router.get('/', getBookings)

router.get('/:id', getBookingById)

router.patch('/:id/status', updateBookingStatus)

router.patch('/:id/payment-status', updatePaymentStatus)

router.patch('/:id/collect-sample', collectSample)

router.patch('/:id/start-processing', startProcessing)

router.patch('/:id/complete', completeBooking)

module.exports = router