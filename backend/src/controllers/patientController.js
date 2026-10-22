const Patient = require('../models/Patient')

// Create Patient
const createPatient = async (req, res) => {
  try {
    const {
      patientId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      city,
      bloodGroup,
      emergencyContact,
    } = req.body

    if (
      !patientId ||
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Patient ID, name, gender, date of birth and phone are required',
      })
    }

    const existingPatient = await Patient.findOne({
      patientId,
    })

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient ID already exists',
      })
    }

    const patient = await Patient.create({
      patientId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      city,
      bloodGroup,
      emergencyContact,
    })

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient,
    })
  } catch (error) {
    console.error('CREATE PATIENT ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get All Patients
const getPatients = async (req, res) => {
  try {
    const {
      search = '',
      city = '',
      gender = '',
      bloodGroup = '',
    } = req.query

    const query = {
      isActive: true,
    }

    if (search.trim()) {
      query.$or = [
        {
          patientId: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          firstName: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          lastName: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ]
    }

    if (city.trim()) {
      query.city = {
        $regex: city.trim(),
        $options: 'i',
      }
    }

    if (gender.trim()) {
      query.gender = gender.trim().toLowerCase()
    }

    if (bloodGroup.trim()) {
      query.bloodGroup = bloodGroup.trim()
    }

    const patients = await Patient.find(query).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    })
  } catch (error) {
    console.error('GET PATIENTS ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Get Single Patient
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      })
    }

    res.status(200).json({
      success: true,
      patient,
    })
  } catch (error) {
    console.error('GET PATIENT ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Update Patient
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      patient,
    })
  } catch (error) {
    console.error('UPDATE PATIENT ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Deactivate Patient
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    )

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Patient deactivated successfully',
    })
  } catch (error) {
    console.error('DELETE PATIENT ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
}