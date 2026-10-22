import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | REVA University AlumniSphere",
  description: "Terms and conditions of use for the REVA University AlumniSphere platform and RUAA network services.",
};

export default function TermsPage() {
  return (
    <div className="container py-lg" style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '3rem' }}>
        <div className="mb-lg">
          <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>GOVERNANCE &amp; POLICY</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-secondary text-sm mt-xs">
            Last Updated: October 2026 | REVA University Alumni Association (RUAA)
          </p>
        </div>

        <div className="flex flex-col gap-lg" style={{ color: 'var(--text-primary)', lineHeight: 1.75 }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, claiming an alumni profile, or using any service within REVA AlumniSphere, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms, you must refrain from using the platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              2. Eligibility &amp; Profile Claiming
            </h2>
            <p>
              Access to alumni profile modification is exclusively restricted to verified degree-holders and certificate alumni of REVA University or REVA Group of Educational Institutions. When claiming or signing in to a profile:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>You must use your designated email address registered with REVA University records.</li>
              <li>You may not impersonate any other alumnus, student, faculty member, or university administrator.</li>
              <li>You are solely responsible for safeguarding your authentication credentials.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              3. Code of Professional Conduct
            </h2>
            <p>
              REVA AlumniSphere is an academic and professional institution platform. Users agree to:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Engage respectfully with fellow alumni, students, and faculty members.</li>
              <li>Provide truthful, verifiable career achievements, designations, and employer details.</li>
              <li>Refrain from automated bulk data harvesting, web scraping, commercial solicitation, or unsolicited marketing.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              4. Mentorship Engagements
            </h2>
            <p>
              Alumni who activate the &ldquo;Open to Mentor&rdquo; badge agree to offer constructive career guidance, interview preparation, and placement advice to students in a professional capacity. Mentorship is provided on a voluntary, non-commercial basis.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              5. Intellectual Property &amp; University Branding
            </h2>
            <p>
              The names &ldquo;REVA University&rdquo;, &ldquo;REVA AlumniSphere&rdquo;, &ldquo;RUAA&rdquo;, associated logos, crests, and institutional emblems are the exclusive intellectual property of REVA University. Unauthorized reproduction for commercial ventures is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              6. Termination &amp; Profile Delisting
            </h2>
            <p>
              REVA University reserves the right to suspend or revoke access to any account that violates institutional ethics, submits falsified data, or engages in abusive conduct towards community members.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              7. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These terms are governed by the laws of India. Any legal disputes arising out of the use of this portal shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
          </section>
        </div>

        <div className="mt-lg pt-md" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/privacy" className="text-sm font-semibold">
            &larr; View Privacy Policy
          </Link>
          <Link href="/signin" className="btn btn-accent" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            Proceed to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
