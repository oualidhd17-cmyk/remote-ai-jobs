import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const pipelineOutputDir = path.join(root, 'pipeline-python', 'output');
const frontendPublicDir = path.join(root, 'frontend', 'public');
const frontendDataDir = path.join(frontendPublicDir, 'data');

const dataFiles = [
  'jobs.json',
  'companies.json',
  'categories.json',
  'countries.json',
  'stats.json',
];

const sitemapFiles = [
  'sitemap.xml',
  'sitemap-pages.xml',
  'sitemap-jobs.xml',
  'sitemap-categories.xml',
  'sitemap-countries.xml',
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, target) {
  if (!fs.existsSync(source)) {
    console.warn(`Missing file: ${source}`);
    return;
  }

  fs.copyFileSync(source, target);
  console.log(`Copied: ${source} -> ${target}`);
}

ensureDir(frontendPublicDir);
ensureDir(frontendDataDir);

for (const file of dataFiles) {
  copyFile(
    path.join(pipelineOutputDir, file),
    path.join(frontendDataDir, file),
  );
}

for (const file of sitemapFiles) {
  copyFile(
    path.join(pipelineOutputDir, file),
    path.join(frontendPublicDir, file),
  );
}

console.log('Data sync completed.');