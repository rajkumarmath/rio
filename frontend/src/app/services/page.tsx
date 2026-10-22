import Link from "next/link";

export const instant = false;

const SERVICES = [
  {
    title: "Official Academic Transcripts & Duplicate Marksheets",
    description: "Official sealed transcripts required for higher studies (WES, US, UK, Canada, Australia) and employment verification.",
    processingTime: "5 - 7 Working Days",
    department: "Office of the Controller of Examinations (COE)",
    contact: "coe@reva.edu.in",
  },
  {
    title: "Degree Verification & WES Evaluation Attestation",
    description: "Direct academic credentials authentication for World Education Services (WES), ICAS, IQAS, and international immigration authorities.",
    processingTime: "3 - 5 Working Days",
    department: "University Registrar Secretariat",
    contact: "registrar@reva.edu.in",
  },
  {
    title: "Permanent REVA Alumni Smart Card",
    description: "Personalized smart card granting lifelong campus access to the Central Library, indoor gymnasium, guest house, and sports pavilion at Rukmini Knowledge Park.",
    processingTime: "2 - 3 Working Days (Digital card issued instantly)",
    department: "REVA Alumni Association (RUAA) Office",
    contact: "alumni@reva.edu.in",
  },
  {
    title: "Campus Revisit & Guest Entry Pass",
    description: "Alumni visiting Rukmini Knowledge Park with family or colleagues can request campus parking and facility passes in advance.",
    processingTime: "Same Day Approval",
    department: "Campus Security & Hospitality Desk",
    contact: "security@reva.edu.in",
  },
];

export default function ServicesPage() {
  return (
    <div className="container py-lg">
      <div className="card mb-lg text-center" style={{ padding: '3rem 1.5rem', background: 'var(--bg-color)' }}>
        <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>OFFICIAL PROCEDURES</span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
          Alumni Services &amp; Transcripts Desk
        </h1>
        <p className="text-secondary" style={{ maxWidth: '750px', margin: '0.75rem auto 1.5rem', lineHeight: 1.6 }}>
          Direct access to official university administrative services, transcript processing, WES verification, and alumni card issuance from the Registrar Secretariat at Rukmini Knowledge Park.
        </p>

        <div className="flex justify-center gap-md">
          <a
            href="mailto:alumni@reva.edu.in?subject=Alumni%20Service%20Request%20-%20REVA%20University"
            className="btn btn-accent"
            style={{ padding: '0.75rem 1.8rem' }}
          >
            Email University Desk Directly
          </a>
          <Link href="/association" className="btn btn-outline" style={{ padding: '0.75rem 1.8rem' }}>
            Association Office Hours
          </Link>
        </div>
      </div>

      <div className="grid gap-md">
        {SERVICES.map((srv, i) => (
          <div key={i} className="card flex items-start justify-between" style={{ padding: '1.75rem', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                {srv.title}
              </h3>
              <p className="text-secondary text-sm" style={{ lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {srv.description}
              </p>

              <div className="flex gap-md text-xs text-secondary" style={{ flexWrap: 'wrap' }}>
                <div>
                  <strong>Processing Window:</strong> {srv.processingTime}
                </div>
                <div>
                  <strong>Authority:</strong> {srv.department}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-sm">
              <a
                href={`mailto:${srv.contact}?subject=${encodeURIComponent(srv.title + ' Request')}&body=${encodeURIComponent('Dear Administrative Officer,\n\nI am a graduate of REVA University writing to request the following service:\n\nFull Name:\nRegistration Number / SRN:\nDegree & Branch:\nGraduation Year:\n\nThank you.')}`}
                className="btn btn-outline flex items-center gap-xs"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Initiate Request
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
