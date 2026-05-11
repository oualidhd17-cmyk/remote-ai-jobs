import Link from 'next/link';

import { AdSlot } from '@/components/AdSlot';
import { JobCard } from '@/components/JobCard';
import { NewsletterBox } from '@/components/NewsletterBox';
import {
  getCategories,
  getCountries,
  getJobs,
  getStats,
} from '@/lib/data';
import { compactNumber } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Hires | Remote AI Jobs with Visa Sponsorship',
  description:
    'Discover remote AI jobs, Machine Learning jobs, Data Science jobs, MLOps jobs, and AI jobs with visa sponsorship.',
  path: '/',
});

export default function HomePage() {
  const jobs = getJobs();
  const stats = getStats();
  const countries = getCountries();
  const categories = getCategories();

  const latestJobs = jobs.slice(0, 10);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-card">
            <span className="eyebrow">Remote AI Jobs Aggregator</span>
            <h1>Find remote AI jobs faster.</h1>
            <p>
              Browse curated remote AI, Machine Learning, Data Science, MLOps,
              Prompt Engineering, and visa sponsorship jobs from public sources.
            </p>

            <div className="hero-actions">
              <Link href="/jobs/" className="btn btn-primary">
                Browse jobs
              </Link>
              <Link
                href="/ai-jobs-with-visa-sponsorship/"
                className="btn btn-secondary"
              >
                Visa sponsorship jobs
              </Link>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat-row">
              <span>Published jobs</span>
              <strong>{compactNumber(stats.published_count)}</strong>
            </div>

            <div className="stat-row">
              <span>Remote jobs</span>
              <strong>{compactNumber(stats.remote_count)}</strong>
            </div>

            <div className="stat-row">
              <span>Visa jobs</span>
              <strong>{compactNumber(stats.visa_count)}</strong>
            </div>

            <div className="stat-row">
              <span>AI relevant</span>
              <strong>{compactNumber(stats.ai_relevant_count)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AdSlot id="home-top-banner" size="728x90" position="top" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Latest jobs</span>
              <h2>Fresh remote AI jobs</h2>
              <p>Updated automatically from public job sources.</p>
            </div>

            <Link href="/jobs/" className="btn btn-secondary">
              View all
            </Link>
          </div>

          <div className="jobs-list">
            {latestJobs.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Countries</span>
              <h2>AI jobs by country</h2>
            </div>
          </div>

          <div className="chip-grid">
            {countries.slice(0, 12).map((country) => (
              <Link
                key={country.slug}
                href={`/countries/${country.slug}/`}
                className="chip"
              >
                {country.name}
                <span>{country.jobs_count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Categories</span>
              <h2>Popular AI job categories</h2>
            </div>
          </div>

          <div className="chip-grid">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}/`}
                className="chip"
              >
                {category.name}
                <span>{category.jobs_count}</span>
              </Link>
            ))}
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