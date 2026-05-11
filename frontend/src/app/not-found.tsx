import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-card">
          <span className="eyebrow">404</span>
          <h1>Page not found.</h1>
          <p>
            The page or job you are looking for does not exist or was removed.
          </p>

          <div className="hero-actions">
            <Link href="/jobs/" className="btn btn-primary">
              Browse jobs
            </Link>

            <Link href="/" className="btn btn-secondary">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}