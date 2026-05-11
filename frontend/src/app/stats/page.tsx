import { AdSlot } from '@/components/AdSlot';
import { getStats } from '@/lib/data';
import { compactNumber } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs Stats | Remote AI Hires',
  description:
    'View Remote AI Hires job aggregation statistics including published jobs, AI relevant jobs, remote jobs, visa jobs, sources, countries, and categories.',
  path: '/stats/',
});

function sortEntries(record: Record<string, number>) {
  return Object.entries(record).sort((a, b) => b[1] - a[1]);
}

export default function StatsPage() {
  const stats = getStats();

  const sourceEntries = sortEntries(stats.source_counts);
  const categoryEntries = sortEntries(stats.category_counts);
  const countryEntries = sortEntries(stats.country_counts);
  const statusEntries = sortEntries(stats.status_counts);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <span className="eyebrow">Pipeline Stats</span>
            <h1>Remote AI Jobs data stats.</h1>
            <p>
              Track how many jobs were collected, filtered, rejected, and
              published by the automated Remote AI Jobs pipeline.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AdSlot id="stats-top-banner" size="728x90" position="top" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <span>Raw jobs</span>
              <strong>{compactNumber(stats.raw_count)}</strong>
            </div>

            <div className="stat-box">
              <span>Processed jobs</span>
              <strong>{compactNumber(stats.processed_count)}</strong>
            </div>

            <div className="stat-box">
              <span>Published jobs</span>
              <strong>{compactNumber(stats.published_count)}</strong>
            </div>

            <div className="stat-box">
              <span>AI relevant jobs</span>
              <strong>{compactNumber(stats.ai_relevant_count)}</strong>
            </div>

            <div className="stat-box">
              <span>Remote jobs</span>
              <strong>{compactNumber(stats.remote_count)}</strong>
            </div>

            <div className="stat-box">
              <span>Visa jobs</span>
              <strong>{compactNumber(stats.visa_count)}</strong>
            </div>

            <div className="stat-box">
              <span>Jobs with salary</span>
              <strong>{compactNumber(stats.salary_count)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-tables">
          <div className="stats-table-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">Sources</span>
                <h2>Jobs by source</h2>
              </div>
            </div>

            <table className="stats-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Jobs</th>
                </tr>
              </thead>
              <tbody>
                {sourceEntries.map(([source, count]) => (
                  <tr key={source}>
                    <td>{source}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stats-table-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">Status</span>
                <h2>Jobs by status</h2>
              </div>
            </div>

            <table className="stats-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Jobs</th>
                </tr>
              </thead>
              <tbody>
                {statusEntries.map(([status, count]) => (
                  <tr key={status}>
                    <td>{status}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stats-table-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">Categories</span>
                <h2>Published jobs by category</h2>
              </div>
            </div>

            <table className="stats-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Jobs</th>
                </tr>
              </thead>
              <tbody>
                {categoryEntries.map(([category, count]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stats-table-card">
            <div className="section-header">
              <div>
                <span className="eyebrow">Countries</span>
                <h2>Published jobs by country</h2>
              </div>
            </div>

            <table className="stats-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Jobs</th>
                </tr>
              </thead>
              <tbody>
                {countryEntries.map(([country, count]) => (
                  <tr key={country}>
                    <td>{country}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}