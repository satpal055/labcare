
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Test = require('../models/Test')
const Booking = require('../models/Booking')
const Report = require('../models/Report')

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalTests,
      pendingReports,
      recentBookings,
    ] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Doctor.countDocuments({ isActive: true }),
      Test.countDocuments({ isActive: true }),
      Report.countDocuments({
        status: { $in: ['draft', 'completed'] },
      }),
      Booking.find()
        .select(
          'bookingId patientName doctorName tests status bookingDate'
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ])

    return res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalTests,
        pendingReports,
      },
      recentBookings,
    })
  } catch (error) {
    console.error('Dashboard Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
    })
  }
}

module.exports = {
  getDashboardStats,
}
