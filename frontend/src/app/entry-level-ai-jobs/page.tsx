import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getEntryLevelJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Entry Level AI Jobs | Junior Remote AI Jobs',
  description:
    'Browse entry level AI jobs, junior AI jobs, graduate Machine Learning roles, AI internships, and remote beginner-friendly AI opportunities.',
  path: '/entry-level-ai-jobs/',
});

export default function EntryLevelAiJobsPage() {
  const jobs = getEntryLevelJobs();

  return (
    <SeoLandingPage
      eyebrow="Entry Level AI Jobs"
      title="Entry level AI jobs for juniors and new graduates."
      description="Find entry-level AI jobs, junior Machine Learning jobs, AI internships, graduate Data Science roles, and beginner-friendly remote AI opportunities."
      jobs={jobs}
      adId="entry-level-ai-jobs-top"
      secondaryCtaHref="/junior-ai-jobs/"
      secondaryCtaLabel="Junior AI jobs"
      introTitle="Entry level AI job opportunities"
      introText="This page targets candidates searching for beginner-friendly AI roles, junior AI jobs, internships, and graduate opportunities."
    />
  );
}