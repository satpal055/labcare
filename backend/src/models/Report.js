const mongoose = require('mongoose')

const reportTestSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },

    testId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    result: {
      type: String,
      trim: true,
      default: '',
    },

    unit: {
      type: String,
      trim: true,
      default: '',
    },

    normalRange: {
      type: String,
      trim: true,
      default: '',
    },

    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
)

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },

    bookingId: {
      type: String,
      required: true,
      trim: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },

    patientId: {
      type: String,
      required: true,
      trim: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    tests: {
      type: [reportTestSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'At least one test is required',
      },
    },

    reportDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        'draft',
        'completed',
        'verified',
      ],
      default: 'draft',
    },

    clinicalNotes: {
      type: String,
      trim: true,
      default: '',
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'Report',
  reportSchema
)