const express = require('express')

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', createCategory)
router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router