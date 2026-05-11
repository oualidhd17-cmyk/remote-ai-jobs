import type { Metadata } from 'next';

const siteName = 'Remote AI Hires';
const siteUrl = 'https://remote-ai-jobs.pages.dev';

type SeoInput = {
  title: string;
  description: string;
  path?: string;
};

export function buildMetadata(input: SeoInput): Metadata {
  const path = input.path || '/';
  const canonical = `${siteUrl}${path}`;

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
  };
}

export function getSiteUrl(): string {
  return siteUrl;
}

export function getSiteName(): string {
  return siteName;
}