import Link from 'next/link';

import { formatDate, formatSalary } from '@/lib/format';
import type { Job } from '@/types/job';

type JobCardProps = {
  job: Job;
  compact?: boolean;
};

export function JobCard({ job, compact = false }: JobCardProps) {
  const salary = formatSalary(
    job.salary_min,
    job.salary_max,
    job.salary_currency,
  );

  return (
    <article className={`job-card ${compact ? 'job-card--compact' : ''}`}>
      <div className="job-card-main">
        <div>
          <Link href={`/jobs/${job.slug}/`} className="job-title">
            {job.title}
          </Link>

          <div className="job-meta">
            <span>{job.company.name}</span>
            <span>{job.location_label}</span>
            <span>{formatDate(job.published_at)}</span>
          </div>
        </div>

        <div className="job-badges">
          {job.remote_type === 'remote' && (
            <span className="badge badge-success">Remote</span>
          )}

          {job.visa_sponsorship && (
            <span className="badge badge-warning">Visa</span>
          )}

          {salary && <span className="badge badge-light">{salary}</span>}
        </div>
      </div>

      {!compact && <p className="job-summary">{job.description_summary}</p>}

      <div className="job-card-footer">
        <div className="skill-list">
          {job.skills.slice(0, 5).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        <Link href={`/jobs/${job.slug}/`} className="btn btn-secondary">
          View job
        </Link>
      </div>
    </article>
  );
}