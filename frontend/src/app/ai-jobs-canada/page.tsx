import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'AI Jobs Canada | Remote AI Jobs in Canada',
  description:
    'Browse AI jobs in Canada, remote AI jobs, Machine Learning jobs, Data Science roles, MLOps jobs, and visa sponsorship opportunities.',
  path: '/ai-jobs-canada/',
});

export default function AiJobsCanadaPage() {
  const jobs = getJobs().filter((job) => job.country === 'Canada');

  return (
    <SeoLandingPage
      eyebrow="AI Jobs Canada"
      title="AI jobs in Canada."
      description="Find AI jobs in Canada, including remote AI roles, Machine Learning jobs, Data Science jobs, MLOps jobs, and AI engineering opportunities."
      jobs={jobs}
      adId="ai-jobs-canada-top"
      introTitle="AI hiring in Canada"
      introText="This page focuses on AI jobs targeting Canada and remote roles open to Canada-based candidates."
    />
  );
}