import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'AI Jobs USA | Remote AI Jobs in the United States',
  description:
    'Browse AI jobs in the USA, including remote AI jobs, Machine Learning jobs, Data Science jobs, MLOps roles, and visa sponsorship opportunities.',
  path: '/ai-jobs-usa/',
});

export default function AiJobsUsaPage() {
  const jobs = getJobs().filter((job) => job.country === 'USA');

  return (
    <SeoLandingPage
      eyebrow="AI Jobs USA"
      title="AI jobs in the USA."
      description="Find AI jobs in the United States, including remote AI roles, Machine Learning jobs, Data Science jobs, MLOps jobs, and AI product roles."
      jobs={jobs}
      adId="ai-jobs-usa-top"
      introTitle="AI hiring in the USA"
      introText="This page focuses on AI jobs targeting the United States and remote roles open to US-based candidates."
    />
  );
}