import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs USA | Work From Home AI Jobs',
  description:
    'Browse remote AI jobs in the USA, including Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product roles.',
  path: '/remote-ai-jobs-usa/',
});

export default function RemoteAiJobsUsaPage() {
  const jobs = getJobs().filter(
    (job) => job.country === 'USA' && job.remote_type === 'remote',
  );

  return (
    <SeoLandingPage
      eyebrow="Remote AI Jobs USA"
      title="Remote AI jobs in the USA."
      description="Find remote AI jobs in the United States across Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product."
      jobs={jobs}
      adId="remote-ai-jobs-usa-top"
    />
  );
}