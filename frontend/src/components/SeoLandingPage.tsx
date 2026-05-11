import Link from 'next/link';

import { AdSlot } from '@/components/AdSlot';
import { JobCard } from '@/components/JobCard';
import { NewsletterBox } from '@/components/NewsletterBox';
import type { Job } from '@/types/job';

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  jobs: Job[];
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  adId: string;
  introTitle?: string;
  introText?: string;
};

export function SeoLandingPage({
  eyebrow,
  title,
  description,
  jobs,
  primaryCtaHref = '/jobs/',
  primaryCtaLabel = 'Browse all jobs',
  secondaryCtaHref = '/ai-jobs-with-visa-sponsorship/',
  secondaryCtaLabel = 'Visa sponsorship jobs',
  adId,
  introTitle,
  introText,
}: SeoLandingPageProps) {
  const latestJobs = jobs.slice(0, 24);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-card">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>

            <div className="hero-actions">
              <Link href={primaryCtaHref} className="btn btn-primary">
                {primaryCtaLabel}
              </Link>

              <Link href={secondaryCtaHref} className="btn btn-secondary">
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat-row">
              <span>Matching jobs</span>
              <strong>{jobs.length}</strong>
            </div>

            <div className="stat-row">
              <span>Remote jobs</span>
              <strong>
                {jobs.filter((job) => job.remote_type === 'remote').length}
              </strong>
            </div>

            <div className="stat-row">
              <span>Visa jobs</span>
              <strong>
                {jobs.filter((job) => job.visa_sponsorship).length}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AdSlot id={adId} size="728x90" position="top" />
        </div>
      </section>

      {(introTitle || introText) && (
        <section className="section">
          <div className="container">
            <div className="detail-card">
              {introTitle && <h2>{introTitle}</h2>}
              {introText && <p className="detail-summary">{introText}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Latest jobs</span>
              <h2>{latestJobs.length} matching jobs</h2>
              <p>Fresh jobs collected automatically from public job sources.</p>
            </div>

            <Link href="/jobs/" className="btn btn-secondary">
              View all jobs
            </Link>
          </div>

          <div className="jobs-list">
            {latestJobs.map((job, index) => (
              <div key={job.slug}>
                {index > 0 && index % 6 === 0 && (
                  <AdSlot
                    id={`${adId}-in-feed-${index}`}
                    size="728x90"
                    position="in-feed"
                  />
                )}

                <JobCard job={job} />
              </div>
            ))}

            {latestJobs.length === 0 && (
              <div className="detail-card">
                <h2>No jobs found yet</h2>
                <p className="detail-summary">
                  This page is ready. Jobs will appear here after the next data
                  update if matching roles are available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <NewsletterBox />
        </div>
      </section>
    </>
  );
}