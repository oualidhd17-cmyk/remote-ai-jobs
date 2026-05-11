import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote Machine Learning Jobs | ML Engineer Jobs',
  description:
    'Browse remote Machine Learning jobs, ML Engineer jobs, model training roles, MLOps-adjacent positions, and AI engineering jobs.',
  path: '/remote-machine-learning-jobs/',
});

export default function RemoteMachineLearningJobsPage() {
  const jobs = getJobs().filter(
    (job) =>
      job.category === 'Machine Learning' ||
      job.skills.includes('Machine Learning') ||
      job.skills.includes('TensorFlow') ||
      job.skills.includes('PyTorch'),
  );

  return (
    <SeoLandingPage
      eyebrow="Remote Machine Learning Jobs"
      title="Remote Machine Learning jobs."
      description="Find remote Machine Learning Engineer jobs, ML model training roles, deep learning jobs, TensorFlow jobs, PyTorch jobs, and applied AI roles."
      jobs={jobs}
      adId="remote-machine-learning-jobs-top"
      introTitle="Machine Learning jobs for remote candidates"
      introText="This page targets candidates searching for remote ML engineering, model training, deep learning, and production machine learning roles."
    />
  );
} 