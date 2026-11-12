
const express = require('express')
const cors = require('cors')

const healthRoutes = require('./routes/healthRoutes')
const authRoutes = require('./routes/authRoutes')
const testRoutes = require('./routes/testRoutes')
const patientRoutes = require('./routes/patientRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reportRoutes = require('./routes/reportRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

// Allow only the local LabCare frontend
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://labcare-liart.vercel.app',
    ],
  })
)

app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/dashboard', dashboardRoutes)

module.exports = app
