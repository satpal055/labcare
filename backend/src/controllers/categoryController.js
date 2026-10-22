const Category = require('../models/Category')

const createCategory = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
    } = req.body

    if (!categoryId || !name) {
      return res.status(400).json({
        success: false,
        message: 'Category ID and name are required',
      })
    }

    const existingId = await Category.findOne({
      categoryId: categoryId.trim(),
    })

    if (existingId) {
      return res.status(409).json({
        success: false,
        message: 'Category ID already exists',
      })
    }

    const existingName = await Category.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: 'i',
      },
    })

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: 'Category name already exists',
      })
    }

    const category = await Category.create({
      categoryId: categoryId.trim(),
      name: name.trim(),
      description: description?.trim(),
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    })
  } catch (error) {
    console.error('CREATE CATEGORY ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

const getCategories = async (req, res) => {
  try {
    const {
      search = '',
    } = req.query

    const query = {
      isActive: true,
    }

    if (search.trim()) {
      query.$or = [
        {
          categoryId: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          name: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ]
    }

    const categories = await Category.find(query).sort({
      name: 1,
    })

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    console.error('GET CATEGORIES ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    res.status(200).json({
      success: true,
      category,
    })
  } catch (error) {
    console.error('GET CATEGORY ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

const updateCategory = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
    } = req.body

    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    if (categoryId && categoryId !== category.categoryId) {
      const existingId = await Category.findOne({
        categoryId: categoryId.trim(),
        _id: { $ne: req.params.id },
      })

      if (existingId) {
        return res.status(409).json({
          success: false,
          message: 'Category ID already exists',
        })
      }
    }

    if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existingName = await Category.findOne({
        name: {
          $regex: `^${name.trim()}$`,
          $options: 'i',
        },
        _id: { $ne: req.params.id },
      })

      if (existingName) {
        return res.status(409).json({
          success: false,
          message: 'Category name already exists',
        })
      }
    }

    category.categoryId = categoryId?.trim() || category.categoryId
    category.name = name?.trim() || category.name
    category.description = description?.trim() || ''

    await category.save()

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    })
  } catch (error) {
    console.error('UPDATE CATEGORY ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    )

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Category deactivated successfully',
    })
  } catch (error) {
    console.error('DELETE CATEGORY ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}