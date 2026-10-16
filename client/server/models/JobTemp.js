const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: ['Internship', 'Full-time', 'Part-time', 'Remote', 'Contract']
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    requirements: {
      type: [String],
      default: []
    },

    skills: {
      type: [String],
      default: []
    },

    salary: {
      type: String,
      default: 'Not specified',
      trim: true
    },

    experience: {
      type: String,
      default: 'Fresher',
      trim: true
    },

    education: {
      type: String,
      default: 'Any',
      trim: true
    },

    openings: {
      type: Number,
      default: 1,
      min: 1
    },

    companyWebsite: {
      type: String,
      default: '',
      trim: true
    },

    applicationDeadline: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: true
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },

  {
    timestamps: true
  }
)

const Job = mongoose.model('Job', jobSchema)

module.exports = Job