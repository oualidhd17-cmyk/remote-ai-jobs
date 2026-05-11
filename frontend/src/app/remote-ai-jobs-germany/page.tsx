import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs Germany | Work From Home AI Jobs',
  description:
    'Browse remote AI jobs in Germany, including Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product roles.',
  path: '/remote-ai-jobs-germany/',
});

export default function RemoteAiJobsGermanyPage() {
  const jobs = getJobs().filter(
    (job) => job.country === 'Germany' && job.remote_type === 'remote',
  );

  return (
    <SeoLandingPage
      eyebrow="Remote AI Jobs Germany"
      title="Remote AI jobs in Germany."
      description="Find remote AI jobs in Germany across Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product."
      jobs={jobs}
      adId="remote-ai-jobs-germany-top"
    />
  );
}