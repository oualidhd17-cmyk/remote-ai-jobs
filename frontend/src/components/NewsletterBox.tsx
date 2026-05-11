export function NewsletterBox() {
  return (
    <section className="newsletter-box">
      <div>
        <span className="eyebrow">Weekly AI jobs</span>
        <h2>Get weekly remote AI jobs in your inbox.</h2>
        <p>
          Newsletter integration will be added later. This box is ready for
          AdSense, sponsorship, or email capture.
        </p>
      </div>

      <form className="newsletter-form">
        <input type="email" placeholder="you@example.com" disabled />
        <button type="button" disabled>
          Coming soon
        </button>
      </form>
    </section>
  );
}