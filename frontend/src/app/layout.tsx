import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alumni.reva.edu.in"),
  title: {
    default: "REVA AlumniSphere | Official Alumni Network of REVA University",
    template: "%s | REVA AlumniSphere",
  },
  description:
    "Official global alumni platform of REVA University, Rukmini Knowledge Park, Bengaluru. Discover verified graduates, connect on LinkedIn & Gmail, and engage in mentorship.",
  keywords: [
    "REVA University",
    "REVA Alumni",
    "Bengaluru",
    "Rukmini Knowledge Park",
    "RUAA",
    "Mentorship",
    "Higher Education",
    "Engineering",
    "Management",
  ],
  authors: [{ name: "REVA University Alumni Association" }],
  creator: "REVA University",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    title: "REVA AlumniSphere - Official University Alumni Network",
    description:
      "Connect with verified graduates from REVA University across 45+ nations. Find mentors and career referrals.",
    url: "https://alumni.reva.edu.in",
    siteName: "REVA AlumniSphere",
    images: [
      {
        url: "/reva_campus_main.jpg",
        width: 1200,
        height: 630,
        alt: "REVA University Rukmini Knowledge Park Campus",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REVA AlumniSphere - Official University Alumni Network",
    description: "Connect with verified graduates from REVA University across 45+ nations.",
    images: ["/reva_campus_main.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main style={{ minHeight: "calc(100vh - 88px - 160px)", padding: "var(--spacing-md) 0" }}>
          {children}
        </main>

        <footer style={{ padding: "var(--spacing-md) 0", marginTop: "auto", borderTop: "1px solid var(--border-color)" }}>
          <div className="container flex flex-col items-center gap-xs text-center">
            <div className="flex items-center gap-xs mb-xs" style={{ flexWrap: "wrap", justifyContent: "center" }}>
              <span className="badge-reva-navy">NAAC A+ ACCREDITED</span>
              <span className="badge-mentor">35,000+ ALUMNI GLOBALLY</span>
            </div>

            <p style={{ fontWeight: 600, color: "var(--primary-color)" }}>
              &copy; 2026 REVA UNIVERSITY &bull; REVA Alumni Association (RUAA)
            </p>
            <p className="text-sm">
              Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bengaluru, Karnataka, India - 560064
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Chancellor: Dr. P. Shyama Raju &bull; Established under Govt. of Karnataka Act No. 13 of 2013
            </p>
            <p className="text-sm mt-xs" style={{ color: "var(--accent-color)", fontWeight: 500 }}>
              &ldquo;Knowledge is Power&rdquo; - Connecting Graduates Across 45+ Nations
            </p>

            <div
              className="flex items-center justify-center gap-md mt-sm pt-xs"
              style={{
                borderTop: "1px solid rgba(234, 88, 12, 0.1)",
                width: "100%",
                maxWidth: "500px",
                flexWrap: "wrap",
              }}
            >
              <Link href="/privacy" className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Privacy Policy
              </Link>
              <span style={{ color: "var(--border-color)" }}>&bull;</span>
              <Link href="/terms" className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Terms &amp; Conditions
              </Link>
              <span style={{ color: "var(--border-color)" }}>&bull;</span>
              <Link href="/association" className="text-xs" style={{ color: "var(--text-secondary)" }}>
                About RUAA
              </Link>
              <span style={{ color: "var(--border-color)" }}>&bull;</span>
              <Link href="/services" className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Contact &amp; Services
              </Link>
            </div>
          </div>
        </footer>

        <CookieConsentBanner />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
