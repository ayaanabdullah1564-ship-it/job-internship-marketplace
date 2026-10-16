import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function getStoredUser() {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

function getToken() {
  return localStorage.getItem('token')
}

function authConfig() {
  const token = getToken()

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {}
}

function AppButton({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`app-button ${variant}`}
    >
      {children}
    </button>
  )
}

function Logo() {
  return (
    <div className="brand-logo">
      <div className="brand-icon">💼</div>
      <div>
        <strong>JobConnect</strong>
        <span>Jobs & Internships</span>
      </div>
    </div>
  )
}

function Navbar({ user, page, setPage, onLogout }) {
  const isAdmin = user?.role === 'admin'
  const isCompany = user?.role === 'company'
  const isStudent = user?.role === 'student'

  return (
    <header className="navbar">
      <div className="nav-container">
        <button className="brand-button" onClick={() => setPage('home')}>
          <Logo />
        </button>

        <nav className="nav-links">
          <button
            className={page === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => setPage('home')}
          >
            Home
          </button>

          <button
            className={page === 'jobs' ? 'nav-link active' : 'nav-link'}
            onClick={() => setPage('jobs')}
          >
            Jobs
          </button>

          {isStudent && (
            <button
              className={page === 'applications' ? 'nav-link active' : 'nav-link'}
              onClick={() => setPage('applications')}
            >
              Applications
            </button>
          )}

          {isCompany && (
            <>
              <button
                className={page === 'post-job' ? 'nav-link active' : 'nav-link'}
                onClick={() => setPage('post-job')}
              >
                Post Job
              </button>

              <button
                className={page === 'applicants' ? 'nav-link active' : 'nav-link'}
                onClick={() => setPage('applicants')}
              >
                Applicants
              </button>
            </>
          )}

          {isAdmin && (
            <button
              className={page === 'admin' ? 'nav-link admin-link active' : 'nav-link admin-link'}
              onClick={() => setPage('admin')}
            >
              🛡️ Admin
            </button>
          )}

          {user && (
            <button
              className={page === 'dashboard' ? 'nav-link active' : 'nav-link'}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <button className="profile-mini" onClick={() => setPage('profile')}>
                <span className="avatar">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="profile-name">{user.name}</span>
              </button>

              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="login-button" onClick={() => setPage('login')}>
                Login
              </button>

              <AppButton onClick={() => setPage('register')}>
                Get Started
              </AppButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-background" />

      <div className="hero-content">
        <div className="hero-badge">
          ✨ Your career starts here
        </div>

        <h1>
          Find your next
          <span> opportunity.</span>
        </h1>

        <p>
          Discover jobs and internships from companies looking for talented
          students and fresh professionals.
        </p>

        <div className="hero-actions">
          <AppButton onClick={() => setPage('jobs')}>
            🔎 Explore Opportunities
          </AppButton>

          <button
            className="secondary-button"
            onClick={() => setPage('register')}
          >
            Create Free Account
          </button>
        </div>

        <div className="hero-trust">
          <span>✓ Free platform</span>
          <span>✓ Student friendly</span>
          <span>✓ Real opportunities</span>
        </div>
      </div>

      <div className="hero-card">
        <div className="floating-card card-one">
          <span>🎯</span>
          <div>
            <strong>Career Goals</strong>
            <small>Find opportunities</small>
          </div>
        </div>

        <div className="floating-card card-two">
          <span>🚀</span>
          <div>
            <strong>New Opportunity</strong>
            <small>MERN Developer Intern</small>
          </div>
        </div>

        <div className="hero-circle">
          💼
        </div>
      </div>
    </section>
  )
}

function HomePage({ jobs, setPage, setSelectedJob, user }) {
  const internshipCount = jobs.filter((job) => job.type === 'Internship').length
  const fullTimeCount = jobs.filter((job) => job.type === 'Full-time').length
  const remoteCount = jobs.filter(
    (job) =>
      job.type === 'Remote' ||
      String(job.location || '').toLowerCase() === 'remote'
  ).length

  const latestJobs = jobs.slice(0, 3)

  return (
    <main>
      <Hero setPage={setPage} />

      <section className="stats-section">
        <div className="stats-grid">
          <StatCard number={jobs.length} label="Total Opportunities" icon="💼" />
          <StatCard number={internshipCount} label="Internships" icon="🎓" />
          <StatCard number={fullTimeCount} label="Full-time Jobs" icon="🏢" />
          <StatCard number={remoteCount} label="Remote Opportunities" icon="🌎" />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-label">OPPORTUNITIES</span>
            <h2>Latest jobs & internships</h2>
            <p>Explore opportunities from companies looking for fresh talent.</p>
          </div>

          <button className="view-all-button" onClick={() => setPage('jobs')}>
            View all →
          </button>
        </div>

        {latestJobs.length > 0 ? (
          <div className="jobs-grid">
            {latestJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                user={user}
                onView={() => {
                  setSelectedJob(job)
                  setPage('details')
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No opportunities available yet." />
        )}
      </section>

      <section className="why-section">
        <div className="section-heading centered">
          <span className="section-label">WHY JOBCONNECT?</span>
          <h2>Everything you need to move forward</h2>
          <p>A simple platform built for students, freshers and companies.</p>
        </div>

        <div className="features-grid">
          <Feature icon="🎯" title="Find relevant jobs" text="Search opportunities based on skills, category and location." />
          <Feature icon="⚡" title="Apply quickly" text="Create your profile and apply without unnecessary steps." />
          <Feature icon="📊" title="Track applications" text="See the current status of every application in one place." />
          <Feature icon="🤝" title="Connect companies" text="Companies can discover and manage talented candidates." />
        </div>
      </section>
    </main>
  )
}

function StatCard({ number, label, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{number}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function JobsPage({ jobs, user, setSelectedJob, setPage }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const values = jobs.map((job) => job.category).filter(Boolean)
    return ['All', ...new Set(values)]
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim()

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        [
          job.title,
          job.company,
          job.location,
          job.category,
          ...(job.skills || [])
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesType = type === 'All' || job.type === type
      const matchesCategory =
        category === 'All' || job.category === category

      return matchesSearch && matchesType && matchesCategory
    })
  }, [jobs, search, type, category])

  return (
    <main className="page">
      <section className="page-hero">
        <span className="section-label">OPPORTUNITIES</span>
        <h1>Explore jobs & internships</h1>
        <p>Find the opportunity that matches your career goals.</p>
      </section>

      <section className="filter-panel">
        <div className="search-box">
          <span>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, companies, skills..."
          />
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'All' ? 'All Categories' : item}
            </option>
          ))}
        </select>
      </section>

      <div className="results-row">
        <strong>{filteredJobs.length}</strong>
        <span>opportunities found</span>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              user={user}
              onView={() => {
                setSelectedJob(job)
                setPage('details')
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No jobs match your search." />
      )}
    </main>
  )
}

function JobCard({ job, user, onView }) {
  const isStudent = user?.role === 'student'
  const isCompany = user?.role === 'company'
  const isAdmin = user?.role === 'admin'

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-avatar">
          {job.company?.charAt(0)?.toUpperCase() || 'C'}
        </div>

        <span className={`job-type ${String(job.type || '').toLowerCase().replace(' ', '-')}`}>
          {job.type}
        </span>
      </div>

      <h3>{job.title}</h3>

      <div className="job-company">
        🏢 {job.company}
      </div>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>🧩 {job.category}</span>
      </div>

      <p className="job-description">
        {job.description || 'Explore this opportunity and learn more.'}
      </p>

      <div className="job-highlights">
        <div>
          <small>Salary</small>
          <strong>{job.salary || 'Not specified'}</strong>
        </div>

        <div>
          <small>Experience</small>
          <strong>{job.experience || 'Fresher'}</strong>
        </div>

        <div>
          <small>Openings</small>
          <strong>{job.openings || 1}</strong>
        </div>
      </div>

      {job.skills?.length > 0 && (
        <div className="skills">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span key={`${skill}-${index}`}>{skill}</span>
          ))}
        </div>
      )}

      <div className="job-card-actions">
        <button className="outline-button" onClick={onView}>
          View Details
        </button>

        {isStudent && (
          <button className="small-primary" onClick={onView}>
            Apply Now
          </button>
        )}

        {isCompany && (
          <span className="role-note">Company account</span>
        )}

        {isAdmin && (
          <span className="role-note admin-note">Admin view</span>
        )}
      </div>
    </article>
  )
}

function JobDetailsPage({ job, user, setPage }) {
  if (!job) {
    return <EmptyState message="Job not found." />
  }

  return (
    <main className="page">
      <button className="back-button" onClick={() => setPage('jobs')}>
        ← Back to Jobs
      </button>

      <section className="details-card">
        <div className="details-header">
          <div className="company-avatar large">
            {job.company?.charAt(0)?.toUpperCase() || 'C'}
          </div>

          <div>
            <span className="job-type">{job.type}</span>
            <h1>{job.title}</h1>
            <p>🏢 {job.company} &nbsp; • &nbsp; 📍 {job.location}</p>
          </div>
        </div>

        <div className="details-grid">
          <div className="details-main">
            <section>
              <h2>About the opportunity</h2>
              <p>{job.description}</p>
            </section>

            <section>
              <h2>Required skills</h2>
              <div className="skills">
                {(job.skills || []).map((skill, index) => (
                  <span key={`${skill}-${index}`}>{skill}</span>
                ))}
              </div>
            </section>

            <section>
              <h2>Requirements</h2>
              <ul className="requirements">
                {(job.requirements || []).map((item, index) => (
                  <li key={`${item}-${index}`}>✓ {item}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="details-sidebar">
            <InfoBox label="Salary" value={job.salary || 'Not specified'} />
            <InfoBox label="Experience" value={job.experience || 'Fresher'} />
            <InfoBox label="Education" value={job.education || 'Any'} />
            <InfoBox label="Openings" value={job.openings || 1} />

            {user?.role === 'student' ? (
              <AppButton onClick={() => setPage('apply')}>
                Apply for this job →
              </AppButton>
            ) : !user ? (
              <AppButton onClick={() => setPage('login')}>
                Login to Apply
              </AppButton>
            ) : (
              <div className="notice-box">
                {user.role === 'admin'
                  ? 'Admin accounts can review opportunities but cannot apply.'
                  : 'Company accounts cannot apply to jobs.'}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="info-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function RegisterPage({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/auth/register', form)
      alert('Account created successfully. Please login.')
      onLogin()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to create account.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey with JobConnect."
    >
      <form onSubmit={submit} className="auth-form">
        {error && <div className="error-box">{error}</div>}

        <label>
          Full Name
          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Enter your name"
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            minLength="6"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="Minimum 6 characters"
          />
        </label>

        <label>
          Account Type
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="student">🎓 Student</option>
            <option value="company">🏢 Company</option>
          </select>
        </label>

        <AppButton type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </AppButton>
      </form>
    </AuthLayout>
  )
}

function LoginPage({ onSuccess, goRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const token = response.data.token
      const user = response.data.user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      onSuccess(user)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Login failed. Please check your details.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue your career journey."
    >
      <form onSubmit={submit} className="auth-form">
        {error && <div className="error-box">{error}</div>}

        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>

        <AppButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </AppButton>

        <button type="button" className="text-button" onClick={goRegister}>
          Don't have an account? Create one
        </button>
      </form>
    </AuthLayout>
  )
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <div className="auth-decoration">
        <div className="auth-orb one" />
        <div className="auth-orb two" />
      </div>

      <div className="auth-card">
        <Logo />
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </main>
  )
}

function ApplyPage({ job, user, onDone }) {
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!job) {
    return <EmptyState message="Please select a job first." />
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post(
        '/applications',
        {
          jobId: job._id,
          coverLetter
        },
        authConfig()
      )

      alert('Application submitted successfully!')
      onDone()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to submit application.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page narrow-page">
      <div className="form-card">
        <span className="section-label">APPLICATION</span>
        <h1>Apply for {job.title}</h1>
        <p className="muted">
          {job.company} • {job.location}
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label>
            Cover Letter
            <textarea
              rows="8"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the company why you are a good fit..."
            />
          </label>

          <AppButton type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </AppButton>
        </form>
      </div>
    </main>
  )
}

function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(
          '/applications/my',
          authConfig()
        )

        setApplications(response.data.applications || [])
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load applications.'
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <main className="page">
      <section className="page-hero compact">
        <span className="section-label">MY CAREER</span>
        <h1>My applications</h1>
        <p>Track every opportunity you have applied for.</p>
      </section>

      {loading && <Loading />}
      {error && <div className="error-box">{error}</div>}

      {!loading && applications.length === 0 && (
        <EmptyState message="You haven't applied to any jobs yet." />
      )}

      <div className="application-list">
        {applications.map((application) => (
          <div className="application-card" key={application._id}>
            <div className="company-avatar">
              {application.job?.company?.charAt(0)?.toUpperCase() || 'J'}
            </div>

            <div className="application-content">
              <h3>{application.job?.title}</h3>
              <p>
                {application.job?.company} • {application.job?.location}
              </p>
              <small>
                Applied on{' '}
                {new Date(application.createdAt).toLocaleDateString()}
              </small>
            </div>

            <StatusBadge status={application.status} />
          </div>
        ))}
      </div>
    </main>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${String(status).toLowerCase()}`}>
      {status}
    </span>
  )
}

function PostJobPage({ user, onDone }) {
  const [form, setForm] = useState({
    title: '',
    company: user?.companyName || user?.name || '',
    location: '',
    type: 'Internship',
    category: 'Web Development',
    description: '',
    salary: '',
    experience: 'Fresher',
    education: 'Any',
    openings: 1,
    skills: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post(
        '/jobs',
        {
          ...form,
          openings: Number(form.openings),
          skills: form.skills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        },
        authConfig()
      )

      alert('Job posted successfully!')
      onDone()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to create job.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page narrow-page">
      <div className="form-card">
        <span className="section-label">EMPLOYER</span>
        <h1>Post a new opportunity</h1>
        <p className="muted">
          Find talented students and professionals for your company.
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit} className="form-grid">
          <FormInput label="Job Title" value={form.title} onChange={(value) => update('title', value)} required />
          <FormInput label="Company" value={form.company} onChange={(value) => update('company', value)} required />
          <FormInput label="Location" value={form.location} onChange={(value) => update('location', value)} required />

          <label>
            Job Type
            <select value={form.type} onChange={(e) => update('type', e.target.value)}>
              <option>Internship</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>Contract</option>
            </select>
          </label>

          <FormInput label="Category" value={form.category} onChange={(value) => update('category', value)} required />
          <FormInput label="Salary" value={form.salary} onChange={(value) => update('salary', value)} />

          <FormInput label="Experience" value={form.experience} onChange={(value) => update('experience', value)} />
          <FormInput label="Education" value={form.education} onChange={(value) => update('education', value)} />

          <FormInput
            label="Openings"
            type="number"
            min="1"
            value={form.openings}
            onChange={(value) => update('openings', value)}
          />

          <FormInput
            label="Skills"
            value={form.skills}
            onChange={(value) => update('skills', value)}
            placeholder="React, JavaScript, Node.js"
          />

          <label className="full">
            Description
            <textarea
              required
              rows="7"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the role, responsibilities and opportunity..."
            />
          </label>

          <div className="full">
            <AppButton type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Job'}
            </AppButton>
          </div>
        </form>
      </div>
    </main>
  )
}

function FormInput({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  )
}

function CompanyApplicantsPage() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await api.get('/jobs')
        const allJobs = response.data.jobs || []
        const user = getStoredUser()

        const companyJobs = allJobs.filter(
          (job) =>
            String(job.postedBy || '') ===
            String(user?._id || user?.id || '')
        )

        setJobs(companyJobs)

        if (companyJobs.length > 0) {
          setSelectedJob(companyJobs[0])
        }
      } catch (error) {
        setError('Unable to load company jobs.')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  useEffect(() => {
    if (!selectedJob) {
      setApplicants([])
      return
    }

    const loadApplicants = async () => {
      try {
        const response = await api.get(
          `/applications/job/${selectedJob._id}`,
          authConfig()
        )

        setApplicants(response.data.applications || [])
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load applicants.'
        )
      }
    }

    loadApplicants()
  }, [selectedJob])

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(
        `/applications/${applicationId}/status`,
        { status },
        authConfig()
      )

      setApplicants((current) =>
        current.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      )
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Unable to update status.'
      )
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <main className="page">
      <section className="page-hero compact">
        <span className="section-label">EMPLOYER CENTER</span>
        <h1>Applicants</h1>
        <p>Review candidates who applied to your opportunities.</p>
      </section>

      {error && <div className="error-box">{error}</div>}

      {jobs.length === 0 ? (
        <EmptyState message="You haven't posted any jobs yet." />
      ) : (
        <>
          <div className="job-selector">
            {jobs.map((job) => (
              <button
                key={job._id}
                className={
                  selectedJob?._id === job._id
                    ? 'selector-button active'
                    : 'selector-button'
                }
                onClick={() => setSelectedJob(job)}
              >
                {job.title}
              </button>
            ))}
          </div>

          {applicants.length === 0 ? (
            <EmptyState message="No applications for this job yet." />
          ) : (
            <div className="applicant-list">
              {applicants.map((application) => (
                <div className="applicant-card" key={application._id}>
                  <div className="company-avatar">
                    {application.applicant?.name
                      ?.charAt(0)
                      ?.toUpperCase() || 'A'}
                  </div>

                  <div className="applicant-info">
                    <h3>{application.applicant?.name}</h3>
                    <p>{application.applicant?.email}</p>
                    <small>
                      Applied:{' '}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </small>
                  </div>

                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateStatus(
                        application._id,
                        e.target.value
                      )
                    }
                  >
                    <option>Applied</option>
                    <option>Shortlisted</option>
                    <option>Rejected</option>
                    <option>Accepted</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

function DashboardPage({ user, jobs, setPage }) {
  const isAdmin = user?.role === 'admin'
  const isCompany = user?.role === 'company'

  if (isAdmin) {
    return <AdminDashboard jobs={jobs} setPage={setPage} />
  }

  const myJobs = isCompany
    ? jobs.filter(
        (job) =>
          String(job.postedBy || '') ===
          String(user?._id || user?.id || '')
      )
    : []

  return (
    <main className="page">
      <section className="dashboard-welcome">
        <div>
          <span className="section-label">
            {isCompany ? 'COMPANY CENTER' : 'STUDENT CENTER'}
          </span>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>
            {isCompany
              ? 'Manage your opportunities and discover candidates.'
              : 'Keep building your career, one opportunity at a time.'}
          </p>
        </div>

        <div className="dashboard-avatar">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      </section>

      <div className="dashboard-grid">
        <DashboardCard
          icon="💼"
          title="Opportunities"
          value={isCompany ? myJobs.length : jobs.length}
        />

        <DashboardCard
          icon={isCompany ? '👥' : '🎯'}
          title={isCompany ? 'Your Jobs' : 'Career Options'}
          value={isCompany ? myJobs.length : jobs.length}
        />

        <DashboardCard
          icon="✨"
          title="Account"
          value={isCompany ? 'Company' : 'Student'}
        />
      </div>

      <section className="quick-actions">
        <h2>Quick actions</h2>

        <div className="quick-grid">
          <button onClick={() => setPage('jobs')}>
            🔎 Explore Jobs
          </button>

          {isCompany && (
            <button onClick={() => setPage('post-job')}>
              ➕ Post a Job
            </button>
          )}

          {isCompany && (
            <button onClick={() => setPage('applicants')}>
              👥 View Applicants
            </button>
          )}

          {!isCompany && (
            <button onClick={() => setPage('applications')}>
              📋 My Applications
            </button>
          )}

          <button onClick={() => setPage('profile')}>
            👤 Edit Profile
          </button>
        </div>
      </section>
    </main>
  )
}

function DashboardCard({ icon, title, value }) {
  return (
    <div className="dashboard-card">
      <span>{icon}</span>
      <small>{title}</small>
      <strong>{value}</strong>
    </div>
  )
}

function AdminDashboard({ jobs, setPage }) {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get('/check-users')
        setUsers(response.data.users || [])
      } catch (error) {
        setAdminError(
          error.response?.data?.message ||
            'Unable to load users.'
        )
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  const students = users.filter((user) => user.role === 'student')
  const companies = users.filter((user) => user.role === 'company')
  const admins = users.filter((user) => user.role === 'admin')

  return (
    <main className="page admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-label">CONTROL CENTER</span>
          <h1>Admin Dashboard 🛡️</h1>
          <p>
            Monitor users, opportunities and the overall marketplace.
          </p>
        </div>

        <div className="admin-shield">🛡️</div>
      </section>

      {adminError && <div className="error-box">{adminError}</div>}

      <div className="admin-stats">
        <AdminStat icon="👥" number={users.length} label="Total Users" />
        <AdminStat icon="🎓" number={students.length} label="Students" />
        <AdminStat icon="🏢" number={companies.length} label="Companies" />
        <AdminStat icon="🛡️" number={admins.length} label="Admins" />
        <AdminStat icon="💼" number={jobs.length} label="Jobs" />
      </div>

      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">USERS</span>
              <h2>User Management</h2>
            </div>

            <span className="panel-count">{users.length}</span>
          </div>

          {loadingUsers ? (
            <Loading />
          ) : users.length === 0 ? (
            <EmptyState message="No users found." />
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="table-user">
                          <span className="table-avatar">
                            {item.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </span>
                          <strong>{item.name}</strong>
                        </div>
                      </td>

                      <td>{item.email}</td>

                      <td>
                        <span className={`role-pill ${item.role}`}>
                          {item.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">JOBS</span>
              <h2>Opportunity Overview</h2>
            </div>

            <span className="panel-count">{jobs.length}</span>
          </div>

          <div className="admin-job-list">
            {jobs.map((job) => (
              <div className="admin-job-item" key={job._id}>
                <div className="company-avatar small">
                  {job.company?.charAt(0)?.toUpperCase() || 'C'}
                </div>

                <div>
                  <strong>{job.title}</strong>
                  <span>
                    {job.company} • {job.location}
                  </span>
                </div>

                <span className="job-type">
                  {job.type}
                </span>
              </div>
            ))}
          </div>

          <button
            className="admin-view-button"
            onClick={() => setPage('jobs')}
          >
            View all opportunities →
          </button>
        </section>
      </div>
    </main>
  )
}

function AdminStat({ icon, number, label }) {
  return (
    <div className="admin-stat">
      <span>{icon}</span>
      <strong>{number}</strong>
      <small>{label}</small>
    </div>
  )
}

function ProfilePage({ user, setUser }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    education: user?.education || '',
    bio: user?.bio || '',
    skills: Array.isArray(user?.skills)
      ? user.skills.join(', ')
      : ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await api.put(
        '/auth/profile',
        {
          ...form,
          skills: form.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean)
        },
        authConfig()
      )

      const updatedUser = response.data.user || {
        ...user,
        ...form
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      setUser(updatedUser)
      setMessage('Profile updated successfully.')
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to update profile.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page narrow-page">
      <div className="form-card">
        <div className="profile-header">
          <div className="profile-big-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <span className="section-label">PROFILE</span>
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <span className="role-pill">{user?.role}</span>
          </div>
        </div>

        {message && <div className="success-box">{message}</div>}

        <form onSubmit={save} className="form-grid">
          <FormInput
            label="Name"
            value={form.name}
            onChange={(value) =>
              setForm({ ...form, name: value })
            }
          />

          <FormInput
            label="Phone"
            value={form.phone}
            onChange={(value) =>
              setForm({ ...form, phone: value })
            }
          />

          <FormInput
            label="Location"
            value={form.location}
            onChange={(value) =>
              setForm({ ...form, location: value })
            }
          />

          <FormInput
            label="Education"
            value={form.education}
            onChange={(value) =>
              setForm({ ...form, education: value })
            }
          />

          <FormInput
            label="Skills"
            value={form.skills}
            onChange={(value) =>
              setForm({ ...form, skills: value })
            }
            placeholder="HTML, CSS, JavaScript, React"
          />

          <label className="full">
            Bio
            <textarea
              rows="6"
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value
                })
              }
              placeholder="Tell us about yourself..."
            />
          </label>

          <div className="full">
            <AppButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </AppButton>
          </div>
        </form>
      </div>
    </main>
  )
}

function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div>📭</div>
      <h3>{message}</h3>
      <p>Try another option or come back later.</p>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(getStoredUser)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [backendError, setBackendError] = useState('')

  const loadJobs = async () => {
    try {
      setBackendError('')

      const response = await api.get('/jobs')

      setJobs(response.data.jobs || [])
    } catch (error) {
      setBackendError(
        'Unable to connect to the backend. Make sure the server is running on port 5000.'
      )
    } finally {
      setLoadingJobs(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const loginSuccess = (loggedInUser) => {
    setUser(loggedInUser)

    if (loggedInUser.role === 'admin') {
      setPage('admin')
    } else {
      setPage('dashboard')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setPage('home')
  }

  const handlePostDone = async () => {
    await loadJobs()
    setPage('jobs')
  }

  const handleApplyDone = () => {
    setPage('applications')
  }

  let content = null

  if (loadingJobs && page === 'home') {
    content = <Loading />
  } else if (page === 'home') {
    content = (
      <HomePage
        jobs={jobs}
        setPage={setPage}
        setSelectedJob={setSelectedJob}
        user={user}
      />
    )
  } else if (page === 'jobs') {
    content = (
      <JobsPage
        jobs={jobs}
        user={user}
        setSelectedJob={setSelectedJob}
        setPage={setPage}
      />
    )
  } else if (page === 'details') {
    content = (
      <JobDetailsPage
        job={selectedJob}
        user={user}
        setPage={setPage}
      />
    )
  } else if (page === 'login') {
    content = (
      <LoginPage
        onSuccess={loginSuccess}
        goRegister={() => setPage('register')}
      />
    )
  } else if (page === 'register') {
    content = (
      <RegisterPage
        onLogin={() => setPage('login')}
      />
    )
  } else if (page === 'apply') {
    content = (
      <ApplyPage
        job={selectedJob}
        user={user}
        onDone={handleApplyDone}
      />
    )
  } else if (page === 'applications') {
    content = <MyApplicationsPage />
  } else if (page === 'post-job') {
    content = (
      <PostJobPage
        user={user}
        onDone={handlePostDone}
      />
    )
  } else if (page === 'applicants') {
    content = <CompanyApplicantsPage />
  } else if (page === 'dashboard') {
    content = (
      <DashboardPage
        user={user}
        jobs={jobs}
        setPage={setPage}
      />
    )
  } else if (page === 'admin') {
    content = (
      <AdminDashboard
        jobs={jobs}
        setPage={setPage}
      />
    )
  } else if (page === 'profile') {
    content = (
      <ProfilePage
        user={user}
        setUser={setUser}
      />
    )
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        page={page}
        setPage={setPage}
        onLogout={logout}
      />

      {backendError && (
        <div className="backend-warning">
          ⚠️ {backendError}
        </div>
      )}

      {content}

      <footer className="footer">
        <div className="footer-content">
          <Logo />

          <div className="footer-text">
            <p>
              A MERN Stack college project built to connect talent with
              opportunity.
            </p>
            <span>
              MongoDB • Express.js • React • Node.js
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 JobConnect. Built for learning and careers.
        </div>
      </footer>
    </div>
  )
}

export default App