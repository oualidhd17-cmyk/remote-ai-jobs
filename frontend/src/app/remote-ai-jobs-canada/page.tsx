import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote AI Jobs Canada | Work From Home AI Jobs',
  description:
    'Browse remote AI jobs in Canada, including Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product roles.',
  path: '/remote-ai-jobs-canada/',
});

export default function RemoteAiJobsCanadaPage() {
  const jobs = getJobs().filter(
    (job) => job.country === 'Canada' && job.remote_type === 'remote',
  );

  return (
    <SeoLandingPage
      eyebrow="Remote AI Jobs Canada"
      title="Remote AI jobs in Canada."
      description="Find remote AI jobs in Canada across Machine Learning, Data Science, MLOps, Prompt Engineering, and AI Product."
      jobs={jobs}
      adId="remote-ai-jobs-canada-top"
    />
  );
}