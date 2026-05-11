import { SeoLandingPage } from '@/components/SeoLandingPage';
import { getJobs } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Remote MLOps Jobs | ML Platform and Model Deployment Jobs',
  description:
    'Browse remote MLOps jobs, ML Platform jobs, model deployment roles, MLflow jobs, Kubeflow jobs, Docker, Kubernetes, and AI infrastructure jobs.',
  path: '/remote-mlops-jobs/',
});

export default function RemoteMlopsJobsPage() {
  const jobs = getJobs().filter(
    (job) =>
      job.category === 'MLOps' ||
      job.skills.includes('MLOps') ||
      job.skills.includes('Docker') ||
      job.skills.includes('Kubernetes') ||
      job.skills.includes('MLflow') ||
      job.skills.includes('Kubeflow'),
  );

  return (
    <SeoLandingPage
      eyebrow="Remote MLOps Jobs"
      title="Remote MLOps and ML Platform jobs."
      description="Find remote MLOps jobs, ML Platform Engineer jobs, model deployment roles, MLflow jobs, Kubeflow jobs, Docker jobs, and Kubernetes AI infrastructure roles."
      jobs={jobs}
      adId="remote-mlops-jobs-top"
      introTitle="MLOps and AI infrastructure roles"
      introText="This page targets remote MLOps, ML platform, model deployment, AI infrastructure, Docker, Kubernetes, and ML pipeline roles."
    />
  );
}