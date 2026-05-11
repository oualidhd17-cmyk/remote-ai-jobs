import { notFound } from 'next/navigation';

import { AdSlot } from '@/components/AdSlot';
import { JobCard } from '@/components/JobCard';
import { getJobBySlug, getJobs, getRelatedJobs } from '@/lib/data';
import { formatDate, formatSalary } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type JobDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getJobs().map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return buildMetadata({
      title: 'Job not found | Remote AI Hires',
      description: 'This remote AI job could not be found.',
      path: '/jobs/',
    });
  }

  return buildMetadata({
    title: job.seo_title,
    description: job.seo_description,
    path: `/jobs/${job.slug}/`,
  });
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const relatedJobs = getRelatedJobs(job);
  const salary = formatSalary(
    job.salary_min,
    job.salary_max,
    job.salary_currency,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(job.schema),
        }}
      />

      <section className="hero">
        <div className="container detail-layout">
          <article className="detail-card">
            <span className="eyebrow">{job.category}</span>
            <h1>{job.title}</h1>

            <div className="job-meta" style={{ marginTop: 16 }}>
              <span>{job.company.name}</span>
              <span>{job.location_label}</span>
              <span>{formatDate(job.published_at)}</span>
            </div>

            <p className="detail-summary">{job.description_summary}</p>

            <div className="detail-actions">
              <a
                href={job.apply_url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="btn btn-primary"
              >
                Apply on company website
              </a>

              <a
                href={job.source_url || job.apply_url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="btn btn-secondary"
              >
                View source
              </a>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span>Company</span>
                <strong>{job.company.name}</strong>
              </div>

              <div className="info-item">
                <span>Country</span>
                <strong>{job.country}</strong>
              </div>

              <div className="info-item">
                <span>Remote type</span>
                <strong>{job.remote_type}</strong>
              </div>

              <div className="info-item">
                <span>Experience</span>
                <strong>{job.experience_level}</strong>
              </div>

              <div className="info-item">
                <span>Employment</span>
                <strong>{job.employment_type}</strong>
              </div>

              <div className="info-item">
                <span>Salary</span>
                <strong>{salary || 'Not listed'}</strong>
              </div>

              <div className="info-item">
                <span>Visa sponsorship</span>
                <strong>{job.visa_sponsorship ? 'Available' : 'Not listed'}</strong>
              </div>

              <div className="info-item">
                <span>Source</span>
                <strong>{job.source}</strong>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h2>Skills</h2>
              <div className="skill-list">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </article>

          <aside className="sidebar-card">
            <AdSlot
              id="job-detail-sidebar"
              size="300x250"
              position="sidebar"
            />

            <div style={{ marginTop: 22 }}>
              <h3>Source</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                Source: Company careers page or public job board. Apply button
                opens the original source.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {relatedJobs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow">Related jobs</span>
                <h2>Similar AI jobs</h2>
              </div>
            </div>

            <div className="jobs-list">
              {relatedJobs.map((relatedJob) => (
                <JobCard key={relatedJob.slug} job={relatedJob} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}