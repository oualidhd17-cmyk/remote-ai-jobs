import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Prompt Engineer Jobs | Remote LLM and AI Prompt Jobs',
  description:
    'Browse Prompt Engineer jobs, LLM prompt jobs, ChatGPT jobs, LangChain jobs, generative AI jobs, and remote AI writing automation roles.',
  path: '/prompt-engineer-jobs/',
});

export default function PromptEngineerJobsPage() {
  const jobs = getJobs().filter(
    (job) =>
      job.category === 'Prompt Engineering' ||
      job.skills.includes('LLM') ||
      job.skills.includes('LangChain') ||
      job.skills.includes('OpenAI') ||
      job.title.toLowerCase().includes('prompt'),
  );

  return (
    <SeoLandingPage
      eyebrow="Prompt Engineer Jobs"
      title="Prompt Engineer and LLM jobs."
      description="Find Prompt Engineer jobs, LLM prompt jobs, LangChain jobs, ChatGPT jobs, OpenAI-related roles, and remote generative AI jobs."
      jobs={jobs}
      adId="prompt-engineer-jobs-top"
      introTitle="Prompt Engineering job search"
      introText="This page targets candidates searching for prompt engineering, LLM applications, ChatGPT automation, LangChain, and generative AI jobs."
    />
  );
}