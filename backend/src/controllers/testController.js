const Test = require('../models/Test')

// Create Test
const createTest = async (req, res) => {
  try {
    const {
      testId,
      name,
      shortName,
      category,
      description,
      sampleType,
      preparation,
      reportTime,
      price,
      normalRange,
      unit,
    } = req.body

    if (
      !testId ||
      !name ||
      !category ||
      !sampleType ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Test ID, name, category, sample type and price are required',
      })
    }

    const existingTest = await Test.findOne({
      testId,
    })

    if (existingTest) {
      return res.status(409).json({
        success: false,
        message: 'Test ID already exists',
      })
    }

    const test = await Test.create({
      testId,
      name,
      shortName,
      category,
      description,
      sampleType,
      preparation,
      reportTime,
      price,
      normalRange,
      unit,
    })

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      test,
    })
  } catch (error) {
    console.error('CREATE TEST ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get All Tests
const getTests = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      sampleType = '',
    } = req.query

    const query = {
      isActive: true,
    }

    if (search.trim()) {
      query.$or = [
        {
          testId: {
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
        {
          shortName: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ]
    }

    if (category.trim()) {
      query.category = {
        $regex: category.trim(),
        $options: 'i',
      }
    }

    if (sampleType.trim()) {
      query.sampleType = {
        $regex: sampleType.trim(),
        $options: 'i',
      }
    }

    const tests = await Test.find(query).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    })
  } catch (error) {
    console.error('GET TESTS ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get Single Test
const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    res.status(200).json({
      success: true,
      test,
    })
  } catch (error) {
    console.error('GET TEST ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Update Test
const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      test,
    })
  } catch (error) {
    console.error('UPDATE TEST ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Deactivate Test
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    )

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Test deactivated successfully',
    })
  } catch (error) {
    console.error('DELETE TEST ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

module.exports = {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
}