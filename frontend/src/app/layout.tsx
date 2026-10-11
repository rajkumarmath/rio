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
            <nav className="flex gap-md">
              <Link href="/alumni" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)' }}>Directory</Link>
              <Link href="/announcements" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)' }}>Announcements</Link>
              <Link href="/association" className="btn btn-outline" style={{ border: 'none', boxShadow: 'var(--neu-flat)' }}>Association</Link>
            </nav>
          </div>
        </header>

        <main style={{ minHeight: 'calc(100vh - 100px - 100px)', padding: 'var(--spacing-md) 0' }}>
          {children}
        </main>

        <footer style={{ padding: 'var(--spacing-md) 0', marginTop: 'auto' }}>
          <div className="container flex flex-col items-center gap-sm text-center">
            <p>&copy; 2026 REVA UNIVERSITY. All rights reserved.</p>
            <p className="text-sm">Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bangalore, Karnataka, India, 560064</p>
            <p className="text-sm mt-xs" style={{ color: 'var(--primary-light)' }}>A secure platform for our global alumni network.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
