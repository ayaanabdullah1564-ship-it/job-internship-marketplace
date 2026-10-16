const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: [
        'Applied',
        'Shortlisted',
        'Rejected',
        'Accepted'
      ],
      default: 'Applied'
    },

    coverLetter: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
)

applicationSchema.index(
  { job: 1, applicant: 1 },
  { unique: true }
)

const Application = mongoose.model(
  'Application',
  applicationSchema
)

module.exports = Application