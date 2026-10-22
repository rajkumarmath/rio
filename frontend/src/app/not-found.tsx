import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-lg" style={{ maxWidth: '640px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '3rem 2rem' }}>
        <span className="badge-reva-navy mb-sm" style={{ display: 'inline-block' }}>HTTP 404 &bull; RECORD NOT FOUND</span>
        
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0.75rem 0 0.5rem 0' }}>
          Page or Profile Not Found
        </h1>
        
        <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The requested alumni record, announcement, or university resource could not be located. It may have been relocated, unlisted by the graduate, or the URL might be misformatted.
        </p>

        <div className="flex justify-center gap-sm" style={{ flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-outline" style={{ padding: '0.75rem 1.75rem' }}>
            ← Return to Home
          </Link>
          <Link href="/alumni" className="btn btn-accent" style={{ padding: '0.75rem 2rem' }}>
            Browse Directory →
          </Link>
          <Link href="/mentorship" className="btn btn-outline" style={{ padding: '0.75rem 1.75rem' }}>
            Mentorship Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
