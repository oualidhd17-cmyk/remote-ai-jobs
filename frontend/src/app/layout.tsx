import type { Metadata } from 'next';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import './globals.css';

export const metadata: Metadata = {
  title: 'Remote AI Hires | Remote AI Jobs with Visa Sponsorship',
  description:
    'Find remote AI jobs, Machine Learning jobs, Data Science jobs, MLOps jobs, and AI jobs with visa sponsorship.',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}