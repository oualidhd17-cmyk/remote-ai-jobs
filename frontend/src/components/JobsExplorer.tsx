'use client';

import { useMemo, useState } from 'react';

import { JobCard } from '@/components/JobCard';
import type { CountItem, Job, JobFilterState } from '@/types/job';

type JobsExplorerProps = {
  jobs: Job[];
  countries: CountItem[];
  categories: CountItem[];
};

const initialFilters: JobFilterState = {
  keyword: '',
  country: '',
  category: '',
  remoteType: '',
  visa: '',
  experience: '',
  salary: '',
};

export function JobsExplorer({
  jobs,
  countries,
  categories,
}: JobsExplorerProps) {
  const [filters, setFilters] = useState<JobFilterState>(initialFilters);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = filters.keyword.trim().toLowerCase();

      if (keyword) {
        const searchable = [
          job.title,
          job.company.name,
          job.country,
          job.category,
          job.description_summary,
          ...job.skills,
        ]
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(keyword)) {
          return false;
        }
      }

      if (filters.country && job.country !== filters.country) {
        return false;
      }

      if (filters.category && job.category !== filters.category) {
        return false;
      }

      if (filters.remoteType && job.remote_type !== filters.remoteType) {
        return false;
      }

      if (filters.visa === 'yes' && !job.visa_sponsorship) {
        return false;
      }

      if (filters.visa === 'no' && job.visa_sponsorship) {
        return false;
      }

      if (filters.experience && job.experience_level !== filters.experience) {
        return false;
      }

      if (filters.salary === 'yes' && !job.salary_min && !job.salary_max) {
        return false;
      }

      return true;
    });
  }, [filters, jobs]);

  function updateFilter<K extends keyof JobFilterState>(
    key: K,
    value: JobFilterState[K],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <section className="jobs-layout">
      <aside className="filters-panel">
        <div className="filters-header">
          <h2>Filters</h2>
          <button type="button" onClick={() => setFilters(initialFilters)}>
            Reset
          </button>
        </div>

        <label>
          Keyword
          <input
            value={filters.keyword}
            onChange={(event) => updateFilter('keyword', event.target.value)}
            placeholder="AI Engineer, Python, MLOps..."
          />
        </label>

        <label>
          Country
          <select
            value={filters.country}
            onChange={(event) => updateFilter('country', event.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country.slug} value={country.name}>
                {country.name} ({country.jobs_count})
              </option>
            ))}
          </select>
        </label>

        <label>
          Category
          <select
            value={filters.category}
            onChange={(event) => updateFilter('category', event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.name}>
                {category.name} ({category.jobs_count})
              </option>
            ))}
          </select>
        </label>

        <label>
          Remote type
          <select
            value={filters.remoteType}
            onChange={(event) => updateFilter('remoteType', event.target.value)}
          >
            <option value="">Any</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>

        <label>
          Visa sponsorship
          <select
            value={filters.visa}
            onChange={(event) => updateFilter('visa', event.target.value)}
          >
            <option value="">Any</option>
            <option value="yes">Visa sponsorship</option>
            <option value="no">No visa filter</option>
          </select>
        </label>

        <label>
          Experience
          <select
            value={filters.experience}
            onChange={(event) => updateFilter('experience', event.target.value)}
          >
            <option value="">Any</option>
            <option value="intern">Intern</option>
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <label>
          Salary
          <select
            value={filters.salary}
            onChange={(event) => updateFilter('salary', event.target.value)}
          >
            <option value="">Any</option>
            <option value="yes">Has salary</option>
          </select>
        </label>
      </aside>

      <div className="jobs-results">
        <div className="results-header">
          <div>
            <span className="eyebrow">Search results</span>
            <h2>{filteredJobs.length} AI jobs found</h2>
          </div>
        </div>

        <div className="jobs-list">
          {filteredJobs.map((job, index) => (
            <div key={job.slug}>
              {index > 0 && index % 6 === 0 && (
                <div className="ad-slot ad-slot--in-feed">
                  <span>Advertisement</span>
                  <strong>In-feed ad</strong>
                </div>
              )}

              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}