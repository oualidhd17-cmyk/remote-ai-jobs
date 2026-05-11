import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'AI Jobs UK | Remote AI Jobs in the United Kingdom',
  description:
    'Browse AI jobs in the UK, remote AI jobs, Machine Learning jobs, Data Science jobs, MLOps roles, and visa sponsorship opportunities.',
  path: '/ai-jobs-uk/',
});

export default function AiJobsUkPage() {
  const jobs = getJobs().filter((job) => job.country === 'UK');

  return (
    <SeoLandingPage
      eyebrow="AI Jobs UK"
      title="AI jobs in the UK."
      description="Find AI jobs in the United Kingdom, including remote AI roles, Machine Learning jobs, Data Science jobs, MLOps roles, and AI product jobs."
      jobs={jobs}
      adId="ai-jobs-uk-top"
      introTitle="AI hiring in the UK"
      introText="This page focuses on AI jobs targeting the UK and remote roles open to UK-based candidates."
    />
  );
}