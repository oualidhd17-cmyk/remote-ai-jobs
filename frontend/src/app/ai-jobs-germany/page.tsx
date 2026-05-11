import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'AI Jobs Germany | Remote AI Jobs in Germany',
  description:
    'Browse AI jobs in Germany, remote AI jobs, Machine Learning jobs, Data Science jobs, MLOps roles, and visa sponsorship opportunities.',
  path: '/ai-jobs-germany/',
});

export default function AiJobsGermanyPage() {
  const jobs = getJobs().filter((job) => job.country === 'Germany');

  return (
    <SeoLandingPage
      eyebrow="AI Jobs Germany"
      title="AI jobs in Germany."
      description="Find AI jobs in Germany, including remote AI roles, Machine Learning jobs, Data Science jobs, MLOps roles, and AI product roles."
      jobs={jobs}
      adId="ai-jobs-germany-top"
      introTitle="AI hiring in Germany"
      introText="This page focuses on AI jobs targeting Germany and remote roles open to Germany-based candidates."
    />
  );
}