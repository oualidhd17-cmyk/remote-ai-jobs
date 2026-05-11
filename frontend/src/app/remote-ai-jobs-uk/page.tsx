import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs UK | Work From Home AI Jobs',
  description:
    'Browse remote AI jobs in the UK, including Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product roles.',
  path: '/remote-ai-jobs-uk/',
});

export default function RemoteAiJobsUkPage() {
  const jobs = getJobs().filter(
    (job) => job.country === 'UK' && job.remote_type === 'remote',
  );

  return (
    <SeoLandingPage
      eyebrow="Remote AI Jobs UK"
      title="Remote AI jobs in the UK."
      description="Find remote AI jobs in the UK across Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product."
      jobs={jobs}
      adId="remote-ai-jobs-uk-top"
    />
  );
}