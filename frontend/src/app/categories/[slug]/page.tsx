import { notFound } from 'next/navigation';

import { AdSlot } from '@/components/AdSlot';
import { JobCard } from '@/components/JobCard';
import { getCategories, getJobsByCategorySlug } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getCategories().map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);

  if (!category) {
    return buildMetadata({
      title: 'AI Job Category | Remote AI Hires',
      description: 'Browse remote AI jobs by category.',
      path: '/jobs/',
    });
  }

  return buildMetadata({
    title: `Remote ${category.name} Jobs | Remote AI Hires`,
    description: `Browse remote ${category.name} jobs, AI jobs, Machine Learning jobs, and visa sponsorship opportunities.`,
    path: `/categories/${category.slug}/`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const jobs = getJobsByCategorySlug(slug);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <span className="eyebrow">Category</span>
            <h1>Remote {category.name} jobs.</h1>
            <p>
              Browse {jobs.length} remote {category.name} jobs from public
              sources.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AdSlot id={`category-${category.slug}-top`} size="728x90" />
        </div>
      </section>

      <section className="section">
        <div className="container jobs-list">
          {jobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      </section>
    </>
  );
}