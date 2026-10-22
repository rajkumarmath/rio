import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "REVA AlumniSphere",
  description: "Official Alumni Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="container flex justify-between items-center" style={{ height: '100px' }}>
            <Link href="/" className="flex items-center gap-sm" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              <Image src="/logo.png" alt="University Logo" width={90} height={90} style={{ objectFit: 'contain' }} priority />
              REVA AlumniSphere
            </Link>
            <nav className="flex items-center gap-xs" style={{ flexWrap: 'wrap' }}>
              <Link href="/alumni" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)', padding: '0.5rem 1rem', fontSize: '0.88rem' }}>Directory</Link>
              <Link href="/mentorship" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)', padding: '0.5rem 1rem', fontSize: '0.88rem' }}>Mentorship</Link>
              <Link href="/achievers" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)', padding: '0.5rem 1rem', fontSize: '0.88rem' }}>Achievers</Link>
              <Link href="/opportunities" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)', padding: '0.5rem 1rem', fontSize: '0.88rem' }}>Opportunities</Link>
              <Link href="/services" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)', padding: '0.5rem 1rem', fontSize: '0.88rem' }}>Services</Link>
              <Link href="/signin" className="btn btn-accent" style={{ padding: '0.55rem 1.3rem', fontSize: '0.88rem' }}>Sign In</Link>
            </nav>
          </div>
        </header>

        <main style={{ minHeight: 'calc(100vh - 100px - 140px)', padding: 'var(--spacing-md) 0' }}>
          {children}
        </main>

        <footer style={{ padding: 'var(--spacing-md) 0', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
          <div className="container flex flex-col items-center gap-xs text-center">
            <div className="flex items-center gap-xs mb-xs">
              <span className="badge-reva-navy">NAAC A+ ACCREDITED</span>
              <span className="badge-mentor">35,000+ ALUMNI GLOBALLY</span>
            </div>
            <p style={{ fontWeight: 600, color: 'var(--primary-color)' }}>&copy; 2026 REVA UNIVERSITY &bull; REVA Alumni Association (RUAA)</p>
            <p className="text-sm">Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bengaluru, Karnataka, India - 560064</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Chancellor: Dr. P. Shyama Raju &bull; Established under Govt. of Karnataka Act No. 13 of 2013</p>
            <p className="text-sm mt-xs" style={{ color: 'var(--accent-color)', fontWeight: 500 }}>&ldquo;Knowledge is Power&rdquo; &mdash; Connecting Graduates Across 45+ Nations</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
