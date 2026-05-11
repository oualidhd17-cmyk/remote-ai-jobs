import fs from 'node:fs';
import path from 'node:path';

import type { CompanyItem, CountItem, Job, PipelineStats } from '@/types/job';

const publicDir = path.join(process.cwd(), 'public');
const dataDir = path.join(publicDir, 'data');

function readJsonFile<T>(fileName: string, fallback: T): T {
  const fullPath = path.join(dataDir, fileName);

  if (!fs.existsSync(fullPath)) {
    return fallback;
  }

  try {
    const raw = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getJobs(): Job[] {
  return readJsonFile<Job[]>('jobs.json', []);
}

export function getCompanies(): CompanyItem[] {
  return readJsonFile<CompanyItem[]>('companies.json', []);
}

export function getCategories(): CountItem[] {
  return readJsonFile<CountItem[]>('categories.json', []);
}

export function getCountries(): CountItem[] {
  return readJsonFile<CountItem[]>('countries.json', []);
}

export function getStats(): PipelineStats {
  return readJsonFile<PipelineStats>('stats.json', {
    raw_count: 0,
    processed_count: 0,
    published_count: 0,
    ai_relevant_count: 0,
    remote_count: 0,
    visa_count: 0,
    salary_count: 0,
    status_counts: {},
    source_counts: {},
    category_counts: {},
    country_counts: {},
  });
}

export function getJobBySlug(slug: string): Job | null {
  const jobs = getJobs();
  return jobs.find((job) => job.slug === slug) || null;
}

export function getJobsByCategorySlug(slug: string): Job[] {
  const categories = getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return [];
  }

  return getJobs().filter((job) => job.category === category.name);
}

export function getJobsByCountrySlug(slug: string): Job[] {
  const countries = getCountries();
  const country = countries.find((item) => item.slug === slug);

  if (!country) {
    return [];
  }

  return getJobs().filter((job) => job.country === country.name);
}

export function getVisaJobs(): Job[] {
  return getJobs().filter((job) => job.visa_sponsorship);
}

export function getRemoteJobs(): Job[] {
  return getJobs().filter((job) => job.remote_type === 'remote');
}

export function getEntryLevelJobs(): Job[] {
  return getJobs().filter((job) =>
    ['entry', 'junior', 'intern'].includes(job.experience_level),
  );
}

export function getRelatedJobs(job: Job, limit = 6): Job[] {
  return getJobs()
    .filter((item) => item.slug !== job.slug)
    .filter((item) => {
      return item.category === job.category || item.country === job.country;
    })
    .slice(0, limit);
}