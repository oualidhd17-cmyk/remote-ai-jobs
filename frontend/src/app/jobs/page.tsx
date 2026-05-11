import { AdSlot } from '@/components/AdSlot';
import { JobsExplorer } from '@/components/JobsExplorer';
import { getCategories, getCountries, getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs | Browse AI, ML, Data Science and MLOps Jobs',
  description:
    'Search remote AI jobs by keyword, country, category, visa sponsorship, remote type, experience level, and salary availability.',
  path: '/jobs/',
});

export default function JobsPage() {
  const jobs = getJobs();
  const countries = getCountries();
  const categories = getCategories();

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <span className="eyebrow">All jobs</span>
            <h1>Browse remote AI jobs.</h1>
            <p>
              Filter remote AI jobs by country, category, visa sponsorship,
              experience level, and salary availability.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AdSlot id="jobs-top-banner" size="728x90" position="top" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <JobsExplorer jobs={jobs} countries={countries} categories={categories} />
        </div>
      </section>
    </>
  );
}