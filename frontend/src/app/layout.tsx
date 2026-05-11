import type { Metadata } from 'next';
import Script from 'next/script';

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

const GA_MEASUREMENT_ID = 'G-LE59SCEGVJ';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}