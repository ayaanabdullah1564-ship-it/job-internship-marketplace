const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Job = require('./models/JobTemp')
const User = require('./models/user')
const Application = require('./models/Application')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors())
app.use(express.json())

// ========================================
// DATABASE CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('========================================')
    console.log('MongoDB connected successfully')
    console.log('Database connection is READY')
    console.log('========================================')
  })
  .catch((error) => {
    console.error('MongoDB connection FAILED')
    console.error(error.message)
  })

// ========================================
// BASIC ROUTE
// ========================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Job Marketplace Backend is working!',
    version: '4.0.0'
  })
})

// ========================================
// JWT MIDDLEWARE
// ========================================

function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const token = authHeader.split(' ')[1]

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'JWT_SECRET is missing in .env'
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

// ========================================
// ROLE AUTHORIZATION
// ========================================

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission'
      })
    }

    next()
  }
}

// ========================================
// REGISTER
// ========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const cleanEmail = email.toLowerCase().trim()

    const existingUser = await User.findOne({
      email: cleanEmail
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    const userRole = role || 'student'

    if (!['student', 'company'].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration role'
      })
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: userRole
    })

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    })
  }
})

// ========================================
// LOGIN
// ========================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      success: false,
      message: 'Login failed'
    })
  }
})

// ========================================
// CURRENT USER
// ========================================

app.get('/api/auth/me', protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    })
  }
})

// ========================================
// UPDATE PROFILE
// ========================================

app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const fields = [
      'name',
      'phone',
      'location',
      'education',
      'skills',
      'bio',
      'resume',
      'companyName',
      'companyWebsite',
      'companyDescription'
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field]
      }
    })

    const updatedUser = await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        education: updatedUser.education,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        resume: updatedUser.resume,
        companyName: updatedUser.companyName,
        companyWebsite: updatedUser.companyWebsite,
        companyDescription: updatedUser.companyDescription
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
})

// ========================================
// GET ALL JOBS
// ========================================

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: jobs.length,
      jobs
    })
  } catch (error) {
    console.error('Get jobs error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      jobs: []
    })
  }
})

// ========================================
// GET SINGLE JOB
// ========================================

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    res.json({
      success: true,
      job
    })
  } catch (error) {
    console.error('Get single job error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    })
  }
})

// ========================================
// CREATE JOB
// ========================================

app.post(
  '/api/jobs',
  protect,
  authorize('company'),
  async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        type,
        category,
        description,
        requirements,
        skills,
        salary,
        experience,
        education,
        openings,
        companyWebsite,
        applicationDeadline
      } = req.body

      if (
        !title ||
        !company ||
        !location ||
        !type ||
        !category ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required job information'
        })
      }

      const job = await Job.create({
        title,
        company,
        location,
        type,
        category,
        description,
        requirements: requirements || [],
        skills: skills || [],
        salary: salary || 'Not specified',
        experience: experience || 'Fresher',
        education: education || 'Any',
        openings: openings || 1,
        companyWebsite: companyWebsite || '',
        applicationDeadline,
        postedBy: req.user.id
      })

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        job
      })
    } catch (error) {
      console.error('Create job error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to create job'
      })
    }
  }
)

// ========================================
// UPDATE JOB
// ========================================

app.put(
  '/api/jobs/:id',
  protect,
  authorize('company'),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        })
      }

      if (
        job.postedBy &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own jobs'
        })
      }

      const updatedJob =
        await Job.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        )

      res.json({
        success: true,
        message: 'Job updated successfully',
        job: updatedJob
      })
    } catch (error) {
      console.error('Update job error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to update job'
      })
    }
  }
)

// ========================================
// DELETE JOB
// ========================================

app.delete(
  '/api/jobs/:id',
  protect,
  authorize('company'),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        })
      }

      if (
        job.postedBy &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own jobs'
        })
      }

      await Job.findByIdAndDelete(req.params.id)

      res.json({
        success: true,
        message: 'Job deleted successfully'
      })
    } catch (error) {
      console.error('Delete job error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to delete job'
      })
    }
  }
)

// ========================================
// APPLY FOR JOB
// ========================================

app.post(
  '/api/applications',
  protect,
  authorize('student'),
  async (req, res) => {
    try {
      const {
        jobId,
        coverLetter
      } = req.body

      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: 'Job ID is required'
        })
      }

      const job = await Job.findById(jobId)

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        })
      }

      if (job.isActive === false) {
        return res.status(400).json({
          success: false,
          message: 'This job is no longer active'
        })
      }

      const existingApplication =
        await Application.findOne({
          job: jobId,
          applicant: req.user.id
        })

      if (existingApplication) {
        return res.status(409).json({
          success: false,
          message: 'You have already applied for this job'
        })
      }

      const application =
        await Application.create({
          job: jobId,
          applicant: req.user.id,
          coverLetter: coverLetter || ''
        })

      if (
        Array.isArray(job.applicants) &&
        !job.applicants.some(
          (id) => id.toString() === req.user.id
        )
      ) {
        job.applicants.push(req.user.id)
        await job.save()
      }

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application
      })
    } catch (error) {
      console.error('Application error:', error)

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'You have already applied for this job'
        })
      }

      res.status(500).json({
        success: false,
        message: 'Failed to submit application'
      })
    }
  }
)

// ========================================
// MY APPLICATIONS
// ========================================

app.get(
  '/api/applications/my',
  protect,
  authorize('student'),
  async (req, res) => {
    try {
      const applications =
        await Application.find({
          applicant: req.user.id
        })
          .populate(
            'job',
            'title company location type salary'
          )
          .sort({ createdAt: -1 })

      res.json({
        success: true,
        count: applications.length,
        applications
      })
    } catch (error) {
      console.error('My applications error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications'
      })
    }
  }
)

// ========================================
// COMPANY APPLICANTS
// ========================================

app.get(
  '/api/applications/job/:jobId',
  protect,
  authorize('company'),
  async (req, res) => {
    try {
      const job = await Job.findById(
        req.params.jobId
      )

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        })
      }

      if (
        job.postedBy &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'You can only view applicants for your own jobs'
        })
      }

      const applications =
        await Application.find({
          job: req.params.jobId
        })
          .populate('applicant', '-password')
          .populate('job', 'title company')
          .sort({ createdAt: -1 })

      res.json({
        success: true,
        count: applications.length,
        applications
      })
    } catch (error) {
      console.error('Applicants error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to fetch applicants'
      })
    }
  }
)

// ========================================
// UPDATE APPLICATION STATUS
// ========================================

app.put(
  '/api/applications/:id/status',
  protect,
  authorize('company'),
  async (req, res) => {
    try {
      const { status } = req.body

      const allowedStatuses = [
        'Applied',
        'Shortlisted',
        'Rejected',
        'Accepted'
      ]

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application status'
        })
      }

      const application =
        await Application.findById(
          req.params.id
        ).populate('job')

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        })
      }

      if (
        application.job.postedBy &&
        application.job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'You cannot update this application'
        })
      }

      application.status = status

      await application.save()

      res.json({
        success: true,
        message: 'Application status updated',
        application
      })
    } catch (error) {
      console.error('Status update error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to update application'
      })
    }
  }
)

// ========================================
// SEED SAMPLE JOBS
// ========================================



// ========================================
// ADMIN - CHECK USERS
// ========================================

app.get(
  '/api/check-users',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const users = await User.find()
        .select('name email role')

      res.json({
        success: true,
        count: users.length,
        users
      })
    } catch (error) {
      console.error('Check users error:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      })
    }
  }
)

// ========================================
// 404 ROUTE
// IMPORTANT: THIS MUST BE LAST
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
})

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error('Server error:', error)

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log('========================================')
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Authentication READY')
  console.log('Jobs READY')
  console.log('Applications READY')
  console.log('========================================')
})