import { notFound } from 'next/navigation';

import { AdSlot } from '@/components/AdSlot';
import { JobCard } from '@/components/JobCard';
import { getCountries, getJobsByCountrySlug } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';

type CountryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getCountries().map((country) => ({
    slug: country.slug,
  }));
}

export async function generateMetadata({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountries().find((item) => item.slug === slug);

  if (!country) {
    return buildMetadata({
      title: 'AI Jobs by Country | Remote AI Hires',
      description: 'Browse remote AI jobs by country.',
      path: '/jobs/',
    });
  }

  return buildMetadata({
    title: `Remote AI Jobs in ${country.name} | Remote AI Hires`,
    description: `Browse remote AI jobs in ${country.name}, including Machine Learning, Data Science, MLOps, and visa sponsorship jobs.`,
    path: `/countries/${country.slug}/`,
  });
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountries().find((item) => item.slug === slug);

  if (!country) {
    notFound();
  }

  const jobs = getJobsByCountrySlug(slug);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <span className="eyebrow">Country</span>
            <h1>Remote AI jobs in {country.name}.</h1>
            <p>
              Browse {jobs.length} AI jobs for {country.name}, including remote,
              hybrid, Machine Learning, Data Science, and MLOps roles.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AdSlot id={`country-${country.slug}-top`} size="728x90" />
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