const Doctor = require('../models/Doctor')

// Create Doctor
const createDoctor = async (req, res) => {
  try {
    const {
      doctorId,
      firstName,
      lastName,
      specialization,
      qualification,
      phone,
      email,
      gender,
      experience,
      consultationFee,
      address,
      city,
      registrationNumber,
      bio,
    } = req.body

    if (
      !doctorId ||
      !firstName ||
      !lastName ||
      !specialization ||
      !qualification ||
      !phone ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Doctor ID, name, specialization, qualification, gender and phone are required',
      })
    }

    const existingDoctor = await Doctor.findOne({
      doctorId,
    })

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor ID already exists',
      })
    }

    const doctor = await Doctor.create({
      doctorId,
      firstName,
      lastName,
      specialization,
      qualification,
      phone,
      email,
      gender,
      experience,
      consultationFee,
      address,
      city,
      registrationNumber,
      bio,
    })

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor,
    })
  } catch (error) {
    console.error('CREATE DOCTOR ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

 

// Get All Doctors
const getDoctors = async (req, res) => {
  try {
    const {
      search = '',
      city = '',
      specialization = '',
      gender = '',
    } = req.query

    const query = {
      isActive: true,
    }

    if (search.trim()) {
      query.$or = [
        {
          doctorId: {
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
        {
          specialization: {
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

    if (specialization.trim()) {
      query.specialization = {
        $regex: specialization.trim(),
        $options: 'i',
      }
    }

    if (gender.trim()) {
      query.gender = gender.trim().toLowerCase()
    }

    const doctors = await Doctor.find(query).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    })
  } catch (error) {
    console.error('GET DOCTORS ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}
// Get Single Doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      })
    }

    res.status(200).json({
      success: true,
      doctor,
    })
  } catch (error) {
    console.error('GET DOCTOR ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Update Doctor
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      doctor,
    })
  } catch (error) {
    console.error('UPDATE DOCTOR ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Deactivate Doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    )

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deactivated successfully',
    })
  } catch (error) {
    console.error('DELETE DOCTOR ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}
module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
}