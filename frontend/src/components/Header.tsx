import Link from 'next/link';

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">AI</span>
          <span className="brand-text">Remote AI Hires</span>
        </Link>

        <nav className="header-nav">
          <Link href="/jobs/">Jobs</Link>
          <Link href="/remote-ai-jobs/">Remote AI Jobs</Link>
          <Link href="/ai-jobs-with-visa-sponsorship/">Visa Jobs</Link>
          <Link href="/entry-level-ai-jobs/">Entry Level</Link>
          <Link href="/stats/">Stats</Link>
        </nav>
      </div>
    </header>
  );
}