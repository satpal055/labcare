const express = require('express')

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', createDoctor)
router.get('/', getDoctors)
router.get('/:id', getDoctorById)
router.put('/:id', updateDoctor)
router.delete('/:id', deleteDoctor)

module.exports = router  