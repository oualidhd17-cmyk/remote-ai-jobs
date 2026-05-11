import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Junior AI Jobs | Remote Junior Machine Learning Jobs',
  description:
    'Find junior AI jobs, junior Machine Learning jobs, junior Data Science roles, and remote AI jobs for early-career candidates.',
  path: '/junior-ai-jobs/',
});

export default function JuniorAiJobsPage() {
  const jobs = getJobs().filter((job) =>
    ['junior', 'entry', 'intern'].includes(job.experience_level),
  );

  return (
    <SeoLandingPage
      eyebrow="Junior AI Jobs"
      title="Junior AI jobs for early-career candidates."
      description="Browse junior AI jobs, junior Machine Learning roles, junior Data Science jobs, and remote AI opportunities for early-career candidates."
      jobs={jobs}
      adId="junior-ai-jobs-top"
      secondaryCtaHref="/entry-level-ai-jobs/"
      secondaryCtaLabel="Entry level AI jobs"
      introTitle="Junior AI job search"
      introText="This page is optimized for candidates looking for junior AI positions, junior ML engineering roles, and early-career remote AI jobs."
    />
  );
}