const express = require('express')

const {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} = require('../controllers/testController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', createTest)
router.get('/', getTests)
router.get('/:id', getTestById)
router.put('/:id', updateTest)
router.delete('/:id', deleteTest)

module.exports = router