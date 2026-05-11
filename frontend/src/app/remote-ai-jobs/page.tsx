import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs | Work From Anywhere AI Jobs',
  description:
    'Browse remote AI jobs, Machine Learning jobs, Data Science jobs, MLOps jobs, and Prompt Engineering jobs from public sources.',
  path: '/remote-ai-jobs/',
});

export default function RemoteAiJobsPage() {
  const jobs = getJobs().filter((job) => job.remote_type === 'remote');

  return (
    <SeoLandingPage
      eyebrow="Remote AI Jobs"
      title="Remote AI jobs from public hiring sources."
      description="Find remote AI jobs across Machine Learning, Data Science, MLOps, Prompt Engineering, NLP, Computer Vision, and AI Product roles."
      jobs={jobs}
      adId="remote-ai-jobs-top"
      introTitle="Why remote AI jobs are a strong niche"
      introText="Remote AI roles attract high-intent search traffic because candidates often search by skill, location, visa sponsorship, and remote work type. This page is built for static SEO discovery."
    />
  );
}