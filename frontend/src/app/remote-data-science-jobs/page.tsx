import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote Data Science Jobs | Data Scientist AI Jobs',
  description:
    'Browse remote Data Science jobs, Data Scientist roles, analytics jobs, forecasting roles, and AI data jobs.',
  path: '/remote-data-science-jobs/',
});

export default function RemoteDataScienceJobsPage() {
  const jobs = getJobs().filter(
    (job) =>
      job.category === 'Data Science' ||
      job.skills.includes('Pandas') ||
      job.skills.includes('Statistics') ||
      job.title.toLowerCase().includes('data scientist'),
  );

  return (
    <SeoLandingPage
      eyebrow="Remote Data Science Jobs"
      title="Remote Data Science jobs."
      description="Find remote Data Scientist jobs, analytics roles, forecasting jobs, Python data jobs, and AI-focused Data Science opportunities."
      jobs={jobs}
      adId="remote-data-science-jobs-top"
      introTitle="Remote Data Science job search"
      introText="This page focuses on remote data scientist, data analytics, statistics, forecasting, and AI data roles."
    />
  );
}