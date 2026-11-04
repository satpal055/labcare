
require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

// Validate JWT secret before starting the server
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Server startup failed: JWT_SECRET must be at least 32 characters long.')
  process.exit(1)
}

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`LabCare server running on port ${PORT}`)
  })
}

startServer()
