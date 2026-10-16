const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    // ==============================
    // BASIC USER INFORMATION
    // ==============================

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },

    // ==============================
    // USER ROLE
    // ==============================

    role: {
      type: String,
      enum: {
        values: ['student', 'company', 'admin'],
        message: 'Invalid user role'
      },
      default: 'student'
    },

    // ==============================
    // STUDENT PROFILE
    // ==============================

    phone: {
      type: String,
      trim: true,
      default: ''
    },

    location: {
      type: String,
      trim: true,
      default: ''
    },

    education: {
      type: String,
      trim: true,
      default: ''
    },

    skills: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },

    resume: {
      type: String,
      default: ''
    },

    // ==============================
    // COMPANY INFORMATION
    // ==============================

    companyName: {
      type: String,
      trim: true,
      default: ''
    },

    companyWebsite: {
      type: String,
      trim: true,
      default: ''
    },

    companyDescription: {
      type: String,
      trim: true,
      default: ''
    },

    // ==============================
    // ACCOUNT STATUS
    // ==============================

    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    // ==============================
    // SAVED JOBS
    // ==============================

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ]

  },

  // ==============================
  // AUTOMATIC TIMESTAMPS
  // ==============================

  {
    timestamps: true
  }
)

// ==============================
// CREATE USER MODEL
// ==============================

const User = mongoose.model('User', userSchema)

module.exports = User