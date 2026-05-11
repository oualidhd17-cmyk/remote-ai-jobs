import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'scraper-go/output/raw_jobs.json',
  'pipeline-python/output/jobs.json',
  'pipeline-python/output/companies.json',
  'pipeline-python/output/categories.json',
  'pipeline-python/output/countries.json',
  'pipeline-python/output/stats.json',
  'pipeline-python/output/sitemap.xml',
  'frontend/public/data/jobs.json',
  'frontend/public/data/companies.json',
  'frontend/public/data/categories.json',
  'frontend/public/data/countries.json',
  'frontend/public/data/stats.json',
  'frontend/public/sitemap.xml',
  'frontend/public/robots.txt',
  'frontend/package.json',
  'frontend/next.config.mjs',
];

let hasError = false;

function fileExists(relativePath) {
  const fullPath = path.join(root, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`Missing: ${relativePath}`);
    hasError = true;
    return false;
  }

  console.log(`OK: ${relativePath}`);
  return true;
}

for (const file of requiredFiles) {
  fileExists(file);
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);

  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  } catch (error) {
    console.error(`Invalid JSON: ${relativePath}`);
    console.error(error.message);
    hasError = true;
    return null;
  }
}

const jobs = readJson('frontend/public/data/jobs.json');
const stats = readJson('frontend/public/data/stats.json');

if (Array.isArray(jobs)) {
  console.log(`Published frontend jobs: ${jobs.length}`);

  if (jobs.length === 0) {
    console.error('No published jobs found.');
    hasError = true;
  }

  const badJobs = jobs.filter((job) => {
    return !job.slug || !job.title || !job.company?.name || !job.apply_url;
  });

  if (badJobs.length > 0) {
    console.error(`Bad jobs found: ${badJobs.length}`);
    hasError = true;
  }
} else {
  console.error('jobs.json is not an array.');
  hasError = true;
}

if (stats && typeof stats === 'object') {
  console.log(`Stats published_count: ${stats.published_count ?? 0}`);
}

const robotsPath = path.join(root, 'frontend/public/robots.txt');
const robots = fs.existsSync(robotsPath)
  ? fs.readFileSync(robotsPath, 'utf-8')
  : '';

if (robots.includes('example.com')) {
  console.warn('Warning: robots.txt still contains example.com');
}

const seoPath = path.join(root, 'frontend/src/lib/seo.ts');
const seo = fs.existsSync(seoPath)
  ? fs.readFileSync(seoPath, 'utf-8')
  : '';

if (seo.includes('https://example.com')) {
  console.warn('Warning: frontend/src/lib/seo.ts still contains example.com');
}

const utilsPath = path.join(root, 'pipeline-python/utils.py');
const utils = fs.existsSync(utilsPath)
  ? fs.readFileSync(utilsPath, 'utf-8')
  : '';

if (utils.includes('https://example.com')) {
  console.warn('Warning: pipeline-python/utils.py still contains example.com');
}

if (hasError) {
  console.error('Pre-deploy check failed.');
  process.exit(1);
}

console.log('Pre-deploy check passed.');