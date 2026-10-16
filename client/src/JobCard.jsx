function JobCard({ job, onViewJob }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>
        <strong>Type:</strong> {job.type}
      </p>

      <button onClick={() => onViewJob(job)}>
  View Job
</button>
    </div>
  )
}

export default JobCard