import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'AI Jobs with Visa Sponsorship | Remote AI Hires',
  description:
    'Find AI jobs with visa sponsorship, relocation support, work visa support, H1B sponsorship, and remote AI hiring opportunities.',
  path: '/ai-jobs-with-visa-sponsorship/',
});

export default function AiJobsWithVisaSponsorshipPage() {
  const jobs = getJobs().filter((job) => job.visa_sponsorship);

  return (
    <SeoLandingPage
      eyebrow="Visa Sponsorship AI Jobs"
      title="AI jobs with visa sponsorship."
      description="Browse AI jobs that mention visa sponsorship, relocation support, work visa support, H1B sponsorship, or skilled worker visa support."
      jobs={jobs}
      adId="visa-ai-jobs-top"
      primaryCtaHref="/jobs/"
      primaryCtaLabel="Search all AI jobs"
      secondaryCtaHref="/remote-ai-jobs/"
      secondaryCtaLabel="Remote AI jobs"
      introTitle="AI visa sponsorship job search"
      introText="This page focuses on high-intent searches from international candidates looking for AI, Machine Learning, Data Science, and MLOps jobs with possible visa support."
    />
  );
}