const { protect } = require('../middleware/authMiddleware')
const express = require('express')

const {
  registerUser,
  loginUser,
} = require('../controllers/authController')

const router = express.Router()

router.post('/register', protect, registerUser)
router.post('/login', loginUser)

module.exports = router