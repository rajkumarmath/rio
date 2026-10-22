import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | REVA University AlumniSphere",
  description: "Official Institutional Privacy Policy for REVA University Alumni Association, detailing alumni data protection, access governance, and DPDP compliance.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-lg" style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '3rem' }}>
        <div className="mb-lg">
          <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>LEGAL &amp; COMPLIANCE</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p className="text-secondary text-sm mt-xs">
            Effective Date: October 2026 | REVA University Alumni Association (RUAA)
          </p>
        </div>

        <div className="flex flex-col gap-lg" style={{ color: 'var(--text-primary)', lineHeight: 1.75 }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              1. Institutional Commitment &amp; Scope
            </h2>
            <p>
              REVA University and the REVA University Alumni Association (RUAA) are committed to safeguarding the privacy and personal information of our graduates, faculty, students, and visitors. This policy outlines how information is gathered, verified, stored, and displayed on the REVA AlumniSphere platform in compliance with India&rsquo;s Digital Personal Data Protection (DPDP) Act, 2023 and international privacy standards.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              2. Data Collected &amp; Pre-Imported Records
            </h2>
            <p>
              To maintain an accurate institutional register of graduates, REVA University pre-populates alumni profiles using verified registrar records, including:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Full Name, School/Department of study, and Graduation Year</li>
              <li>Official university-issued or designated personal email address</li>
              <li>Employment histories and publicly accessible professional LinkedIn URLs provided upon graduation or during reunions</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              3. Strict Profile Ownership &amp; Access Control
            </h2>
            <p>
              We enforce strict cryptographic and session-based access governance over alumni records:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>
                <strong>Self-Modification Solely by Verified Alumnus:</strong> An alumni profile can ONLY be edited by the individual graduate after authenticating via their registered email address and password.
              </li>
              <li>
                <strong>Administrative Oversight:</strong> Authorized university administrators may update or verify records through the authenticated administrative control panel.
              </li>
              <li>
                <strong>Read-Only for General Users &amp; Students:</strong> Public visitors, prospective employers, and current students have strict read-only access to published alumni directory entries. No public &ldquo;Edit&rdquo; controls are exposed to unauthorized users.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              4. Direct Professional Contact (Gmail &amp; LinkedIn)
            </h2>
            <p>
              The platform facilitates direct professional networking by allowing registered alumni to display their professional LinkedIn profile and a secure Gmail contact link. Sensitive contact details such as private phone numbers and authentication credentials are never exposed publicly.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              5. Cookies and Session Security
            </h2>
            <p>
              REVA AlumniSphere uses strictly necessary, HTTP-only authentication cookies to preserve secure login sessions for alumni and administrators. We do not use third-party behavioral advertising trackers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              6. Rights of Correction and Opt-Out
            </h2>
            <p>
              Alumni retain full authority over their published records. You may update your employment history, bio, location, and mentor status at any time. If you wish to delist your public directory card or request data deletion, contact the Alumni Relations Office at <a href="mailto:alumni@reva.edu.in">alumni@reva.edu.in</a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              7. Contact &amp; Grievance Redressal
            </h2>
            <p>
              REVA University Alumni Relations Office<br />
              Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bengaluru, Karnataka 560064, India<br />
              Email: <a href="mailto:alumni@reva.edu.in">alumni@reva.edu.in</a> | Phone: +91 80 4696 6966
            </p>
          </section>
        </div>

        <div className="mt-lg pt-md" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/terms" className="text-sm font-semibold">
            Read Terms &amp; Conditions &rarr;
          </Link>
          <Link href="/alumni" className="btn btn-accent" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
            Return to Alumni Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
