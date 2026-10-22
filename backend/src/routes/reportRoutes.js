const express = require('express')

const {
  createReport,
  getReports,
  updateReportResults,
  verifyReport,
  getReportById,
} = require('../controllers/reportController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', createReport)

router.get('/', getReports)

router.put('/:id/results', updateReportResults)

router.patch('/:id/verify', verifyReport)

router.get('/:id', getReportById)

module.exports = router