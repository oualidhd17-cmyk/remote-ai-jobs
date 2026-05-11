import Link from 'next/link';

import { AdSlot } from '@/components/AdSlot';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <AdSlot
          id="footer-ad"
          size="728x90"
          position="footer"
          className="footer-ad"
        />

        <div className="footer-grid">
          <div>
            <h3>Remote AI Hires</h3>
            <p>
              Curated remote AI, Machine Learning, Data Science, and MLOps jobs
              from public sources.
            </p>
          </div>

          <div>
            <h4>Popular Searches</h4>
            <Link href="/remote-ai-jobs/">Remote AI Jobs</Link>
            <Link href="/ai-jobs-with-visa-sponsorship/">AI Jobs with Visa</Link>
            <Link href="/remote-machine-learning-jobs/">Machine Learning</Link>
          </div>

          <div>
            <h4>Countries</h4>
            <Link href="/ai-jobs-usa/">USA</Link>
            <Link href="/ai-jobs-canada/">Canada</Link>
            <Link href="/ai-jobs-germany/">Germany</Link>
            <Link href="/ai-jobs-uk/">UK</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Remote AI Hires</span>
          <span>Source links go to original company websites.</span>
        </div>
      </div>
    </footer>
  );
}